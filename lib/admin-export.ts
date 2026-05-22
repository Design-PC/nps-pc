import { readDb, type NpsDatabase, type NpsRecipient, type NpsSession } from "@/lib/nps-db";
import { surveySteps } from "@/lib/survey";

export type ExportRow = {
  recipient: NpsRecipient;
  session?: NpsSession;
  values: (string | number)[];
};

export const exportQuestions = surveySteps.flatMap((step) => step.questions);

export const exportHeaders = [
  "Token",
  "Status",
  "Nome",
  "E-mail",
  "Empresa",
  "Área",
  "Cargo",
  "Início",
  "Conclusão",
  "Etapa atual",
  ...exportQuestions.map((question) => question.label),
];

export function csvEscape(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function htmlEscape(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function getExportRows(db: NpsDatabase): ExportRow[] {
  return db.recipients.map((recipient) => {
    const session = db.sessions.find((item) => item.token === recipient.token);
    const values = [
      recipient.token,
      recipient.status,
      recipient.name,
      recipient.email,
      recipient.company,
      recipient.area,
      recipient.role,
      recipient.startedAt ?? "",
      recipient.completedAt ?? "",
      recipient.currentStep,
      ...exportQuestions.map((question) => session?.answers[question.id] ?? ""),
    ];

    return { recipient, session, values };
  });
}

export async function getExportData() {
  const db = await readDb();
  return {
    db,
    headers: exportHeaders,
    rows: getExportRows(db),
  };
}

export function buildCsv(headers: string[], rows: ExportRow[]) {
  return [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.values.map(csvEscape).join(",")),
  ].join("\n");
}

