import Link from "next/link";
import { getDashboardData } from "@/lib/nps-db";

export const dynamic = "force-dynamic";

function formatPercent(value: number) {
  return `${value}%`;
}

function distributionPercent(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    invited: "Convidado",
    started: "Iniciado",
    in_progress: "Em andamento",
    completed: "Concluído",
    abandoned: "Abandonado",
  };

  return labels[status] ?? status;
}

function riskClass(riskLevel: string) {
  const classes: Record<string, string> = {
    Alto: "high",
    Médio: "medium",
    Silencioso: "silent",
    Normal: "normal",
  };

  return classes[riskLevel] ?? "normal";
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const maxReached = Math.max(...data.stepDropoff.map((step) => step.reached), 1);
  const silentRows = data.rows.filter((row) => row.riskLevel === "Silencioso");
  const riskRows = data.rows.filter(
    (row) => row.riskLevel === "Alto" || row.riskLevel === "Médio",
  );
  const completedRows = data.rows.filter((row) => row.status === "completed");
  const npsTotal = data.npsDistribution.total;
  const npsSegments = [
    {
      label: "Promotores",
      range: "Notas 9-10",
      value: data.npsDistribution.promoters,
      percent: distributionPercent(data.npsDistribution.promoters, npsTotal),
    },
    {
      label: "Neutros",
      range: "Notas 7-8",
      value: data.npsDistribution.passives,
      percent: distributionPercent(data.npsDistribution.passives, npsTotal),
    },
    {
      label: "Detratores",
      range: "Notas 1-6",
      value: data.npsDistribution.detractors,
      percent: distributionPercent(data.npsDistribution.detractors, npsTotal),
    },
  ];
  const campaignHealth =
    data.summary.completionRate >= 70
      ? "Saudável"
      : data.summary.started === 0
        ? "Aguardando"
        : "Acompanhar";

  return (
    <main className="page-shell admin-page">
      <div className="admin-shell">
        <header className="admin-command-bar">
          <div className="brand">
            <img alt="Prime Control" className="brand-logo" src="/brand/prime-control-logo.png" />
          </div>
          <div className="admin-action-toolbar" aria-label="Ações do dashboard">
            <Link className="button secondary admin-action-button" href="/">
              <Icon name="eye" />
              Ver pesquisa
            </Link>
            <Link className="button secondary admin-action-button" href="/api/admin/export.xls">
              <Icon name="sheet" />
              Planilha
            </Link>
            <Link className="button secondary admin-action-button compact" href="/api/admin/export.csv">
              CSV
            </Link>
            <Link className="button admin-action-button compact" href="/api/admin/export.pdf">
              <Icon name="file" />
              PDF
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="button ghost admin-action-button compact" type="submit">
                <Icon name="logout" />
                Sair
              </button>
            </form>
          </div>
        </header>

        <section className="admin-dashboard-hero panel">
          <div>
            <p className="eyebrow">Plataforma NPS Corporativa</p>
            <h1>Painel da campanha</h1>
            <p>Indicadores para priorizar adesão, conclusão, risco e follow-up.</p>
          </div>
          <div className="campaign-status-card">
            <span>Status</span>
            <strong>{campaignHealth}</strong>
            <p>{data.summary.completed}/{data.summary.totalRecipients} respostas concluídas</p>
          </div>
        </section>

        <section className="admin-kpi-grid">
          <MetricCard
            helper={`${data.summary.started} iniciados`}
            label="Adesão"
            value={formatPercent(data.summary.participationRate)}
          />
          <MetricCard
            helper={`${data.summary.completed} concluídos`}
            label="Conclusão"
            value={formatPercent(data.summary.completionRate)}
          />
          <MetricCard
            helper={`${data.npsDistribution.total} notas`}
            label="NPS"
            value={data.summary.npsScore === null ? "-" : data.summary.npsScore}
          />
          <MetricCard
            helper="menor é melhor"
            label="Atrito"
            tone={data.summary.frictionScore >= 40 ? "risk" : "default"}
            value={data.summary.frictionScore}
          />
          <MetricCard
            helper="sem início"
            label="Silenciosos"
            tone={silentRows.length > 0 ? "risk" : "default"}
            value={silentRows.length}
          />
          <MetricCard
            helper="conclusão"
            label="Tempo"
            value={`${data.summary.averageCompletionMinutes || 0} min`}
          />
        </section>

        <section className="admin-insight-grid">
          <div className="panel admin-section journey-panel">
            <div className="section-heading row-heading">
              <div>
                <p className="eyebrow">Jornada</p>
                <h2>Onde perdemos resposta</h2>
              </div>
              <span className="status-pill">{data.summary.averageQuestionSeconds}s/pergunta</span>
            </div>

            <div className="funnel-list">
              {data.stepDropoff.map((step, index) => (
                <div className="funnel-row-v2" key={step.stepId}>
                  <div className="funnel-step-index">{index + 1}</div>
                  <div className="funnel-meta">
                    <strong>{step.stepName}</strong>
                    <span>
                      {step.reached} chegaram | {step.stoppedHere} pararam
                    </span>
                  </div>
                  <div className="funnel-track" aria-hidden="true">
                    <div
                      className="funnel-fill"
                      style={{ width: `${Math.max(6, (step.reached / maxReached) * 100)}%` }}
                    />
                  </div>
                  <strong className="dropoff-rate">{step.dropoffRate}%</strong>
                </div>
              ))}
            </div>
            <p className="source-note">
              Fonte: plataforma NPS. Heatmaps e replays ficam no Microsoft Clarity.
            </p>
          </div>

          <aside className="panel admin-section action-panel">
            <div className="section-heading">
              <p className="eyebrow">Ação</p>
              <h2>Próximos movimentos</h2>
            </div>
            <div className="action-list">
              <ActionItem label="Planilha" text="Atualiza em tempo real." value="Auto" />
              <ActionItem
                label="Risco"
                text="Contato consultivo."
                tone={riskRows.length > 0 ? "risk" : "default"}
                value={riskRows.length}
              />
              <ActionItem
                label="Silenciosos"
                text="Lembrete pelo responsável."
                tone={silentRows.length > 0 ? "risk" : "default"}
                value={silentRows.length}
              />
              <ActionItem label="Concluídos" text="Ler comentários críticos." value={completedRows.length} />
            </div>
          </aside>
        </section>

        <section className="admin-analytics-grid">
          <div className="panel admin-section nps-panel">
            <div className="section-heading">
              <p className="eyebrow">NPS oficial</p>
              <h2>Distribuição automática da nota</h2>
            </div>
            <div className="nps-split">
              {npsSegments.map((segment) => (
                <DistributionItem
                  key={segment.label}
                  label={segment.label}
                  percent={segment.percent}
                  range={segment.range}
                  value={segment.value}
                />
              ))}
            </div>
            <div className="nps-formula-box">
              <span>Cálculo aplicado</span>
              <strong>
                {distributionPercent(data.npsDistribution.promoters, npsTotal)}% promotores -{" "}
                {distributionPercent(data.npsDistribution.detractors, npsTotal)}% detratores ={" "}
                {data.summary.npsScore ?? "-"}
              </strong>
              <p>Neutros entram na base total, mas não somam nem subtraem na nota final.</p>
            </div>
          </div>

          <div className="panel admin-section theme-panel">
            <div className="section-heading">
              <p className="eyebrow">Leitura temática</p>
              <h2>4 blocos com peso de 25%</h2>
            </div>
            <div className="category-list-v2">
              {data.categoryScores.map((item) => (
                <div className="category-row-v2" key={item.category}>
                  <span>{item.category}</span>
                  <div>
                    <small>25%</small>
                    <strong>{item.average ?? "-"}</strong>
                  </div>
                </div>
              ))}
            </div>
            <p className="source-note compact">
              Os 25% organizam a leitura dos blocos da pesquisa. O NPS oficial continua sendo
              calculado apenas pela pergunta de recomendação.
            </p>
          </div>
        </section>

        <section className="panel admin-section">
          <div className="section-heading row-heading">
            <div>
              <p className="eyebrow">Base</p>
              <h2>Respondentes e status</h2>
            </div>
            <span className="status-pill">{data.rows.length} registros</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Contato</th>
                  <th>Status</th>
                  <th>NPS</th>
                  <th>Progresso</th>
                  <th>Última atividade</th>
                  <th>Sinal</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.token}>
                    <td>
                      <strong>{row.company}</strong>
                      <span>{row.role}</span>
                    </td>
                    <td>
                      {row.name}
                      <span>{row.email}</span>
                    </td>
                    <td>{statusLabel(row.status)}</td>
                    <td>{row.npsScore ?? "-"}</td>
                    <td>
                      {row.answeredCount}/{row.totalQuestionCount}
                    </td>
                    <td>{formatDate(row.lastActivityAt)}</td>
                    <td>
                      <span className={`risk-pill risk-${riskClass(row.riskLevel)}`}>
                        {row.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  helper,
  tone = "default",
}: {
  label: string;
  value: string | number;
  helper?: string;
  tone?: "default" | "risk";
}) {
  return (
    <div className={`metric-card metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </div>
  );
}

function DistributionItem({
  label,
  value,
  percent,
  range,
}: {
  label: string;
  value: number;
  percent: number;
  range: string;
}) {
  return (
    <div className="distribution-item">
      <span>{label}</span>
      <strong>{percent}%</strong>
      <small>
        {value} resposta{value === 1 ? "" : "s"} | {range}
      </small>
    </div>
  );
}

function ActionItem({
  label,
  value,
  text,
  tone = "default",
}: {
  label: string;
  value: number | string;
  text: string;
  tone?: "default" | "risk";
}) {
  return (
    <div className={`action-item action-${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <p>{text}</p>
    </div>
  );
}

function Icon({ name }: { name: "eye" | "sheet" | "file" | "logout" }) {
  const paths = {
    eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z",
    sheet:
      "M6 2h8l4 4v16H6V2Zm7 1.5V7h3.5M8 11h8M8 15h8M8 19h5",
    file: "M6 2h8l4 4v16H6V2Zm7 1.5V7h3.5M8 12h8M8 16h6",
    logout: "M10 17v2H4V5h6v2M14 8l4 4-4 4M18 12H9",
  };

  return (
    <svg aria-hidden="true" className="button-icon" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  );
}
