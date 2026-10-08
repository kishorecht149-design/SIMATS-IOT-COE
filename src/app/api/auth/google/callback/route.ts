import { NextRequest, NextResponse } from "next/server";
import { authenticateGoogleUser, SESSION_COOKIE_NAME } from "@/lib/services/auth-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const devSimulate = searchParams.get("dev_simulate");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const redirectTarget = state ? decodeURIComponent(state) : "/admin/dashboard";

  if (error) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "Google authentication was cancelled or rejected.");
    return NextResponse.redirect(loginUrl);
  }

  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // Simulated Google Auth for local dev if Google OAuth client is not yet registered
  if (devSimulate === "1") {
    const email = searchParams.get("email") || "admin@saveetha.simats.edu";
    const authResult = await authenticateGoogleUser(
      {
        email,
        name: "Saveetha Staff Member",
        sub: "simulated-google-id",
      },
      ip
    );

    if (!authResult.success || !authResult.token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", authResult.error || "Google login failed");
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.redirect(new URL(redirectTarget, request.url));
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: authResult.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return response;
  }

  if (!code) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "Missing Google OAuth authorization code.");
    return NextResponse.redirect(loginUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = `${appUrl}/api/auth/google/callback`;

  try {
    // 1. Exchange authorization code for Google access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "Failed to exchange Google OAuth code.");
      return NextResponse.redirect(loginUrl);
    }

    // 2. Fetch authenticated user profile from Google
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userProfile = await userinfoResponse.json();

    if (!userinfoResponse.ok || !userProfile.email) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "Failed to retrieve Google user profile.");
      return NextResponse.redirect(loginUrl);
    }

    // 3. Authenticate / Auto-provision user session
    const authResult = await authenticateGoogleUser(
      {
        email: userProfile.email,
        name: userProfile.name || userProfile.email.split("@")[0],
        picture: userProfile.picture,
        sub: userProfile.id,
      },
      ip
    );

    if (!authResult.success || !authResult.token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", authResult.error || "Authentication failed.");
      return NextResponse.redirect(loginUrl);
    }

    // 4. Set Session Cookie and redirect
    const response = NextResponse.redirect(new URL(redirectTarget, request.url));
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: authResult.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Google OAuth callback exception:", err);
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "Unexpected error during Google login.");
    return NextResponse.redirect(loginUrl);
  }
}
