# 18 - GitHub E Deploy Na Vercel

## Repositorio GitHub

Repositorio informado:

```text
https://github.com/Design-PC/nps-prime-control
```

## Variaveis De Ambiente

Para ambiente local e Vercel:

```text
NEXT_PUBLIC_CLARITY_PROJECT_ID=
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

### NEXT_PUBLIC_CLARITY_PROJECT_ID

Project ID do Microsoft Clarity. Ativa o script de tracking no site.

### ADMIN_USERNAME e ADMIN_PASSWORD

Protegem:

- `/admin`
- `/api/admin/dashboard`
- `/api/admin/export.csv`

Essas rotas contem dados identificados e nao devem ficar publicas.

## Observacao Importante Sobre Vercel

A persistencia atual do MVP usa arquivo local:

```text
data/nps-db.json
```

Isso funciona para desenvolvimento local, mas nao deve ser usado como banco de producao na Vercel, porque ambientes serverless nao garantem escrita persistente em disco.

Antes de usar a pesquisa com clientes reais no subdominio:

```text
nps.primecontrol.com.br
```

precisamos migrar a persistencia para:

- Supabase/PostgreSQL; ou
- outro banco gerenciado aprovado pela Prime Control.

## Uso Recomendado Da Vercel

### Preview inicial

Pode ser usado para validar:

- interface;
- responsividade;
- fluxo da pesquisa;
- visual do dashboard;
- instalacao do Clarity;
- protecao do admin.

### Nao usar ainda para campanha real

Nao usar para campanha real ate que exista:

- banco persistente;
- importacao de respondentes;
- tokens reais;
- protecao de admin configurada;
- politica de dados validada;
- Clarity com mascaramento conferido.

## Checklist Antes Do Deploy

- Configurar variaveis de ambiente na Vercel.
- Definir `ADMIN_USERNAME` e `ADMIN_PASSWORD` fortes.
- Adicionar `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
- Conectar dominio/subdominio.
- Validar `/admin` protegido.
- Validar exportacao CSV.
- Validar Clarity recebendo sessoes.

