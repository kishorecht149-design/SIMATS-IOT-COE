import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "simats-iot-coe-fallback-secret-2026-strict-key";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const SESSION_COOKIE_NAME = "simats_iot_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // 2. Admin Route Protection
  if (pathname.startsWith("/admin")) {
    // Allow public admin login page
    if (pathname === "/admin/login") {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        try {
          await jwtVerify(token, secretKey);
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } catch {
          // Token expired or invalid, let them stay on login
        }
      }
      return response;
    }

    // Check session token for all other /admin routes
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, secretKey);
      const role = payload.role as string;

      // RBAC Route Rules
      if (pathname.startsWith("/admin/users") && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard?error=unauthorized", request.url));
      }

      if (pathname.startsWith("/admin/settings") && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard?error=unauthorized", request.url));
      }

      if (
        pathname.startsWith("/admin/registrations") &&
        role !== "SUPER_ADMIN" &&
        role !== "REGISTRATION_MANAGER"
      ) {
        return NextResponse.redirect(new URL("/admin/dashboard?error=unauthorized", request.url));
      }

      if (
        (pathname.startsWith("/admin/pages") || pathname.startsWith("/admin/media")) &&
        role !== "SUPER_ADMIN" &&
        role !== "EDITOR"
      ) {
        return NextResponse.redirect(new URL("/admin/dashboard?error=unauthorized", request.url));
      }

      return response;
    } catch (err) {
      // Invalid / Expired Token
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete(SESSION_COOKIE_NAME);
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
