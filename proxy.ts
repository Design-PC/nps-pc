import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/admin", "/api/admin"];
const publicAdminPaths = ["/admin/login", "/api/admin/login"];
const sessionCookieName = "prime_nps_admin_session";

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isPublicAdminPath(pathname: string) {
  return publicAdminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function hasValidSessionCookie(request: NextRequest, username: string, password: string) {
  const cookieValue = request.cookies.get(sessionCookieName)?.value;

  if (!cookieValue) {
    return false;
  }

  try {
    const decoded = atob(cookieValue);
    const [providedUsername, providedPassword, expiresAt] = decoded.split(":");

    return (
      providedUsername === username &&
      providedPassword === password &&
      Number(expiresAt) > Date.now()
    );
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname) || isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (!username || !password) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }

    return new NextResponse("Admin credentials are not configured", {
      status: 503,
    });
  }

  if (hasValidSessionCookie(request, username, password)) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Basic ")) {
    const encoded = authorization.slice("Basic ".length);
    const decoded = atob(encoded);
    const [providedUsername, providedPassword] = decoded.split(":");

    if (providedUsername === username && providedPassword === password) {
      return NextResponse.next();
    }
  }

  if (pathname.startsWith("/admin")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Prime Control NPS Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
