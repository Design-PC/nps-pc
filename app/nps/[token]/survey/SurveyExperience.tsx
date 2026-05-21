"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStepByIndex,
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
};

const prefilledIdentity: SurveyAnswers = {
  identity_name: "Cliente Prime Control",
  identity_email: "cliente@empresa.com.br",
  identity_company: "Empresa Cliente",
  identity_area: "Operações",
  identity_role: "Gestor(a)",
};

function normalizeStoredAnswers(storedAnswers: SurveyAnswers) {
  return {
    ...storedAnswers,
    identity_area:
      storedAnswers.identity_area === "Operacoes"
        ? "Operações"
        : storedAnswers.identity_area,
  };
}

export function SurveyExperience({ token }: SurveyExperienceProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(prefilledIdentity);
  const [saveState, setSaveState] = useState("Progresso salvo");
  const [error, setError] = useState("");
  const [stepStartedAt, setStepStartedAt] = useState(Date.now());
  const [questionStartedAt, setQuestionStartedAt] = useState<
    Record<string, number>
  >({});

  const step = getStepByIndex(currentStep);
  const progress = Math.round(((currentStep + 1) / surveySteps.length) * 100);
  const isLastStep = currentStep === surveySteps.length - 1;

  const answeredCount = useMemo(() => {
    return surveySteps
      .flatMap((surveyStep) => surveyStep.questions)
      .filter((question) => {
        const answer = answers[question.id];
        return answer !== undefined && String(answer).trim().length > 0;
      }).length;
  }, [answers]);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const response = await fetch(`/api/nps/session/${token}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!isMounted) {
          return;
        }

        if (data.recipient?.status === "completed" || data.session?.completedAt) {
          router.replace(`/nps/${token}/complete`);
          return;
        }

        if (data.session) {
          setCurrentStep(data.session.currentStep ?? 0);
          setAnswers({
            ...prefilledIdentity,
            ...normalizeStoredAnswers(data.session.answers ?? {}),
          });
          saveSession({
            token,
            currentStep: data.session.currentStep ?? 0,
            answers: data.session.answers ?? prefilledIdentity,
            startedAt: data.session.startedAt,
            lastActivityAt: data.session.lastActivityAt ?? new Date().toISOString(),
          });
        }

        await fetch(`/api/nps/session/${token}/start`, {
          method: "POST",
        });
      } catch {
        const stored = loadSession(token);

        if (stored?.completedAt) {
          router.replace(`/nps/${token}/complete`);
          return;
        }

        if (stored) {
          setCurrentStep(stored.currentStep);
          setAnswers({ ...prefilledIdentity, ...normalizeStoredAnswers(stored.answers) });
          trackEvent("nps_survey_resumed", {
            token,
            last_step: stored.currentStep,
          });
          return;
        }

        const initialSession: StoredSurveySession = {
          token,
          currentStep: 0,
          answers: prefilledIdentity,
          startedAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        };

        saveSession(initialSession);
      }

      trackEvent("nps_survey_started", { token });
    }

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, [router, token]);

  useEffect(() => {
    setStepStartedAt(Date.now());
    setError("");
    trackEvent("nps_step_viewed", {
      token,
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
        token,
        question_id: question.id,
        category: question.category,
        question_type: question.type,
      });
    });
  }, [progress, step, token]);

  function persist(nextAnswers: SurveyAnswers, nextStep = currentStep) {
    setSaveState("Salvando...");

    const session: StoredSurveySession = {
      token,
      currentStep: nextStep,
      answers: nextAnswers,
      startedAt: loadSession(token)?.startedAt ?? new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    saveSession(session);

    fetch(`/api/nps/session/${token}/answer`, {
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
          router.replace(`/nps/${token}/complete`);
        }
      })
      .catch(() => {
        setSaveState("Progresso salvo localmente");
      });

    window.setTimeout(() => {
      setSaveState("Progresso salvo");
      trackEvent("nps_survey_autosaved", {
        token,
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
      token,
      question_id: question.id,
      category: question.category,
      answer_type: question.type,
      time_to_answer_seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
    });
  }

  function isStepValid() {
    return step.questions.every((question) => {
      if (!question.required) {
        return true;
      }

      const answer = answers[question.id];
      return answer !== undefined && String(answer).trim().length > 0;
    });
  }

  function goBack() {
    const nextStep = Math.max(currentStep - 1, 0);
    setCurrentStep(nextStep);
    persist(answers, nextStep);
  }

  async function goNext() {
    if (!isStepValid()) {
      setError("Preencha os campos obrigatórios desta etapa para continuar.");
      return;
    }

    const timeOnStep = Math.round((Date.now() - stepStartedAt) / 1000);

    trackEvent("nps_step_completed", {
      token,
      step_id: step.id,
      time_on_step_seconds: timeOnStep,
      answered_count: step.questions.filter((question) => answers[question.id])
        .length,
    });

    if (isLastStep) {
      const session = loadSession(token);
      saveSession({
        token,
        currentStep,
        answers,
        startedAt: session?.startedAt ?? new Date().toISOString(),
        completedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      });

      try {
        const response = await fetch(`/api/nps/session/${token}/complete`, {
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
          router.replace(`/nps/${token}/complete`);
          return;
        }
      } catch {
        setSaveState("Resposta salva localmente");
      }

      trackEvent("nps_survey_completed", {
        token,
        total_answered: answeredCount,
        nps_score:
          typeof answers.nps_recommendation === "number"
            ? answers.nps_recommendation
            : null,
      });

      router.push(`/nps/${token}/complete`);
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    persist(answers, nextStep);
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
          <span className="status-pill">Tempo estimado: 3 a 5 minutos</span>
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
            <p className="lead">{step.description}</p>

            <div className="question-stack">
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
              {saveState} | {answeredCount} de {totalQuestionCount} respostas
            </span>
            <div className="actions">
              {currentStep > 0 ? (
                <button className="button secondary" type="button" onClick={goBack}>
                  Voltar
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
            {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
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
            <span>1 = nada satisfeito/provável</span>
            <span>10 = muito satisfeito/provável</span>
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
