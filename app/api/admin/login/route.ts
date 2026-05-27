import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminSessionMaxAgeSeconds,
  getAdminSessionSecret,
} from "@/lib/admin-auth";

const sessionCookieName = "prime_nps_admin_session";

export async function POST(request: Request) {
  const { username, password } = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = getAdminSessionSecret();

  if (!expectedUsername || !expectedPassword || !sessionSecret) {
    return NextResponse.json(
      { message: "Credenciais administrativas não configuradas." },
      { status: 503 },
    );
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json(
      { message: "Usuário ou senha inválidos." },
      { status: 401 },
    );
  }

  const sessionValue = await createAdminSessionToken(expectedUsername, sessionSecret);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(sessionCookieName, sessionValue, {
    httpOnly: true,
    maxAge: getAdminSessionMaxAgeSeconds(),
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
