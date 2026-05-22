import { buildCsv, getExportData } from "@/lib/admin-export";

export const dynamic = "force-dynamic";

export async function GET() {
  const { headers, rows } = await getExportData();
  const csv = buildCsv(headers, rows);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="prime-control-nps-respostas.csv"',
    },
  });
}
