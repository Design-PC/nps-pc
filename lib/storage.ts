export type SurveyAnswers = Record<string, string | number>;

export type StoredSurveySession = {
  token: string;
  currentStep: number;
  answers: SurveyAnswers;
  startedAt?: string;
  completedAt?: string;
  lastActivityAt: string;
};

export function getStorageKey(token: string) {
  return `prime-control-nps:${token}`;
}

export function loadSession(token: string): StoredSurveySession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(getStorageKey(token));
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as StoredSurveySession;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSurveySession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(session.token), JSON.stringify(session));
}

