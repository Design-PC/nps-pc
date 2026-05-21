# 04 - Estratégia De Analytics E Taxonomia De Eventos

## Objetivo

Medir a jornada completa do respondente: entrada, início, comportamento, abandono, retomada e conclusão. A solução deve permitir otimização contínua da experiência e identificação de clientes silenciosos ou em risco.

## Stack Recomendada

- HubSpot: envio, listas, propriedades do contato, lembretes.
- Microsoft Clarity: heatmaps, session replay, rage clicks, dead clicks.
- PostHog: eventos, funis, coortes, session replay, feature flags.
- GA4: tráfego, campanhas, dispositivo, origem.
- PostgreSQL/Supabase: respostas, sessões, eventos e progresso.
- Power BI ou Metabase: dashboard executivo.

## Naming Convention

Formato:

```text
nps_[object]_[action]
```

Exemplos:

- `nps_email_opened`
- `nps_landing_viewed`
- `nps_survey_started`
- `nps_question_answered`
- `nps_survey_completed`

## Eventos Obrigatórios

| Evento | Trigger | Properties |
|---|---|---|
| `nps_email_sent` | Disparo via HubSpot | campaign_id, contact_id, company_id, segment |
| `nps_email_opened` | Pixel/open HubSpot | campaign_id, contact_id, company_id |
| `nps_email_clicked` | Clique no CTA | campaign_id, contact_id, company_id, email_variant |
| `nps_landing_viewed` | Carregamento da landing | token_id, campaign_id, source, device, browser |
| `nps_survey_started` | Clique em iniciar | time_to_start_seconds, campaign_id, contact_role |
| `nps_identification_confirmed` | Confirma dados | prefilled_fields_count, edited_fields_count |
| `nps_step_viewed` | Etapa exibida | step_id, step_name, progress_percent |
| `nps_question_viewed` | Pergunta entra em viewport | question_id, category, question_type |
| `nps_question_answered` | Resposta registrada | question_id, category, answer_type, time_to_answer_seconds |
| `nps_question_revisited` | Usuário retorna à pergunta | question_id, revisited_count |
| `nps_open_text_focused` | Campo aberto recebe foco | question_id, step_id |
| `nps_open_text_completed` | Campo aberto preenchido | question_id, char_count, time_spent_seconds |
| `nps_step_completed` | Clique em continuar | step_id, time_on_step_seconds, answered_count |
| `nps_survey_autosaved` | Autosave concluído | step_id, question_id, save_latency_ms |
| `nps_survey_abandoned` | Inatividade/saída detectada | last_step, last_question, elapsed_time_seconds, progress_percent |
| `nps_survey_resumed` | Retorno com progresso | last_step, days_since_last_activity |
| `nps_survey_completed` | Envio final | total_time_seconds, nps_score, device, completion_path |

## Propriedades Globais

Enviar em todos os eventos quando possível:

- `campaign_id`
- `recipient_id`
- `hubspot_contact_id`
- `hubspot_company_id`
- `company_segment`
- `company_size`
- `contact_role`
- `device_type`
- `browser`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `session_id`

## Métricas Derivadas

- Open rate
- Click rate
- Start rate
- Completion rate
- Abandonment rate
- Drop-off por etapa
- Drop-off por pergunta
- Tempo médio por etapa
- Tempo médio por pergunta
- Taxa de retomada
- Taxa de conclusão após retomada
- Campos abertos ignorados
- Campos revisitados
- Clientes silenciosos
- Friction score

## Friction Score

Modelo inicial:

```text
friction_score =
  abandono_na_etapa * 35
  + tempo_acima_p75 * 20
  + rage_clicks * 15
  + dead_clicks * 10
  + revisitas * 10
  + campos_abertos_ignorados * 10
```

Faixas:

- 0 a 30: baixo atrito
- 31 a 60: atenção
- 61 a 100: alto atrito

## Dashboard De Funil

Funil mínimo:

```text
Email enviado
↓
Email aberto
↓
Clique no CTA
↓
Landing visualizada
↓
Pesquisa iniciada
↓
Identificação confirmada
↓
NPS respondido
↓
Percepção de valor concluída
↓
Qualidade operacional concluída
↓
Inovação e futuro concluída
↓
Pesquisa concluída
```

