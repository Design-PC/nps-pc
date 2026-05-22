import Link from "next/link";

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
          <span className="status-pill">Tempo estimado: 3 a 5 minutos</span>
        </header>

        <section className="panel hero compact-hero">
          <div className="hero-copy">
            <p className="eyebrow">Pesquisa de Satisfação | NPS | Maio 2026</p>
            <h1>Sua percepção sobre a parceria Prime Control.</h1>
            <p className="lead">
              Esta pesquisa ajuda a direcionar melhorias na relação, nas entregas
              e na geração de valor para o seu negócio.
            </p>

            <div className="trust-strip" aria-label="Informações da pesquisa">
              <span>Etapas curtas</span>
              <span>Progresso salvo</span>
              <span>Resposta identificada</span>
            </div>

            <p className="helper">
              As respostas serão analisadas com responsabilidade pela Prime
              Control para orientar ações de melhoria contínua.
            </p>

            <div className="actions">
              <Link className="button" href={`/nps/${token}/survey`}>
                Iniciar pesquisa
              </Link>
            </div>
          </div>

          <div className="hero-aside" aria-hidden="true">
            <strong>3-5</strong>
            <span>minutos</span>
          </div>
        </section>
      </div>
    </main>
  );
}
