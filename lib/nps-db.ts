import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { surveySteps, totalQuestionCount, type SurveyQuestion } from "@/lib/survey";

export type AnswerValue = string | number;
export type AnswerMap = Record<string, AnswerValue>;

export type RecipientStatus =
  | "invited"
  | "started"
  | "in_progress"
  | "completed"
  | "abandoned";

export type NpsRecipient = {
  token: string;
  name: string;
  email: string;
  company: string;
  area: string;
  role: string;
  status: RecipientStatus;
  invitedAt: string;
  startedAt?: string;
  completedAt?: string;
  lastActivityAt?: string;
  currentStep: number;
};

export type NpsSession = {
  token: string;
  answers: AnswerMap;
  currentStep: number;
  startedAt?: string;
  completedAt?: string;
  lastActivityAt: string;
};

export type NpsEvent = {
  id: string;
  token: string;
  eventName: string;
  properties: Record<string, unknown>;
  createdAt: string;
};

export type NpsDatabase = {
  recipients: NpsRecipient[];
  sessions: NpsSession[];
  events: NpsEvent[];
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "nps-db.json");

const demoRecipient: NpsRecipient = {
  token: "demo-prime-control",
  name: "Cliente Prime Control",
  email: "cliente@empresa.com.br",
  company: "Empresa Cliente",
  area: "Operações",
  role: "Gestor(a)",
  status: "invited",
  invitedAt: new Date().toISOString(),
  currentStep: 0,
};

const identityAnswers: AnswerMap = {
  identity_name: demoRecipient.name,
  identity_email: demoRecipient.email,
  identity_company: demoRecipient.company,
  identity_area: demoRecipient.area,
  identity_role: demoRecipient.role,
};

function applyIdentityAnswers(recipient: NpsRecipient, answers: AnswerMap) {
  if (typeof answers.identity_name === "string") {
    recipient.name = answers.identity_name;
  }
  if (typeof answers.identity_email === "string") {
    recipient.email = answers.identity_email;
  }
  if (typeof answers.identity_company === "string") {
    recipient.company = answers.identity_company;
  }
  if (typeof answers.identity_area === "string") {
    recipient.area = answers.identity_area;
  }
  if (typeof answers.identity_role === "string") {
    recipient.role = answers.identity_role;
  }
}

async function ensureDb() {
  await mkdir(dataDir, { recursive: true });

  if (!existsSync(dbPath)) {
    const initialDb: NpsDatabase = {
      recipients: [demoRecipient],
      sessions: [],
      events: [],
    };

    await writeDb(initialDb);
  }
}

export async function readDb(): Promise<NpsDatabase> {
  await ensureDb();
  const raw = await readFile(dbPath, "utf-8");
  return JSON.parse(raw) as NpsDatabase;
}

export async function writeDb(db: NpsDatabase) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, "utf-8");
}

export function findQuestion(questionId: string): SurveyQuestion | undefined {
  return surveySteps.flatMap((step) => step.questions).find((question) => question.id === questionId);
}

export async function getOrCreateSession(token: string) {
  const db = await readDb();
  let recipient = db.recipients.find((item) => item.token === token);

  if (!recipient) {
    recipient = {
      ...demoRecipient,
      token,
      status: "invited",
      invitedAt: new Date().toISOString(),
      currentStep: 0,
    };
    db.recipients.push(recipient);
  }

  let session = db.sessions.find((item) => item.token === token);

  if (!session) {
    session = {
      token,
      answers: {
        ...identityAnswers,
        identity_name: recipient.name,
        identity_email: recipient.email,
        identity_company: recipient.company,
        identity_area: recipient.area,
        identity_role: recipient.role,
      },
      currentStep: recipient.currentStep,
      lastActivityAt: new Date().toISOString(),
    };
    db.sessions.push(session);
  }

  await writeDb(db);
  return { recipient, session };
}

export async function startSession(token: string) {
  const db = await readDb();
  const now = new Date().toISOString();
  const recipient = db.recipients.find((item) => item.token === token);
  const session = db.sessions.find((item) => item.token === token);

  if (!recipient || !session) {
    return getOrCreateSession(token);
  }

  if (!recipient.startedAt) {
    recipient.startedAt = now;
  }

  if (!session.startedAt) {
    session.startedAt = now;
  }

  recipient.status = recipient.status === "completed" ? "completed" : "started";
  recipient.lastActivityAt = now;
  session.lastActivityAt = now;
  await writeDb(db);
  return { recipient, session };
}

export async function saveAnswers(token: string, answers: AnswerMap, currentStep: number) {
  const db = await readDb();
  const now = new Date().toISOString();
  const recipient = db.recipients.find((item) => item.token === token);
  const session = db.sessions.find((item) => item.token === token);

  if (!recipient || !session) {
    await getOrCreateSession(token);
    return saveAnswers(token, answers, currentStep);
  }

  if (recipient.status === "completed") {
    return { recipient, session, alreadyCompleted: true };
  }

  session.answers = {
    ...session.answers,
    ...answers,
  };
  applyIdentityAnswers(recipient, session.answers);
  session.currentStep = currentStep;
  session.lastActivityAt = now;
  recipient.currentStep = currentStep;
  recipient.status = "in_progress";
  recipient.lastActivityAt = now;

  if (!recipient.startedAt) {
    recipient.startedAt = now;
  }
  if (!session.startedAt) {
    session.startedAt = now;
  }

  await writeDb(db);
  return { recipient, session, alreadyCompleted: false };
}

export async function completeSession(token: string, answers: AnswerMap, currentStep: number) {
  const db = await readDb();
  const now = new Date().toISOString();
  const recipient = db.recipients.find((item) => item.token === token);
  const session = db.sessions.find((item) => item.token === token);

  if (!recipient || !session) {
    await getOrCreateSession(token);
    return completeSession(token, answers, currentStep);
  }

  if (recipient.status === "completed") {
    return { recipient, session, alreadyCompleted: true };
  }

  session.answers = {
    ...session.answers,
    ...answers,
  };
  applyIdentityAnswers(recipient, session.answers);
  session.currentStep = currentStep;
  session.completedAt = now;
  session.lastActivityAt = now;
  recipient.status = "completed";
  recipient.currentStep = currentStep;
  recipient.completedAt = now;
  recipient.lastActivityAt = now;
  if (!recipient.startedAt) {
    recipient.startedAt = session.startedAt ?? now;
  }
  if (!session.startedAt) {
    session.startedAt = recipient.startedAt;
  }

  await writeDb(db);
  return { recipient, session, alreadyCompleted: false };
}

export async function recordEvent(
  token: string,
  eventName: string,
  properties: Record<string, unknown>,
) {
  const db = await readDb();
  db.events.push({
    id: crypto.randomUUID(),
    token,
    eventName,
    properties,
    createdAt: new Date().toISOString(),
  });
  await writeDb(db);
}

export function getAnsweredCount(answers: AnswerMap) {
  return surveySteps
    .flatMap((step) => step.questions)
    .filter((question) => {
      const answer = answers[question.id];
      return answer !== undefined && String(answer).trim().length > 0;
    }).length;
}

export async function getDashboardData() {
  const db = await readDb();
  const totalRecipients = db.recipients.length;
  const started = db.recipients.filter((recipient) => recipient.startedAt).length;
  const completed = db.recipients.filter((recipient) => recipient.status === "completed").length;
  const inProgress = db.recipients.filter((recipient) =>
    ["started", "in_progress"].includes(recipient.status),
  ).length;
  const completionRate = started > 0 ? Math.round((completed / started) * 100) : 0;

  const stepDropoff = surveySteps.map((step, index) => {
    const reached = db.recipients.filter((recipient) => recipient.currentStep >= index).length;
    const stoppedHere = db.recipients.filter(
      (recipient) => recipient.currentStep === index && recipient.status !== "completed",
    ).length;
    return {
      stepId: step.id,
      stepName: step.title,
      reached,
      stoppedHere,
    };
  });

  const rows = db.recipients.map((recipient) => {
    const session = db.sessions.find((item) => item.token === recipient.token);
    return {
      ...recipient,
      answeredCount: session ? getAnsweredCount(session.answers) : 0,
      totalQuestionCount,
      npsScore: session?.answers.nps_recommendation ?? null,
    };
  });

  return {
    summary: {
      totalRecipients,
      started,
      inProgress,
      completed,
      completionRate,
    },
    stepDropoff,
    rows,
  };
}
