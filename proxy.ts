import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/admin", "/api/admin"];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function proxy(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!isProtectedPath(request.nextUrl.pathname) || !username || !password) {
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

