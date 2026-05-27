"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { campaignInfo } from "@/lib/campaign";
import {
  getStepByIndex,
  identityQuestions,
  surveySteps,
  totalQuestionCount,
  type SurveyQuestion,
} from "@/lib/survey";
import {
  loadSession,
  saveSession,
  type StoredSurveySession,
  type SurveyAnswers,
} from "@/lib/storage";
import { trackEvent } from "@/lib/tracking";

type SurveyExperienceProps = {
  token: string;
  completionPath?: string;
  landingPath?: string;
  showImmediately?: boolean;
};

const prefilledIdentity: SurveyAnswers = {
  identity_name: "",
  identity_email: "",
  identity_company: "",
  identity_area: "",
  identity_role: "",
};

const identityPlaceholders: Record<string, string> = {
  identity_name: "Seu nome",
  identity_email: "seu.email@empresa.com.br",
  identity_company: "Nome da empresa",
  identity_area: "Sua área",
  identity_role: "Seu cargo",
};

const demoIdentityValues: Record<string, string> = {
  identity_name: "Cliente Prime Control",
  identity_email: "cliente@empresa.com.br",
  identity_company: "Empresa Cliente",
  identity_area: "Operações",
  identity_role: "Gestor(a)",
};

const publicEmailDomains = new Set([
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "yahoo.com",
  "yahoo.com.br",
  "bol.com.br",
  "uol.com.br",
  "terra.com.br",
  "proton.me",
  "protonmail.com",
]);

function getCorporateEmailError(emailValue: string) {
  const email = emailValue.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return "Informe um e-mail corporativo válido.";
  }

  const domain = email.split("@")[1];

  if (!domain || publicEmailDomains.has(domain)) {
    return "Use seu e-mail corporativo para continuar.";
  }

  return "";
}

function normalizeStoredAnswers(storedAnswers: SurveyAnswers) {
  const normalized: SurveyAnswers = {
    ...storedAnswers,
    identity_area:
      storedAnswers.identity_area === "Operacoes"
        ? "Operações"
        : storedAnswers.identity_area,
  };

  Object.entries(demoIdentityValues).forEach(([key, demoValue]) => {
    if (normalized[key] === demoValue) {
      normalized[key] = "";
    }
  });

  return normalized;
}

export function SurveyExperience({
  completionPath,
  landingPath,
  showImmediately = false,
  token,
}: SurveyExperienceProps) {
  const router = useRouter();
  const [sessionToken] = useState(() => {
    if (showImmediately && typeof window !== "undefined") {
      return `public-${crypto.randomUUID()}`;
    }

    return token;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(prefilledIdentity);
  const [saveState, setSaveState] = useState("Progresso salvo");
  const [error, setError] = useState("");
  const [loadState, setLoadState] = useState<"loading" | "ready" | "unavailable">(
    showImmediately ? "ready" : "loading",
  );
  const [stepStartedAt, setStepStartedAt] = useState(Date.now());
  const [questionStartedAt, setQuestionStartedAt] = useState<
    Record<string, number>
  >({});

  const step = getStepByIndex(currentStep);
  const progress = Math.round(((currentStep + 1) / surveySteps.length) * 100);
  const isLastStep = currentStep === surveySteps.length - 1;
  const surveyQuestionCount = totalQuestionCount - identityQuestions.length;

  const answeredCount = useMemo(() => {
    return surveySteps
      .flatMap((surveyStep) => surveyStep.questions)
      .filter((question) => {
        const answer = answers[question.id];
        return answer !== undefined && String(answer).trim().length > 0;
      }).length;
  }, [answers]);

  const answeredSurveyCount = useMemo(() => {
    return surveySteps
      .flatMap((surveyStep) => surveyStep.questions)
      .filter((question) => question.type !== "identity")
      .filter((question) => {
        const answer = answers[question.id];
        return answer !== undefined && String(answer).trim().length > 0;
      }).length;
  }, [answers]);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const response = await fetch(`/api/nps/session/${sessionToken}`, {
          cache: "no-store",
        });

        if (response.status === 404) {
          setLoadState("unavailable");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load survey session.");
        }

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        if (data.recipient?.status === "completed" || data.session?.completedAt) {
          router.replace(completionPath ?? `/nps/${sessionToken}/complete`);
          return;
        }

        if (data.session) {
          setCurrentStep(data.session.currentStep ?? 0);
          setAnswers({
            ...prefilledIdentity,
            ...normalizeStoredAnswers(data.session.answers ?? {}),
          });
          saveSession({
            token: sessionToken,
            currentStep: data.session.currentStep ?? 0,
            answers: data.session.answers ?? prefilledIdentity,
            startedAt: data.session.startedAt,
            lastActivityAt: data.session.lastActivityAt ?? new Date().toISOString(),
          });
        }

        await fetch(`/api/nps/session/${sessionToken}/start`, {
          method: "POST",
        });
        setLoadState("ready");
      } catch {
        const stored = loadSession(sessionToken);

        if (stored?.completedAt) {
          router.replace(completionPath ?? `/nps/${sessionToken}/complete`);
          return;
        }

        if (stored) {
          setCurrentStep(stored.currentStep);
          setAnswers({ ...prefilledIdentity, ...normalizeStoredAnswers(stored.answers) });
          setLoadState("ready");
          trackEvent("nps_survey_resumed", {
            token: sessionToken,
            last_step: stored.currentStep,
          });
          return;
        }

        const initialSession: StoredSurveySession = {
          token: sessionToken,
          currentStep: 0,
          answers: prefilledIdentity,
          startedAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        };

        saveSession(initialSession);
        setLoadState("ready");
      }

      trackEvent("nps_survey_started", { token: sessionToken });
    }

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, [completionPath, router, sessionToken]);

  useEffect(() => {
    setStepStartedAt(Date.now());
    setError("");
    trackEvent("nps_step_viewed", {
      token: sessionToken,
      step_id: step.id,
      step_name: step.title,
      progress_percent: progress,
    });

    step.questions.forEach((question) => {
      setQuestionStartedAt((previous) => ({
        ...previous,
        [question.id]: Date.now(),
      }));
      trackEvent("nps_question_viewed", {
        token: sessionToken,
        question_id: question.id,
        category: question.category,
        question_type: question.type,
      });
    });
  }, [progress, sessionToken, step]);

  function persist(nextAnswers: SurveyAnswers, nextStep = currentStep) {
    setSaveState("Salvando...");

    const session: StoredSurveySession = {
      token: sessionToken,
      currentStep: nextStep,
      answers: nextAnswers,
      startedAt: loadSession(sessionToken)?.startedAt ?? new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    saveSession(session);

    fetch(`/api/nps/session/${sessionToken}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: nextAnswers,
        currentStep: nextStep,
      }),
    })
      .then((response) => {
        if (response.status === 409) {
          router.replace(completionPath ?? `/nps/${sessionToken}/complete`);
        }
      })
      .catch(() => {
        setSaveState("Progresso salvo localmente");
      });

    window.setTimeout(() => {
      setSaveState("Progresso salvo");
      trackEvent("nps_survey_autosaved", {
        token: sessionToken,
        step_id: step.id,
        answered_count: answeredCount,
      });
    }, 180);
  }

  function updateAnswer(question: SurveyQuestion, value: string | number) {
    const nextAnswers = {
      ...answers,
      [question.id]: value,
    };

    setAnswers(nextAnswers);
    persist(nextAnswers);

    const startedAt = questionStartedAt[question.id] ?? Date.now();

    trackEvent("nps_question_answered", {
      token: sessionToken,
      question_id: question.id,
      category: question.category,
      answer_type: question.type,
      time_to_answer_seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
    });
  }

  function getStepValidationError() {
    const missingRequiredField = step.questions.find((question) => {
      if (!question.required) {
        return false;
      }

      const answer = answers[question.id];
      return answer === undefined || String(answer).trim().length === 0;
    });

    if (missingRequiredField) {
      return "Preencha os campos obrigatórios desta etapa para continuar.";
    }

    if (currentStep === 0) {
      const emailError = getCorporateEmailError(String(answers.identity_email ?? ""));

      if (emailError) {
        return emailError;
      }

      if (String(answers.identity_name ?? "").trim().length < 3) {
        return "Informe seu nome completo.";
      }

      if (String(answers.identity_company ?? "").trim().length < 2) {
        return "Informe o nome da empresa.";
      }
    }

    return "";
  }

  function goBack() {
    if (currentStep === 0 && landingPath) {
      router.push(landingPath);
      return;
    }

    const nextStep = Math.max(currentStep - 1, 0);
    setCurrentStep(nextStep);
    persist(answers, nextStep);
  }

  async function goNext() {
    const validationError = getStepValidationError();

    if (validationError) {
      setError(validationError);
      return;
    }

    const timeOnStep = Math.round((Date.now() - stepStartedAt) / 1000);

    trackEvent("nps_step_completed", {
      token: sessionToken,
      step_id: step.id,
      time_on_step_seconds: timeOnStep,
      answered_count: step.questions.filter((question) => {
        const answer = answers[question.id];
        return answer !== undefined && String(answer).trim().length > 0;
      }).length,
    });

    if (isLastStep) {
      const session = loadSession(sessionToken);
      saveSession({
        token: sessionToken,
        currentStep,
        answers,
        startedAt: session?.startedAt ?? new Date().toISOString(),
        completedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      });

      try {
        const response = await fetch(`/api/nps/session/${sessionToken}/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
            currentStep,
          }),
        });
        if (response.status === 409) {
          router.replace(completionPath ?? `/nps/${sessionToken}/complete`);
          return;
        }
      } catch {
        setSaveState("Resposta salva localmente");
      }

      trackEvent("nps_survey_completed", {
        token: sessionToken,
        total_answered: answeredCount,
        nps_score:
          typeof answers.nps_recommendation === "number"
            ? answers.nps_recommendation
            : null,
      });

      router.push(completionPath ?? `/nps/${sessionToken}/complete`);
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    persist(answers, nextStep);
  }

  if (loadState === "loading") {
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
            <span className="status-pill">{campaignInfo.estimatedTimeLabel}</span>
          </header>

          <section className="panel state-panel">
            <p className="eyebrow">Pesquisa NPS</p>
            <h1>Preparando sua pesquisa.</h1>
            <p className="lead">
              Estamos preparando a experiência para registrar suas respostas com
              segurança.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (loadState === "unavailable") {
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
            <p className="eyebrow">Pesquisa não localizada</p>
            <h1>Não conseguimos abrir esta pesquisa.</h1>
            <p className="lead">
              Houve um problema para localizar a pesquisa solicitada. Atualize a
              página ou acione seu ponto de contato na Prime Control.
            </p>
            <p className="helper">
              Caso precise de apoio, fale com seu ponto de contato na Prime
              Control.
            </p>
          </section>
        </div>
      </main>
    );
  }

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
          <div className="topbar-meta">
            <span className="status-pill">{campaignInfo.estimatedTimeLabel}</span>
            <span className="status-pill subtle">{campaignInfo.validityLabel}</span>
          </div>
        </header>

        <section className="panel survey-card">
          <div className="progress-area">
            <div className="progress-meta">
              <span>
                {step.eyebrow} de {surveySteps.length}
              </span>
              <span>{progress}% concluído</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="survey-body">
            <p className="eyebrow">{step.eyebrow}</p>
            <h2>{step.title}</h2>
            {step.description ? <p className="lead">{step.description}</p> : null}
            <div
              className={`question-stack ${
                currentStep === 0 ? "identity-stack" : ""
              }`}
            >
              {step.questions.map((question) => (
                <QuestionBlock
                  key={question.id}
                  answer={answers[question.id]}
                  question={question}
                  onChange={(value) => updateAnswer(question, value)}
                />
              ))}
            </div>

            {error ? <p className="error-text">{error}</p> : null}
          </div>

          <footer className="footer-actions">
            <span className="save-state">
              {currentStep === 0
                ? `${saveState} | dados confirmados`
                : `${saveState} | ${answeredSurveyCount} de ${surveyQuestionCount} respostas`}
            </span>
            <div className="actions">
              {currentStep > 0 ? (
                <button className="button secondary" type="button" onClick={goBack}>
                  Voltar
                </button>
              ) : landingPath ? (
                <button className="button secondary" type="button" onClick={goBack}>
                  Voltar ao início
                </button>
              ) : null}
              <button className="button" type="button" onClick={goNext}>
                {isLastStep ? "Enviar pesquisa" : "Continuar"}
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

type QuestionBlockProps = {
  question: SurveyQuestion;
  answer: string | number | undefined;
  onChange: (value: string | number) => void;
};

function QuestionBlock({ question, answer, onChange }: QuestionBlockProps) {
  if (question.type === "identity") {
    return (
      <div className="field">
        <label htmlFor={question.id}>{question.label}</label>
        <input
          id={question.id}
          placeholder={identityPlaceholders[question.id] ?? ""}
          type={question.id === "identity_email" ? "email" : "text"}
          value={String(answer ?? "")}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  return (
    <article className="question">
      <p className="question-title">{question.label}</p>

      {question.type === "rating" ? (
        <>
          <div className="scale" role="radiogroup" aria-label={question.label}>
            {(question.scale === "nps_0_10"
              ? Array.from({ length: 11 }, (_, index) => index)
              : Array.from({ length: 5 }, (_, index) => index + 1)
            ).map((score) => (
              <button
                aria-checked={answer === score}
                className={`scale-button ${answer === score ? "selected" : ""}`}
                key={score}
                onClick={() => onChange(score)}
                role="radio"
                type="button"
              >
                {score}
              </button>
            ))}
          </div>
          <div className="scale-labels">
            {question.scale === "nps_0_10" ? (
              <>
                <span>0 = nada provável</span>
                <span>10 = muito provável</span>
              </>
            ) : (
              <>
                <span>1 = nada satisfeito</span>
                <span>5 = muito satisfeito</span>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <textarea
            aria-label={question.label}
            value={String(answer ?? "")}
            onChange={(event) => onChange(event.target.value)}
          />
          {question.helper ? <p className="helper">{question.helper}</p> : null}
        </>
      )}
    </article>
  );
}
