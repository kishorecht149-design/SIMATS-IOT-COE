import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, SESSION_COOKIE_NAME } from "@/lib/services/auth-service";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // Rate limit: 5 login attempts per 5 minutes per IP
    const rateLimit = await checkRateLimit(`login_${ip}`, 5, 5 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 5 minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, honeypot } = body;

    // Honeypot bot protection
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const authResult = await authenticateAdmin(email, password, ip);
    if (!authResult.success || !authResult.token) {
      return NextResponse.json(
        { error: authResult.error || "Authentication failed" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: authResult.user,
    });

    // Set secure httpOnly session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: authResult.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred" },
      { status: 500 }
    );
  }
}
