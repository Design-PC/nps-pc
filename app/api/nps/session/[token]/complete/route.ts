import { NextResponse } from "next/server";
import { completeSession, isRecipientNotFoundError } from "@/lib/nps-db";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { token } = await params;
  const body = await request.json();

  try {
    const data = await completeSession(token, body.answers ?? {}, body.currentStep ?? 0);
    return NextResponse.json(data, { status: data.alreadyCompleted ? 409 : 200 });
  } catch (error) {
    if (isRecipientNotFoundError(error)) {
      return NextResponse.json(
        { message: "Link da pesquisa não localizado." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Não foi possível concluir a pesquisa." },
      { status: 500 },
    );
  }
}
