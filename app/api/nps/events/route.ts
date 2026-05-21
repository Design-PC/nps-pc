import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/nps-db";

export async function POST(request: Request) {
  const body = await request.json();
  const token = typeof body.token === "string" ? body.token : "unknown";
  const eventName = typeof body.event === "string" ? body.event : "unknown_event";
  await recordEvent(token, eventName, body);
  return NextResponse.json({ ok: true });
}

