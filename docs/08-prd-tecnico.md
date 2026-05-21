# 08 - PRD Técnico

## Visão Geral

Construir uma plataforma própria de Pesquisa NPS Corporativa B2B para clientes ativos Prime Control, integrada ao HubSpot e instrumentada com analytics comportamental completo.

## Objetivos Do Produto

- Aumentar taxa de abertura, início e conclusão.
- Reduzir abandono.
- Melhorar qualidade das respostas.
- Preservar perguntas aprovadas.
- Obter visibilidade completa da jornada.
- Integrar sinais ao CRM e dashboards executivos.

## Escopo MVP

- Landing personalizada por token.
- Pesquisa multi-step.
- Identificação pré-preenchida.
- Autosave.
- Retomada.
- Persistência de respostas.
- Tracking de eventos principais.
- Integração básica HubSpot.
- Dashboard inicial de funil.

## Frontend

Stack:

- Next.js
- TypeScript
- Tailwind
- Shadcn UI
- React Hook Form
- Zod
- PostHog SDK
- Microsoft Clarity
- GA4

Rotas:

```text
/nps/[token]
/nps/[token]/survey
/nps/[token]/complete
```

Componentes:

- `SurveyLayout`
- `LandingIntro`
- `ProgressBar`
- `StepHeader`
- `IdentificationConfirm`
- `RatingScale`
- `OpenTextQuestion`
- `AutosaveIndicator`
- `ResumeBanner`
- `StepNavigation`
- `CompletionState`
- `TokenErrorState`

Estados:

- loading
- token inválido
- token expirado
- já respondido
- não iniciado
- em andamento
- salvando
- salvo
- erro de salvamento
- concluído

## Backend

Responsabilidades:

- Validar token.
- Criar sessão.
- Registrar início.
- Persistir respostas parciais.
- Persistir eventos.
- Concluir pesquisa.
- Atualizar HubSpot.
- Expor dados para dashboard.

Endpoints:

```text
GET /api/nps/session/:token
POST /api/nps/session/:token/start
POST /api/nps/session/:token/answer
POST /api/nps/session/:token/autosave
POST /api/nps/session/:token/complete
POST /api/nps/events
POST /api/hubspot/webhook
```

## Banco De Dados

### nps_campaigns

```text
id
name
period
status
created_at
updated_at
```

### nps_recipients

```text
id
campaign_id
hubspot_contact_id
hubspot_company_id
name
email
company
area
role
token_hash
token_expires_at
invited_at
opened_at
clicked_at
started_at
completed_at
created_at
updated_at
```

### nps_sessions

```text
id
recipient_id
status
current_step
progress_percent
total_time_seconds
last_activity_at
completed_at
created_at
updated_at
```

### nps_questions

```text
id
campaign_id
category
question_text
question_type
scale_min
scale_max
display_order
is_required
created_at
updated_at
```

### nps_answers

```text
id
session_id
question_id
value_number
value_text
answered_at
time_to_answer_seconds
revisited_count
created_at
updated_at
```

### nps_events

```text
id
session_id
recipient_id
event_name
properties_json
created_at
```

## HubSpot

Propriedades customizadas sugeridas:

```text
nps_2026_status
nps_2026_invited_at
nps_2026_opened_at
nps_2026_clicked_at
nps_2026_started_at
nps_2026_completed_at
nps_2026_abandoned_step
nps_2026_score
nps_2026_segment
```

## Analytics

Ferramentas:

- Microsoft Clarity para comportamento visual.
- PostHog para eventos, funil e coortes.
- GA4 para aquisição e origem.

Eventos mínimos:

- `nps_landing_viewed`
- `nps_survey_started`
- `nps_step_viewed`
- `nps_question_answered`
- `nps_step_completed`
- `nps_survey_abandoned`
- `nps_survey_resumed`
- `nps_survey_completed`

## Segurança E LGPD

Requisitos:

- HTTPS obrigatório.
- Token aleatório, único e expiráveis.
- Armazenar hash do token.
- Minimizar dados pessoais.
- Restringir acesso ao dashboard.
- Registrar consentimento ou aviso de uso.
- Não expor respostas individuais fora dos perfis autorizados.
- Agregar dados quando usados em fóruns executivos.

## Critérios De Aceite

- Usuário consegue iniciar sem login.
- Identificação aparece pré-preenchida quando dados existem.
- Progresso é salvo automaticamente.
- Usuário consegue retomar do ponto de abandono.
- Eventos principais aparecem em PostHog.
- Clarity registra sessões e heatmaps.
- HubSpot recebe status atualizado.
- Dashboard mostra funil mínimo.
- Mobile permite concluir sem quebra visual.

