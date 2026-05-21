import { NextResponse } from "next/server";
import { getOrCreateSession } from "@/lib/nps-db";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { token } = await params;
  const data = await getOrCreateSession(token);
  return NextResponse.json(data);
}

