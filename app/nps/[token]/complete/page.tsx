type CompletePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function CompletePage({ params }: CompletePageProps) {
  await params;

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
          <span className="status-pill">Resposta registrada</span>
        </header>

        <section className="panel success-panel">
          <p className="eyebrow">Pesquisa concluída</p>
          <h1>Obrigado por compartilhar sua percepção.</h1>
          <p className="lead">
            Sua resposta foi registrada e ajudará a Prime Control a priorizar
            ações de melhoria e fortalecimento da parceria.
          </p>
        </section>
      </div>
    </main>
  );
}
