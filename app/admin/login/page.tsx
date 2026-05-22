"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      setError(data.message ?? "Não foi possível acessar a área interna.");
      return;
    }

    const nextPath = new URL(window.location.href).searchParams.get("next");
    router.push(nextPath ?? "/admin");
    router.refresh();
  }

  return (
    <main className="page-shell admin-login-page">
      <section className="login-panel panel">
        <div className="login-brand-row">
          <img
            alt="Prime Control"
            className="brand-logo"
            src="/brand/prime-control-logo.png"
          />
          <span className="status-pill">Acesso interno</span>
        </div>

        <div className="login-copy">
          <p className="eyebrow">Plataforma NPS Corporativa</p>
          <h1>Dashboard interno</h1>
          <p>
            Acompanhe participação, respostas, abandono e indicadores da pesquisa.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuário
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Validando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
