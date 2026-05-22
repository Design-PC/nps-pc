"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/tracking";

type AnswerValue = string | number;
type Answers = Record<string, AnswerValue>;

type ClassicQuestion = {
  id: string;
  type: "rating" | "text";
  label: string;
  required?: boolean;
};

type ClassicSection = {
  id: string;
  title: string;
  scale: string;
  questions: ClassicQuestion[];
};

const scoreOptions = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const personalEmailDomains = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "yahoo.com",
  "bol.com.br",
  "uol.com.br",
  "terra.com.br",
  "proton.me",
  "protonmail.com",
];

const identityFields = [
  { id: "identity_name", label: "Nome", placeholder: "Seu nome" },
  {
    id: "identity_email",
    label: "E-mail corporativo",
    placeholder: "seunome@empresa.com.br",
    type: "email",
  },
  { id: "identity_company", label: "Empresa", placeholder: "Empresa" },
  { id: "identity_role", label: "Cargo", placeholder: "Cargo" },
];

const sections: ClassicSection[] = [
  {
    id: "relacionamento-satisfacao",
    title: "Relacionamento e Satisfação",
    scale: "Escala: 10 = muito provável e 1 = nada provável",
    questions: [
      {
        id: "nps_recommendation",
        type: "rating",
        required: true,
        label:
          "Qual a probabilidade de você recomendar a Prime Control para outras empresas?",
      },
      {
        id: "nps_reason",
        type: "text",
        label: "Qual foi o principal motivo para a nota atribuída?",
      },
    ],
  },
  {
    id: "percepcao-valor",
    title: "Percepção de Valor",
    scale: "Escala: 10 = muito satisfeito e 1 = nada satisfeito",
    questions: [
      {
        id: "value_business_attention",
        type: "rating",
        required: true,
        label:
          "Como você avalia a Prime Control em relação ao entendimento do seu negócio?",
      },
      {
        id: "value_solution_relevance",
        type: "rating",
        required: true,
        label:
          "Como você avalia a relevância das soluções entregues para os desafios da sua empresa?",
      },
      {
        id: "value_perceived",
        type: "rating",
        required: true,
        label:
          "As soluções da Prime Control têm gerado valor percebido para o seu negócio?",
      },
      {
        id: "value_results_commitment",
        type: "rating",
        required: true,
        label: "Como você avalia nosso comprometimento com resultados?",
      },
      {
        id: "value_problem_solving",
        type: "rating",
        required: true,
        label: "Como você avalia nosso engajamento na solução de problemas?",
      },
    ],
  },
  {
    id: "qualidade-operacional",
    title: "Qualidade Operacional",
    scale: "Escala: 10 = muito satisfeito e 1 = nada satisfeito",
    questions: [
      {
        id: "ops_delivery_quality",
        type: "rating",
        required: true,
        label: "Como você avalia a qualidade das entregas realizadas?",
      },
      {
        id: "ops_deadlines",
        type: "rating",
        required: true,
        label: "Como você avalia o cumprimento dos prazos acordados?",
      },
      {
        id: "ops_result_clarity",
        type: "rating",
        required: true,
        label:
          "Como você avalia a clareza e objetividade das apresentações de resultados?",
      },
      {
        id: "ops_response_time",
        type: "rating",
        required: true,
        label: "Como você avalia o tempo de resposta da nossa equipe?",
      },
      {
        id: "ops_service_quality",
        type: "rating",
        required: true,
        label: "Como você avalia a qualidade do atendimento recebido?",
      },
    ],
  },
  {
    id: "inovacao-futuro",
    title: "Inovação, Transformação e Futuro",
    scale: "Escala: 10 = muito satisfeito e 1 = nada satisfeito",
    questions: [
      {
        id: "future_innovative_company",
        type: "rating",
        required: true,
        label:
          "Você percebe a Prime Control como uma empresa inovadora e alinhada às tendências do mercado?",
      },
      {
        id: "future_trend_anticipation",
        type: "rating",
        required: true,
        label:
          "Como você avalia a capacidade da Prime Control antecipar tendências e propor soluções para os desafios do seu negócio?",
      },
      {
        id: "future_innovation_areas",
        type: "text",
        label:
          "Em quais áreas você acredita que a Prime Control poderia investir mais em inovação para fortalecer ainda mais nossa parceria?",
      },
      {
        id: "future_strategic_partner_expectation",
        type: "text",
        label:
          "O que você espera de uma empresa parceira estratégica que ainda não percebe na atuação da Prime Control?",
      },
      {
        id: "future_partnership_improvements",
        type: "text",
        label:
          "Quais iniciativas, soluções ou melhorias podem ampliar nossa parceria e gerar ainda mais valor para o seu negócio?",
      },
    ],
  },
];

function createSessionToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `public-classic-${crypto.randomUUID()}`;
  }

  return `public-classic-${Date.now()}`;
}

function isCorporateEmail(value: string) {
  const email = value.trim().toLowerCase();
  const domain = email.split("@")[1] ?? "";

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !personalEmailDomains.includes(domain);
}

export function ClassicSurveyExperience() {
  const [answers, setAnswers] = useState<Answers>({});
  const [sessionToken] = useState(createSessionToken);
  const [error, setError] = useState("");
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const requiredRatings = useMemo(
    () =>
      sections.flatMap((section) =>
        section.questions
          .filter((question) => question.type === "rating" && question.required)
          .map((question) => question.id),
      ),
    [],
  );

  useEffect(() => {
    trackEvent("survey_classic_viewed", {
      campaign_id: "prime-control-nps-2026",
      variant: "classic_one_page",
    });

    fetch(`/api/nps/session/${sessionToken}/start`, { method: "POST" }).catch(() => {
      // A experiência de resposta não deve travar por falha de tracking/sessão.
    });
  }, [sessionToken]);

  function updateAnswer(questionId: string, value: AnswerValue) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setError("");
  }

  function markTouched(questionId: string) {
    setTouchedFields((current) => ({ ...current, [questionId]: true }));
  }

  function validateAnswers() {
    const missingIdentity = identityFields.find((field) => {
      const value = String(answers[field.id] ?? "").trim();
      return value.length < 2;
    });

    if (missingIdentity) {
      return `Preencha o campo ${missingIdentity.label}.`;
    }

    if (!isCorporateEmail(String(answers.identity_email ?? ""))) {
      return "Use seu e-mail corporativo para continuar.";
    }

    const missingRating = requiredRatings.find((questionId) => !answers[questionId]);

    if (missingRating) {
      return "Selecione uma nota para todas as perguntas de escala.";
    }

    return "";
  }

  async function submitSurvey() {
    const validationMessage = validateAnswers();

    if (validationMessage) {
      setError(validationMessage);
      trackEvent("survey_classic_validation_error", {
        message: validationMessage,
        variant: "classic_one_page",
      });
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/nps/session/${sessionToken}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          currentStep: sections.length,
        }),
      });

      if (!response.ok && response.status !== 409) {
        throw new Error("submit_failed");
      }

      trackEvent("survey_classic_completed", {
        campaign_id: "prime-control-nps-2026",
        variant: "classic_one_page",
      });

      window.location.href = "/complete";
    } catch {
      setSubmitting(false);
      setError("Não foi possível enviar sua resposta agora. Tente novamente em instantes.");
    }
  }

  let questionNumber = 0;
  const emailValue = String(answers.identity_email ?? "");
  const shouldShowEmailError =
    touchedFields.identity_email && emailValue.trim().length > 0 && !isCorporateEmail(emailValue);

  return (
    <main className="page-shell classic-page">
      <div className="classic-frame">
        <header className="topbar classic-topbar">
          <a className="brand" href="/" aria-label="Voltar para o início">
            <Image
              src="/brand/prime-control-logo.png"
              alt="Prime Control"
              width={204}
              height={68}
              className="brand-logo"
              priority
            />
          </a>
          <div className="topbar-meta">
            <span className="status-pill">Tempo estimado: 3 a 5 minutos</span>
            <span className="status-pill subtle">Disponível até 01/06/2026</span>
          </div>
        </header>

        <section className="panel classic-sheet" aria-labelledby="classic-title">
          <div className="classic-accent" />
          <div className="classic-heading">
            <h1 id="classic-title">Pesquisa de Satisfação | NPS | Maio 2026</h1>
            <p>
              Sua percepção ajuda a Prime Control a priorizar melhorias e gerar mais
              valor ao seu negócio.
            </p>
          </div>

          <section className="classic-identity" aria-labelledby="identity-title">
            <h2 id="identity-title">Identificação</h2>
            <div className="classic-identity-grid">
              {identityFields.map((field) => (
                <label key={field.id}>
                  <span>{field.label}</span>
                  <input
                    className={
                      field.id === "identity_email" && shouldShowEmailError ? "input-invalid" : ""
                    }
                    type={field.type ?? "text"}
                    value={String(answers[field.id] ?? "")}
                    placeholder={field.placeholder}
                    onChange={(event) => updateAnswer(field.id, event.target.value)}
                    onBlur={() => markTouched(field.id)}
                    autoComplete={field.id === "identity_email" ? "email" : "on"}
                    aria-invalid={field.id === "identity_email" && shouldShowEmailError}
                    aria-describedby={
                      field.id === "identity_email" && shouldShowEmailError
                        ? "identity-email-error"
                        : undefined
                    }
                  />
                  {field.id === "identity_email" && shouldShowEmailError ? (
                    <small className="field-error" id="identity-email-error">
                      Use um e-mail corporativo válido.
                    </small>
                  ) : null}
                </label>
              ))}
            </div>
          </section>

          <div className="classic-sections">
            {sections.map((section) => (
              <section className="classic-section" key={section.id} aria-labelledby={section.id}>
                <div className="classic-section-title">
                  <h2 id={section.id}>{section.title}</h2>
                  <span>{section.scale}</span>
                </div>

                <div className="classic-table" role="group" aria-label={section.title}>
                  {section.questions.map((question) => {
                    questionNumber += 1;

                    return (
                      <div
                        className={`classic-row ${
                          question.type === "text" ? "classic-row-open" : ""
                        }`}
                        key={question.id}
                      >
                        <div className="classic-question">
                          <span className="classic-question-number">{questionNumber}.</span>
                          <span>{question.label}</span>
                        </div>

                        {question.type === "rating" ? (
                          <div className="classic-scale" aria-label={`Nota para: ${question.label}`}>
                            {scoreOptions.map((score) => (
                              <button
                                aria-pressed={answers[question.id] === score}
                                className={`classic-score ${
                                  answers[question.id] === score ? "selected" : ""
                                }`}
                                key={score}
                                onClick={() => updateAnswer(question.id, score)}
                                type="button"
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <label className="classic-open-field">
                            <textarea
                              value={String(answers[question.id] ?? "")}
                              placeholder="Escreva sua resposta, se desejar"
                              onChange={(event) => updateAnswer(question.id, event.target.value)}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <footer className="classic-actions">
            <div>
              <strong>Obrigado pela participação.</strong>
              <span>Suas respostas ajudam a direcionar melhorias na parceria.</span>
            </div>
            <button className="button" disabled={submitting} onClick={submitSurvey} type="button">
              {submitting ? "Enviando..." : "Enviar pesquisa"}
            </button>
          </footer>

          {error ? (
            <p className="error-text classic-error" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
