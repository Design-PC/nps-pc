import { getDashboardData } from "@/lib/nps-db";

export const dynamic = "force-dynamic";

function pdfHex(value: unknown) {
  const text = String(value ?? "");
  const bytes = [0xfe, 0xff];

  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    bytes.push((code >> 8) & 0xff, code & 0xff);
  }

  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : [""];
}

function createPdf(lines: string[]) {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 44;
  const lineHeight = 15;
  const pages: string[] = [];
  let y = pageHeight - margin;
  let content = "";

  function addPage() {
    if (content) {
      pages.push(content);
    }
    content = "";
    y = pageHeight - margin;
  }

  function drawText(text: string, size = 10, bold = false, x = margin) {
    if (y < margin + lineHeight) {
      addPage();
    }
    content += `BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td <${pdfHex(text)}> Tj ET\n`;
    y -= lineHeight;
  }

  drawText("Prime Control - Pesquisa de Satisfação NPS", 18, true);
  drawText("Relatório executivo gerado pela Plataforma NPS Corporativa.", 10);
  y -= 10;

  for (const line of lines) {
    if (line === "") {
      y -= 8;
      continue;
    }
    const isHeading = line.startsWith("## ");
    const cleanLine = line.replace(/^##\s*/, "");
    for (const wrapped of wrapText(cleanLine, isHeading ? 56 : 88)) {
      drawText(wrapped, isHeading ? 13 : 10, isHeading);
    }
    if (isHeading) {
      y -= 4;
    }
  }

  addPage();

  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids ${pages.map((_, index) => `${3 + index * 2} 0 R`).join(" ")} /Count ${pages.length} >>`,
  ];

  pages.forEach((pageContent, index) => {
    const pageObjectId = 3 + index * 2;
    const contentObjectId = pageObjectId + 1;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> /Contents ${contentObjectId} 0 R >>`,
    );
    objects.push(`<< /Length ${Buffer.byteLength(pageContent, "utf-8")} >>\nstream\n${pageContent}endstream`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf-8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf-8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

export async function GET() {
  const data = await getDashboardData();
  const lines = [
    "## Resumo executivo",
    `Convidados: ${data.summary.totalRecipients}`,
    `Participação: ${data.summary.participationRate}%`,
    `Iniciados: ${data.summary.started}`,
    `Concluídos: ${data.summary.completed}`,
    `Conclusão: ${data.summary.completionRate}%`,
    `Abandono: ${data.summary.abandonmentRate}%`,
    `NPS parcial: ${data.summary.npsScore ?? "-"}`,
    `Score de fricção: ${data.summary.frictionScore}`,
    "",
    "## Distribuição NPS",
    `Promotores: ${data.npsDistribution.promoters}`,
    `Neutros: ${data.npsDistribution.passives}`,
    `Detratores: ${data.npsDistribution.detractors}`,
    "",
    "## Médias por tema",
    ...data.categoryScores.map((item) => `${item.category}: ${item.average ?? "-"}`),
    "",
    "## Respondentes e status",
    ...data.rows.map(
      (row) =>
        `${row.company} | ${row.name} | ${row.email} | ${row.status} | NPS: ${
          row.npsScore ?? "-"
        } | ${row.answeredCount}/${row.totalQuestionCount} respostas | Sinal: ${row.riskLevel}`,
    ),
  ];

  return new Response(Buffer.from(createPdf(lines), "utf-8"), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="prime-control-nps-dashboard.pdf"',
    },
  });
}
