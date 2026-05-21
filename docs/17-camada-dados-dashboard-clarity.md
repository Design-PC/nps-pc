# 17 - Camada De Dados, Dashboard E Clarity

## Implementado Nesta Etapa

O prototipo passou a ter uma camada funcional de dados para MVP local.

Foram implementados:

- APIs internas do sistema.
- Persistencia local em arquivo JSON.
- Salvamento real de respostas.
- Bloqueio inicial para resposta unica por token.
- Dashboard interno MVP.
- Exportacao CSV.
- Preparacao para Microsoft Clarity via variavel de ambiente.

## APIs Criadas

```text
GET  /api/nps/session/[token]
POST /api/nps/session/[token]/start
POST /api/nps/session/[token]/answer
POST /api/nps/session/[token]/complete
POST /api/nps/events
GET  /api/admin/dashboard
GET  /api/admin/export.csv
```

## Dashboard Interno

URL local:

```text
http://localhost:3000/admin
```

O dashboard mostra:

- Convidados.
- Iniciados.
- Em andamento.
- Concluidos.
- Completion rate.
- Abandono por etapa.
- Respondentes e status.
- Progresso de respostas.
- Botao de exportacao CSV.

## Exportacao CSV

URL local:

```text
http://localhost:3000/api/admin/export.csv
```

O CSV contem:

- token;
- status;
- nome;
- e-mail;
- empresa;
- area;
- cargo;
- datas de inicio/conclusao;
- etapa atual;
- respostas de todas as perguntas.

## Microsoft Clarity

O sistema esta preparado para receber o Project ID do Clarity.

Arquivo criado:

```text
.env.local.example
```

Variavel:

```text
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

Para ativar:

1. Criar ou abrir o projeto no Microsoft Clarity.
2. Copiar o Project ID.
3. Criar `.env.local` com o Project ID.
4. Reiniciar o servidor.

Exemplo:

```text
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
```

## Observacao Tecnica

Para acelerar o MVP local, a persistencia atual usa arquivo JSON em:

```text
data/nps-db.json
```

Em producao, essa camada deve ser substituida por Supabase/PostgreSQL.

