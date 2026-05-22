import { getDashboardData } from "@/lib/nps-db";
import { getExportData, htmlEscape } from "@/lib/admin-export";

export const dynamic = "force-dynamic";

function metric(label: string, value: string | number | null) {
  return `
    <tr>
      <td class="metric-label">${htmlEscape(label)}</td>
      <td class="metric-value">${htmlEscape(value ?? "-")}</td>
    </tr>
  `;
}

export async function GET() {
  const [{ headers, rows }, dashboard] = await Promise.all([
    getExportData(),
    getDashboardData(),
  ]);

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; color: #111827; }
        h1 { color: #003f7d; font-size: 22px; margin: 0 0 8px; }
        h2 { color: #374151; font-size: 16px; margin: 22px 0 8px; }
        .note { color: #4b5563; font-size: 12px; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; }
        th { background: #e5e7eb; color: #111827; font-weight: 700; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; vertical-align: top; }
        tr:nth-child(even) td { background: #f8fafc; }
        .metric-label { background: #f3f4f6; font-weight: 700; width: 240px; }
        .metric-value { text-align: left; font-weight: 700; color: #003f7d; }
        .responses th { white-space: normal; }
      </style>
    </head>
    <body>
      <h1>Prime Control - Pesquisa de Satisfação NPS</h1>
      <div class="note">Exportação executiva gerada pela Plataforma NPS Corporativa.</div>

      <h2>Resumo</h2>
      <table>
        ${metric("Convidados", dashboard.summary.totalRecipients)}
        ${metric("Participação", `${dashboard.summary.participationRate}%`)}
        ${metric("Iniciados", dashboard.summary.started)}
        ${metric("Concluídos", dashboard.summary.completed)}
        ${metric("Conclusão", `${dashboard.summary.completionRate}%`)}
        ${metric("Abandono", `${dashboard.summary.abandonmentRate}%`)}
        ${metric("NPS parcial", dashboard.summary.npsScore)}
        ${metric("Score de fricção", dashboard.summary.frictionScore)}
      </table>

      <h2>Respostas</h2>
      <table class="responses">
        <thead>
          <tr>${headers.map((header) => `<th>${htmlEscape(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) =>
                `<tr>${row.values.map((value) => `<td>${htmlEscape(value)}</td>`).join("")}</tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </body>
  </html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": 'attachment; filename="prime-control-nps-respostas.xls"',
    },
  });
}
