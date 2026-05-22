import { NextResponse } from "next/server";

const sessionCookieName = "prime_nps_admin_session";
const oneDayInSeconds = 60 * 60 * 24;

export async function POST(request: Request) {
  const { username, password } = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
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

  const expiresAt = Date.now() + oneDayInSeconds * 1000;
  const sessionValue = btoa(`${expectedUsername}:${expectedPassword}:${expiresAt}`);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(sessionCookieName, sessionValue, {
    httpOnly: true,
    maxAge: oneDayInSeconds,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
