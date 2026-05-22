import { NextResponse } from "next/server";
import { isRecipientNotFoundError, saveAnswers } from "@/lib/nps-db";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { token } = await params;
  const body = await request.json();

  try {
    const data = await saveAnswers(token, body.answers ?? {}, body.currentStep ?? 0);
    return NextResponse.json(data, { status: data.alreadyCompleted ? 409 : 200 });
  } catch (error) {
    if (isRecipientNotFoundError(error)) {
      return NextResponse.json(
        { message: "Link da pesquisa não localizado." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Não foi possível salvar a resposta." },
      { status: 500 },
    );
  }
}
