import { NextResponse } from "next/server";
import { getOrCreateSession, isRecipientNotFoundError } from "@/lib/nps-db";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { token } = await params;

  try {
    const data = await getOrCreateSession(token);
    return NextResponse.json(data);
  } catch (error) {
    if (isRecipientNotFoundError(error)) {
      return NextResponse.json(
        { message: "Link da pesquisa não localizado." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Não foi possível carregar a pesquisa." },
      { status: 500 },
    );
  }
}
