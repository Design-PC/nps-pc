import { readDb } from "@/lib/nps-db";
import { surveySteps } from "@/lib/survey";

function csvEscape(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const db = await readDb();
  const questions = surveySteps.flatMap((step) => step.questions);
  const headers = [
    "token",
    "status",
    "name",
    "email",
    "company",
    "area",
    "role",
    "startedAt",
    "completedAt",
    "currentStep",
    ...questions.map((question) => question.label),
  ];

  const rows = db.recipients.map((recipient) => {
    const session = db.sessions.find((item) => item.token === recipient.token);
    return [
      recipient.token,
      recipient.status,
      recipient.name,
      recipient.email,
      recipient.company,
      recipient.area,
      recipient.role,
      recipient.startedAt,
      recipient.completedAt,
      recipient.currentStep,
      ...questions.map((question) => session?.answers[question.id] ?? ""),
    ];
  });

  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="prime-control-nps-respostas.csv"',
    },
  });
}

