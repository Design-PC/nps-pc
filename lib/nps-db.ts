import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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

type SupabaseRecipientRow = {
  token: string;
  name: string;
  email: string;
  company: string;
  area: string;
  role: string;
  status: RecipientStatus;
  invited_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  last_activity_at?: string | null;
  current_step: number;
};

type SupabaseSessionRow = {
  token: string;
  answers: AnswerMap;
  current_step: number;
  started_at?: string | null;
  completed_at?: string | null;
  last_activity_at: string;
};

type SupabaseEventRow = {
  id: string;
  token: string;
  event_name: string;
  properties: Record<string, unknown>;
  created_at: string;
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

function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase is not configured.");
  }

  return { url, key };
}

async function supabaseRequest<T>(
  pathName: string,
  init: RequestInit = {},
): Promise<T> {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${pathName}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function toRecipient(row: SupabaseRecipientRow): NpsRecipient {
  return {
    token: row.token,
    name: row.name,
    email: row.email,
    company: row.company,
    area: row.area,
    role: row.role,
    status: row.status,
    invitedAt: row.invited_at,
    startedAt: row.started_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    lastActivityAt: row.last_activity_at ?? undefined,
    currentStep: row.current_step,
  };
}

function toRecipientRow(recipient: NpsRecipient): SupabaseRecipientRow {
  return {
    token: recipient.token,
    name: recipient.name,
    email: recipient.email,
    company: recipient.company,
    area: recipient.area,
    role: recipient.role,
    status: recipient.status,
    invited_at: recipient.invitedAt,
    started_at: recipient.startedAt,
    completed_at: recipient.completedAt,
    last_activity_at: recipient.lastActivityAt,
    current_step: recipient.currentStep,
  };
}

function toSession(row: SupabaseSessionRow): NpsSession {
  return {
    token: row.token,
    answers: row.answers ?? {},
    currentStep: row.current_step,
    startedAt: row.started_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    lastActivityAt: row.last_activity_at,
  };
}

function toSessionRow(session: NpsSession): SupabaseSessionRow {
  return {
    token: session.token,
    answers: session.answers,
    current_step: session.currentStep,
    started_at: session.startedAt,
    completed_at: session.completedAt,
    last_activity_at: session.lastActivityAt,
  };
}

function toEvent(row: SupabaseEventRow): NpsEvent {
  return {
    id: row.id,
    token: row.token,
    eventName: row.event_name,
    properties: row.properties,
    createdAt: row.created_at,
  };
}

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

async function ensureLocalDb() {
  await mkdir(dataDir, { recursive: true });

  if (!existsSync(dbPath)) {
    await writeLocalDb({
      recipients: [demoRecipient],
      sessions: [],
      events: [],
    });
  }
}

async function readLocalDb(): Promise<NpsDatabase> {
  await ensureLocalDb();
  const raw = await readFile(dbPath, "utf-8");
  return JSON.parse(raw) as NpsDatabase;
}

async function writeLocalDb(db: NpsDatabase) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, "utf-8");
}

async function readSupabaseDb(): Promise<NpsDatabase> {
  const [recipientRows, sessionRows, eventRows] = await Promise.all([
    supabaseRequest<SupabaseRecipientRow[]>("nps_recipients?select=*&order=invited_at.desc"),
    supabaseRequest<SupabaseSessionRow[]>("nps_sessions?select=*"),
    supabaseRequest<SupabaseEventRow[]>("nps_events?select=*&order=created_at.desc&limit=500"),
  ]);

  return {
    recipients: recipientRows.map(toRecipient),
    sessions: sessionRows.map(toSession),
    events: eventRows.map(toEvent),
  };
}

export async function readDb(): Promise<NpsDatabase> {
  if (isSupabaseConfigured()) {
    return readSupabaseDb();
  }

  return readLocalDb();
}

async function upsertRecipient(recipient: NpsRecipient) {
  await supabaseRequest<SupabaseRecipientRow[]>("nps_recipients?on_conflict=token", {
    method: "POST",
    body: JSON.stringify(toRecipientRow(recipient)),
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
  });
}

async function upsertSession(session: NpsSession) {
  await supabaseRequest<SupabaseSessionRow[]>("nps_sessions?on_conflict=token", {
    method: "POST",
    body: JSON.stringify(toSessionRow(session)),
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
  });
}

async function getSupabaseRecipient(token: string) {
  const rows = await supabaseRequest<SupabaseRecipientRow[]>(
    `nps_recipients?token=eq.${encodeURIComponent(token)}&select=*&limit=1`,
  );
  return rows[0] ? toRecipient(rows[0]) : null;
}

async function getSupabaseSession(token: string) {
  const rows = await supabaseRequest<SupabaseSessionRow[]>(
    `nps_sessions?token=eq.${encodeURIComponent(token)}&select=*&limit=1`,
  );
  return rows[0] ? toSession(rows[0]) : null;
}

export function findQuestion(questionId: string): SurveyQuestion | undefined {
  return surveySteps.flatMap((step) => step.questions).find((question) => question.id === questionId);
}

export async function getOrCreateSession(token: string) {
  if (isSupabaseConfigured()) {
    let recipient = await getSupabaseRecipient(token);

    if (!recipient) {
      recipient = {
        ...demoRecipient,
        token,
        status: "invited",
        invitedAt: new Date().toISOString(),
        currentStep: 0,
      };
      await upsertRecipient(recipient);
    }

    let session = await getSupabaseSession(token);

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
      await upsertSession(session);
    }

    return { recipient, session };
  }

  const db = await readLocalDb();
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

  await writeLocalDb(db);
  return { recipient, session };
}

export async function startSession(token: string) {
  const now = new Date().toISOString();
  const { recipient, session } = await getOrCreateSession(token);

  if (!recipient.startedAt) {
    recipient.startedAt = now;
  }
  if (!session.startedAt) {
    session.startedAt = now;
  }

  recipient.status = recipient.status === "completed" ? "completed" : "started";
  recipient.lastActivityAt = now;
  session.lastActivityAt = now;

  if (isSupabaseConfigured()) {
    await Promise.all([upsertRecipient(recipient), upsertSession(session)]);
    return { recipient, session };
  }

  const db = await readLocalDb();
  const recipientIndex = db.recipients.findIndex((item) => item.token === token);
  const sessionIndex = db.sessions.findIndex((item) => item.token === token);
  db.recipients[recipientIndex] = recipient;
  db.sessions[sessionIndex] = session;
  await writeLocalDb(db);
  return { recipient, session };
}

export async function saveAnswers(token: string, answers: AnswerMap, currentStep: number) {
  const now = new Date().toISOString();
  const { recipient, session } = await getOrCreateSession(token);

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

  if (isSupabaseConfigured()) {
    await Promise.all([upsertRecipient(recipient), upsertSession(session)]);
    return { recipient, session, alreadyCompleted: false };
  }

  const db = await readLocalDb();
  const recipientIndex = db.recipients.findIndex((item) => item.token === token);
  const sessionIndex = db.sessions.findIndex((item) => item.token === token);
  db.recipients[recipientIndex] = recipient;
  db.sessions[sessionIndex] = session;
  await writeLocalDb(db);
  return { recipient, session, alreadyCompleted: false };
}

export async function completeSession(token: string, answers: AnswerMap, currentStep: number) {
  const now = new Date().toISOString();
  const { recipient, session } = await getOrCreateSession(token);

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

  if (isSupabaseConfigured()) {
    await Promise.all([upsertRecipient(recipient), upsertSession(session)]);
    return { recipient, session, alreadyCompleted: false };
  }

  const db = await readLocalDb();
  const recipientIndex = db.recipients.findIndex((item) => item.token === token);
  const sessionIndex = db.sessions.findIndex((item) => item.token === token);
  db.recipients[recipientIndex] = recipient;
  db.sessions[sessionIndex] = session;
  await writeLocalDb(db);
  return { recipient, session, alreadyCompleted: false };
}

export async function recordEvent(
  token: string,
  eventName: string,
  properties: Record<string, unknown>,
) {
  const event: NpsEvent = {
    id: crypto.randomUUID(),
    token,
    eventName,
    properties,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    await supabaseRequest<SupabaseEventRow[]>("nps_events", {
      method: "POST",
      body: JSON.stringify({
        id: event.id,
        token: event.token,
        event_name: event.eventName,
        properties: event.properties,
        created_at: event.createdAt,
      }),
    });
    return;
  }

  const db = await readLocalDb();
  db.events.push(event);
  await writeLocalDb(db);
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

