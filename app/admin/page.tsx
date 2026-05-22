import Link from "next/link";
import { getDashboardData } from "@/lib/nps-db";

export const dynamic = "force-dynamic";

function formatPercent(value: number) {
  return `${value}%`;
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

  return (
    <main className="page-shell admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="brand">
            <img
              alt="Prime Control"
              className="brand-logo"
              src="/brand/prime-control-logo.png"
            />
          </div>
          <div className="admin-topbar-actions">
            <Link className="button secondary" href="/nps/demo-prime-control">
              Abrir pesquisa
            </Link>
            <Link className="button" href="/api/admin/export.csv">
              Exportar CSV
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="button ghost" type="submit">
                Sair
              </button>
            </form>
          </div>
        </header>

        <section className="admin-hero">
          <div>
            <p className="eyebrow">Plataforma NPS Corporativa</p>
            <h1>Dashboard interno da pesquisa</h1>
            <p>
              Visão consolidada de participação, conclusão, abandono, NPS e sinais de
              fricção da jornada.
            </p>
          </div>
          <div className="health-card">
            <span>Score de fricção</span>
            <strong>{data.summary.frictionScore}</strong>
            <p>
              Quanto menor, melhor. Combina abandono, silêncio e tempo médio de resposta.
            </p>
          </div>
        </section>

        <section className="dashboard-grid executive-grid">
          <MetricCard label="Convidados" value={data.summary.totalRecipients} />
          <MetricCard label="Participação" value={formatPercent(data.summary.participationRate)} />
          <MetricCard label="Iniciados" value={data.summary.started} />
          <MetricCard label="Concluídos" value={data.summary.completed} />
          <MetricCard label="Conclusão" value={formatPercent(data.summary.completionRate)} />
          <MetricCard label="Abandono" value={formatPercent(data.summary.abandonmentRate)} tone="risk" />
          <MetricCard
            label="Tempo médio"
            value={`${data.summary.averageCompletionMinutes || 0} min`}
          />
          <MetricCard
            label="NPS parcial"
            value={data.summary.npsScore === null ? "-" : data.summary.npsScore}
          />
        </section>

        <div className="admin-layout">
          <section className="panel admin-section">
            <div className="section-heading row-heading">
              <div>
                <p className="eyebrow">Funil</p>
                <h2>Abandono por etapa</h2>
              </div>
              <span className="status-pill">{data.summary.averageQuestionSeconds}s por pergunta</span>
            </div>

            <div className="funnel-list">
              {data.stepDropoff.map((step) => (
                <div className="funnel-row" key={step.stepId}>
                  <div className="funnel-meta">
                    <strong>{step.stepName}</strong>
                    <span>
                      {step.reached} chegaram | {step.stoppedHere} pararam aqui
                    </span>
                  </div>
                  <div className="funnel-track" aria-hidden="true">
                    <div
                      className="funnel-fill"
                      style={{ width: `${Math.max(8, (step.reached / maxReached) * 100)}%` }}
                    />
                  </div>
                  <strong className="dropoff-rate">{step.dropoffRate}%</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="panel admin-section">
            <div className="section-heading">
              <p className="eyebrow">NPS</p>
              <h2>Distribuição parcial</h2>
            </div>
            <div className="nps-split">
              <DistributionItem label="Promotores" value={data.npsDistribution.promoters} />
              <DistributionItem label="Neutros" value={data.npsDistribution.passives} />
              <DistributionItem label="Detratores" value={data.npsDistribution.detractors} />
            </div>
            <p className="panel-note">
              Este painel acompanha tendência durante a campanha. A análise final deve
              considerar a base completa e o contexto de cada cliente.
            </p>
          </section>
        </div>

        <section className="panel admin-section">
          <div className="section-heading">
            <p className="eyebrow">Percepção por tema</p>
            <h2>Média das avaliações</h2>
          </div>
          <div className="category-grid">
            {data.categoryScores.map((item) => (
              <div className="category-card" key={item.category}>
                <span>{item.category}</span>
                <strong>{item.average ?? "-"}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel admin-section">
          <div className="section-heading row-heading">
            <div>
              <p className="eyebrow">Base de clientes</p>
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
                    <td>{row.company}</td>
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
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "risk";
}) {
  return (
    <div className={`metric-card metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DistributionItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="distribution-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
