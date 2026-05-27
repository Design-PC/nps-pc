import { NextResponse, type NextRequest } from "next/server";
import { getAdminSessionSecret, verifyAdminSessionToken } from "@/lib/admin-auth";

const protectedPaths = ["/admin", "/api/admin"];
const publicAdminPaths = ["/admin/login", "/api/admin/login"];
const sessionCookieName = "prime_nps_admin_session";

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isPublicAdminPath(pathname: string) {
  return publicAdminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

async function hasValidSessionCookie(request: NextRequest, username: string, secret: string) {
  const cookieValue = request.cookies.get(sessionCookieName)?.value;

  if (!cookieValue) {
    return false;
  }

  return verifyAdminSessionToken(cookieValue, username, secret);
}

export async function proxy(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = getAdminSessionSecret();
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname) || isPublicAdminPath(pathname)) {
    return withSecurityHeaders(NextResponse.next());
  }

  if (!username || !password || !sessionSecret) {
    if (process.env.NODE_ENV === "development") {
      return withSecurityHeaders(NextResponse.next());
    }

    return withSecurityHeaders(
      new NextResponse("Admin credentials are not configured", {
        status: 503,
      }),
    );
  }

  if (await hasValidSessionCookie(request, username, sessionSecret)) {
    return withSecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/admin")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return withSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return withSecurityHeaders(
    new NextResponse("Authentication required", {
      status: 401,
    }),
  );
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
