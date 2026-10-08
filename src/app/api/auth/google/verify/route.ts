import { NextRequest, NextResponse } from "next/server";
import { authenticateGoogleUser, SESSION_COOKIE_NAME } from "@/lib/services/auth-service";

export async function POST(request: NextRequest) {
  try {
    const { credential, email, name, picture, sub } = await request.json();
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    let googleProfile = { email, name, picture, sub };

    // If ID token credential was provided, verify with Google's tokeninfo endpoint
    if (credential) {
      const verifyRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );
      if (verifyRes.ok) {
        const payload = await verifyRes.json();
        googleProfile = {
          email: payload.email,
          name: payload.name || payload.email.split("@")[0],
          picture: payload.picture,
          sub: payload.sub,
        };
      }
    }

    if (!googleProfile.email) {
      return NextResponse.json(
        { error: "Valid Google email profile is required." },
        { status: 400 }
      );
    }

    const authResult = await authenticateGoogleUser(googleProfile, ip);

    if (!authResult.success || !authResult.token) {
      return NextResponse.json(
        { error: authResult.error || "Google authentication failed" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: authResult.user,
    });

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
  } catch (error: any) {
    console.error("Google verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify Google login" },
      { status: 500 }
    );
  }
}
