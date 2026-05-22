"use client";

import { campaignInfo } from "@/lib/campaign";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell landing-shell">
      <div className="survey-frame landing-frame">
        <header className="topbar">
          <div className="brand">
            <img
              alt="Prime Control"
              className="brand-logo"
              src="/brand/prime-control-logo.png"
            />
          </div>
          <span className="status-pill">{campaignInfo.validityLabel}</span>
        </header>

        <section className="panel state-panel">
          <p className="eyebrow">Não foi possível carregar</p>
          <h1>Vamos tentar novamente.</h1>
          <p className="lead">
            Houve uma instabilidade ao carregar esta página. Suas respostas já
            registradas permanecem preservadas.
          </p>
          <div className="actions">
            <button className="button" type="button" onClick={reset}>
              Recarregar
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
