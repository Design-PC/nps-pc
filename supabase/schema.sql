create extension if not exists pgcrypto;

create table if not exists public.nps_recipients (
  token text primary key,
  name text not null default '',
  email text not null default '',
  company text not null default '',
  area text not null default '',
  role text not null default '',
  status text not null default 'invited'
    check (status in ('invited', 'started', 'in_progress', 'completed', 'abandoned')),
  invited_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz,
  current_step integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nps_sessions (
  token text primary key references public.nps_recipients(token) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  current_step integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nps_events (
  id uuid primary key default gen_random_uuid(),
  token text not null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists nps_recipients_status_idx on public.nps_recipients(status);
create index if not exists nps_recipients_company_idx on public.nps_recipients(company);
create index if not exists nps_events_token_idx on public.nps_events(token);
create index if not exists nps_events_name_idx on public.nps_events(event_name);
create index if not exists nps_events_created_at_idx on public.nps_events(created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_nps_recipients_updated_at on public.nps_recipients;
create trigger set_nps_recipients_updated_at
before update on public.nps_recipients
for each row execute function public.set_updated_at();

drop trigger if exists set_nps_sessions_updated_at on public.nps_sessions;
create trigger set_nps_sessions_updated_at
before update on public.nps_sessions
for each row execute function public.set_updated_at();

alter table public.nps_recipients enable row level security;
alter table public.nps_sessions enable row level security;
alter table public.nps_events enable row level security;

-- The application uses SUPABASE_SERVICE_ROLE_KEY server-side.
-- Do not expose the service role key in the browser.

