import Link from "next/link";

type LandingPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function LandingPage({ params }: LandingPageProps) {
  const { token } = await params;

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
          <span className="status-pill">Tempo estimado: 3 a 5 minutos</span>
        </header>

        <section className="panel hero">
          <p className="eyebrow">Pesquisa de Satisfação | NPS | Maio 2026</p>
          <h1>Queremos ouvir sua percepção sobre a parceria.</h1>
          <p className="lead">
            Sua percepção ajuda a Prime Control a priorizar melhorias,
            fortalecer a parceria e direcionar ações para gerar mais valor ao
            seu negócio.
          </p>

          <div className="hero-grid">
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

          <p className="helper">
            Suas respostas serão analisadas com responsabilidade e usadas para
            orientar ações de melhoria contínua.
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
