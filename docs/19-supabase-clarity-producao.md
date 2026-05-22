# 19 - Supabase E Clarity Para Produção

## Clarity

Project ID recebido:

```text
wur93c9z3i
```

Variável configurada no projeto:

```text
NEXT_PUBLIC_CLARITY_PROJECT_ID=wur93c9z3i
```

Na Vercel, adicionar a mesma variável em:

```text
Project Settings > Environment Variables
```

## Supabase

A camada de dados foi migrada para funcionar com Supabase/PostgreSQL.

Arquivo SQL criado:

```text
supabase/schema.sql
```

Esse SQL cria:

- `nps_recipients`
- `nps_sessions`
- `nps_events`
- índices
- triggers de `updated_at`
- RLS habilitado

## Variáveis Necessárias

Para ativar Supabase:

```text
SUPABASE_URL=https://thyorrnjmulazidpxcpr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
```

Essas variáveis são server-side. Nunca expor `SUPABASE_SERVICE_ROLE_KEY` no navegador.

Status atual:

- `SUPABASE_URL` identificado.
- `SUPABASE_SERVICE_ROLE_KEY` recebido e configurado apenas no `.env.local` local.
- Teste REST retornou `404`, indicando que as tabelas ainda precisam ser criadas no Supabase.

Recomendação de segurança: como a `service_role key` foi compartilhada no chat, rotacionar a chave no Supabase depois da configuração inicial.

## Como Configurar

1. Abrir o projeto Supabase.
2. Ir em SQL Editor.
3. Rodar o conteúdo de `supabase/schema.sql`.
4. Ir em Project Settings > API.
5. Copiar:
   - Project URL
   - service_role key
6. Configurar na Vercel:

```text
SUPABASE_URL=<project_url>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

## Desenvolvimento Local

Se Supabase não estiver configurado, o sistema usa fallback local em JSON para desenvolvimento.

Em produção/Vercel, configurar Supabase antes de testar coleta real.
