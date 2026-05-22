import { NextResponse } from "next/server";

const sessionCookieName = "prime_nps_admin_session";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));

  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
