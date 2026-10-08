import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTarget = searchParams.get("redirect") || "/admin/dashboard";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const callbackUrl = `${appUrl}/api/auth/google/callback`;

  // If Google credentials are not yet configured in .env.local, provide a simulated instant login option
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    const demoEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@saveetha.simats.edu";
    // Redirect to callback with a simulated dev token
    const demoCallback = new URL("/api/auth/google/callback", request.url);
    demoCallback.searchParams.set("dev_simulate", "1");
    demoCallback.searchParams.set("email", demoEmail);
    demoCallback.searchParams.set("state", redirectTarget);
    return NextResponse.redirect(demoCallback);
  }

  // Construct Google OAuth 2.0 URL
  const state = encodeURIComponent(redirectTarget);
  const scope = encodeURIComponent("openid email profile");
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    callbackUrl
  )}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=select_account`;

  return NextResponse.redirect(googleAuthUrl);
}
