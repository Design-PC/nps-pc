import Link from "next/link";
import { campaignInfo } from "@/lib/campaign";

export default function NotFoundPage() {
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
          <p className="eyebrow">Página não localizada</p>
          <h1>Este endereço não está disponível.</h1>
          <p className="lead">
            Para responder à pesquisa, volte ao início da campanha ou acione seu
            ponto de contato na Prime Control.
          </p>
          <div className="actions">
            <Link className="button secondary" href="/">
              Voltar ao início
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
