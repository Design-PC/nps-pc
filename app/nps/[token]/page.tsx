import Link from "next/link";
import { campaignInfo } from "@/lib/campaign";

type LandingPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function LandingPage({ params }: LandingPageProps) {
  const { token } = await params;

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
          <div className="topbar-meta">
            <span className="status-pill">{campaignInfo.estimatedTimeLabel}</span>
          </div>
        </header>

        <section className="panel hero">
          <p className="eyebrow">{campaignInfo.name}</p>
          <h1>A Prime Control quer ouvir você.</h1>
          <p className="lead">
            Sua percepção ajuda a Prime Control a priorizar melhorias,
            fortalecer a parceria e direcionar ações para gerar mais valor ao
            seu negócio.
          </p>

          <div className="hero-grid refined-hero-grid">
            <div className="info-tile">
              <strong>Rápida</strong>
              <span>A experiência foi organizada em etapas curtas.</span>
            </div>
            <div className="info-tile">
              <strong>Responsável</strong>
              <span>As respostas orientam a melhoria contínua da parceria.</span>
            </div>
            <div className="info-tile">
              <strong>Retomável</strong>
              <span>O progresso pode ser salvo para continuar depois.</span>
            </div>
          </div>

          <p className="helper validity-note">
            Disponível até 01/jun/26.
          </p>

          <div className="actions">
            <Link className="button" href={`/nps/${token}/survey`}>
              Iniciar pesquisa
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
