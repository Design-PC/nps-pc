import Link from "next/link";
import { getDashboardData } from "@/lib/nps-db";

export const dynamic = "force-dynamic";

function formatPercent(value: number) {
  return `${value}%`;
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="page-shell">
      <div className="survey-frame">
        <header className="topbar">
          <div className="brand">
            <img
              alt="Prime Control"
              className="brand-logo"
              src="/brand/prime-control-logo.png"
            />
          </div>
          <span className="status-pill">Área interna</span>
        </header>

        <section className="panel admin-overview">
          <div className="admin-title-row">
            <div>
              <p className="eyebrow">Área interna</p>
              <h1>Dashboard da Pesquisa</h1>
              <p>
                Participação, conclusão, abandono por etapa e respostas
                coletadas na pesquisa.
              </p>
            </div>
            <div className="actions">
              <Link className="button" href="/api/admin/export.csv">
                Exportar CSV
              </Link>
              <Link className="button secondary" href="/nps/demo-prime-control">
                Abrir pesquisa
              </Link>
            </div>
          </div>

          <div className="dashboard-grid">
            <MetricCard label="Convidados" value={data.summary.totalRecipients} />
            <MetricCard label="Iniciados" value={data.summary.started} />
            <MetricCard label="Em andamento" value={data.summary.inProgress} />
            <MetricCard label="Concluídos" value={data.summary.completed} />
            <MetricCard
              label="Completion rate"
              value={formatPercent(data.summary.completionRate)}
            />
          </div>

        </section>

        <section className="panel admin-section">
          <div className="section-heading">
            <p className="eyebrow">Funil</p>
            <h2>Abandono por etapa</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Etapa</th>
                  <th>Chegaram</th>
                  <th>Pararam aqui</th>
                </tr>
              </thead>
              <tbody>
                {data.stepDropoff.map((step) => (
                  <tr key={step.stepId}>
                    <td>{step.stepName}</td>
                    <td>{step.reached}</td>
                    <td>{step.stoppedHere}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel admin-section">
          <div className="section-heading">
            <p className="eyebrow">Respostas</p>
            <h2>Respondentes e status</h2>
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
                    <td>{row.status}</td>
                    <td>{row.npsScore ?? "-"}</td>
                    <td>
                      {row.answeredCount}/{row.totalQuestionCount}
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
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
