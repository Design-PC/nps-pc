# Segurança e governança de dados

## Objetivo

Proteger dados de clientes, respostas da pesquisa, exportações internas e integrações corporativas. O sistema deve tratar informações de clientes como dados restritos, mesmo quando a pesquisa não for anônima.

## Decisão imediata

O acesso interno ao dashboard e às exportações deve ser protegido por autenticação administrativa forte. A sessão administrativa não deve armazenar senha em cookie, mesmo codificada.

## Medidas implementadas

- Cookie administrativo assinado com HMAC SHA-256.
- Senha administrativa removida do conteúdo do cookie.
- Expiração da sessão administrativa reduzida para 8 horas.
- `ADMIN_SESSION_SECRET` obrigatório em produção.
- Remoção do fallback por Basic Auth nas APIs internas.
- Headers básicos de segurança:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` bloqueando câmera, microfone e geolocalização.

## Variáveis obrigatórias em produção

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

As variáveis devem ser cadastradas como sensíveis na Vercel. Não devem ser commitadas em arquivos do repositório.

## Próximas prioridades

### P0 - Antes de enviar para clientes

- Configurar `ADMIN_SESSION_SECRET` forte na Vercel.
- Trocar qualquer senha temporária do admin.
- Remover dados de teste reais antes de campanha oficial.
- Validar que `/admin` e `/api/admin/*` não abrem sem login.
- Ativar mascaramento de dados no Microsoft Clarity para campos pessoais.
- Garantir que o Service Role Key do Supabase nunca use prefixo `NEXT_PUBLIC_`.

### P1 - Antes de escalar a campanha

- Substituir login simples por SSO corporativo ou magic link interno.
- Criar perfis de acesso: Marketing, Liderança, CS e Admin técnico.
- Registrar logs de acesso ao dashboard e exportações.
- Implementar rotação periódica de segredos.
- Revisar permissões do app Microsoft Graph com princípio de menor privilégio.

### P2 - Governança contínua

- Criar rotina de backup/exportação segura.
- Definir política de retenção de dados.
- Registrar incidente, responsável e plano de resposta.
- Revisar LGPD: finalidade, acesso, minimização e retenção.

## Melhor próximo passo

O melhor próximo passo é configurar as variáveis seguras em produção e testar acesso interno:

1. Gerar um `ADMIN_SESSION_SECRET` forte.
2. Cadastrar na Vercel como variável sensível.
3. Fazer novo deploy.
4. Testar `/admin` sem login: deve redirecionar.
5. Testar `/api/admin/export.csv` sem login: deve retornar `401`.
6. Testar login e exportações após autenticação.

Depois disso, o próximo salto recomendado é SSO corporativo.
