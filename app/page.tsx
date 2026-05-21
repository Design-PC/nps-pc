import Link from "next/link";

export default function HomePage() {
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
          <span className="status-pill">Ambiente de protótipo</span>
        </header>

        <section className="panel hero">
          <p className="eyebrow">NPS corporativo</p>
          <h1>Pesquisa de Satisfação Prime Control</h1>
          <p className="lead">
            Esta é a fundação navegável da nova experiência de pesquisa. O
            fluxo preserva as perguntas aprovadas e adiciona progressão,
            autosave local e eventos de comportamento preparados para analytics.
          </p>

          <div className="hero-grid">
            <div className="info-tile">
              <strong>3 a 5 minutos</strong>
              <span>Tempo estimado claro para reduzir adiamento.</span>
            </div>
            <div className="info-tile">
              <strong>Multi-step</strong>
              <span>Blocos curtos para diminuir sobrecarga cognitiva.</span>
            </div>
            <div className="info-tile">
              <strong>Analytics-ready</strong>
              <span>Eventos preparados para PostHog, Clarity, GA4 e HubSpot.</span>
            </div>
          </div>

          <div className="actions">
            <Link className="button" href="/nps/demo-prime-control">
              Abrir protótipo
            </Link>
            <Link className="button secondary" href="/nps/demo-prime-control/survey">
              Ir direto para pesquisa
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
