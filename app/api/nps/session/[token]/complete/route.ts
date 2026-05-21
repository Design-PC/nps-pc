import { NextResponse } from "next/server";
import { completeSession } from "@/lib/nps-db";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { token } = await params;
  const body = await request.json();
  const data = await completeSession(token, body.answers ?? {}, body.currentStep ?? 0);
  return NextResponse.json(data, { status: data.alreadyCompleted ? 409 : 200 });
}

