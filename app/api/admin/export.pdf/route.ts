import { getDashboardData } from "@/lib/nps-db";

export const dynamic = "force-dynamic";

type PdfLine = {
  text: string;
  size?: number;
  bold?: boolean;
  gapAfter?: number;
};

function normalizePdfText(value: unknown) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");
}

function escapePdfText(value: unknown) {
  return normalizePdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text: string, maxChars: number) {
  const words = normalizePdfText(text).split(/\s+/).filter(Boolean);
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

function buildPdf(lines: PdfLine[]) {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 42;
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

  function drawText(text: string, size = 10, bold = false, x = margin, gapAfter = 6) {
    const lineHeight = Math.max(13, size + 5);
    if (y < margin + lineHeight) {
      addPage();
    }

    content += `BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET\n`;
    y -= lineHeight + gapAfter;
  }

  function drawRule() {
    if (y < margin + 18) {
      addPage();
    }
    content += `0.84 0.88 0.92 RG 1 w ${margin} ${y} m ${pageWidth - margin} ${y} l S\n`;
    y -= 18;
  }

  content += `0.00 0.27 0.53 RG 2 w ${margin} ${y} m ${pageWidth - margin} ${y} l S\n`;
  y -= 28;
  drawText("Prime Control - Relatorio NPS", 19, true, margin, 2);
  drawText("Dashboard executivo da Pesquisa de Satisfacao | Maio 2026", 10, false, margin, 14);
  drawRule();

  for (const line of lines) {
    if (!line.text) {
      y -= 8;
      continue;
    }

    const size = line.size ?? 10;
    const isHeading = Boolean(line.bold && size >= 13);
    for (const wrapped of wrapText(line.text, isHeading ? 58 : 92)) {
      drawText(wrapped, size, line.bold, margin, line.gapAfter ?? (isHeading ? 5 : 2));
    }
  }

  addPage();

  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids ${pages.map((_, index) => `${3 + index * 2} 0 R`).join(" ")} /Count ${pages.length} >>`,
  ];

  pages.forEach((pageContent) => {
    const pageObjectId = objects.length + 1;
    const contentObjectId = pageObjectId + 1;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> >> >> /Contents ${contentObjectId} 0 R >>`,
    );
    objects.push(`<< /Length ${Buffer.byteLength(pageContent, "latin1")} >>\nstream\n${pageContent}endstream`);
  });

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "latin1");
}

export async function GET() {
  const data = await getDashboardData();
  const npsTotal = data.npsDistribution.total;
  const promoterPercent =
    npsTotal > 0 ? Math.round((data.npsDistribution.promoters / npsTotal) * 100) : 0;
  const passivePercent =
    npsTotal > 0 ? Math.round((data.npsDistribution.passives / npsTotal) * 100) : 0;
  const detractorPercent =
    npsTotal > 0 ? Math.round((data.npsDistribution.detractors / npsTotal) * 100) : 0;
  const lines: PdfLine[] = [
    { text: "Resumo da campanha", size: 14, bold: true },
    { text: `Participacao: ${data.summary.participationRate}% | Conclusao: ${data.summary.completionRate}% | Abandono: ${data.summary.abandonmentRate}%` },
    { text: `Convidados: ${data.summary.totalRecipients} | Iniciados: ${data.summary.started} | Concluidos: ${data.summary.completed}` },
    { text: `NPS parcial: ${data.summary.npsScore ?? "-"} | Friccao: ${data.summary.frictionScore} | Tempo medio: ${data.summary.averageCompletionMinutes || 0} min` },
    { text: "" },
    { text: "Distribuicao NPS oficial", size: 14, bold: true },
    {
      text: `Promotores 9-10: ${promoterPercent}% (${data.npsDistribution.promoters}) | Neutros 7-8: ${passivePercent}% (${data.npsDistribution.passives}) | Detratores 0-6: ${detractorPercent}% (${data.npsDistribution.detractors})`,
    },
    { text: `Formula: ${promoterPercent}% promotores - ${detractorPercent}% detratores = ${data.summary.npsScore ?? "-"}` },
    { text: "Neutros entram na base total, mas nao somam nem subtraem na nota final." },
    { text: "" },
    { text: "Medias da avaliacao 1 a 5", size: 14, bold: true },
    ...data.categoryScores.map((item) => ({
      text: `${item.category}: ${item.average ?? "-"}`,
    })),
    { text: "" },
    { text: "Funil da jornada", size: 14, bold: true },
    ...data.stepDropoff.map((step) => ({
      text: `${step.stepName}: ${step.reached} chegaram | ${step.stoppedHere} pararam | abandono ${step.dropoffRate}%`,
    })),
    { text: "" },
    { text: "Respondentes e status", size: 14, bold: true },
    ...data.rows.map((row) => ({
      text: `${row.company} | ${row.name} | ${row.email} | ${row.status} | NPS ${row.npsScore ?? "-"} | ${row.answeredCount}/${row.totalQuestionCount} | ${row.riskLevel}`,
    })),
  ];

  return new Response(buildPdf(lines), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="prime-control-nps-dashboard.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
