import { NextResponse } from "next/server";
import { startSession } from "@/lib/nps-db";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(_request: Request, { params }: RouteContext) {
  const { token } = await params;
  const data = await startSession(token);
  return NextResponse.json(data);
}

