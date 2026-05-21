# 16 - Decisoes De Arquitetura E Proximos Passos

## Decisoes Confirmadas

- Escala visual da pesquisa: 1 a 10.
- Respostas: identificadas, nao anonimas.
- Regra de resposta: um contato responde uma unica vez.
- Selecao de respondentes: time operacional indicara o responsavel de cada cliente.
- Publicacao: subdominio `nps.primecontrol.com.br`.
- Exportacao: gerar planilha CSV/XLSX com respostas e status da jornada.
- Dashboard: criar do zero, inicialmente dentro do proprio sistema.
- Analytics visual: integrar Microsoft Clarity.

## O Que E Token

Token e um codigo unico e seguro colocado no link da pesquisa para identificar o respondente sem exigir login.

Exemplo:

```text
https://nps.primecontrol.com.br/nps/abc123seguro
```

Esse token permite:

- identificar qual contato recebeu o link;
- pre-preencher dados do cliente;
- impedir mais de uma resposta do mesmo contato;
- salvar progresso;
- retomar de onde parou;
- atualizar o status no HubSpot;
- evitar que o usuario precise criar senha.

O token nao deve ser sequencial nem previsivel. No banco, deve ser salvo como hash.

## Dashboard Recomendado Para MVP

Criar primeiro um dashboard interno simples dentro do sistema, antes de Power BI ou Metabase.

Motivo:

- reduz dependencia inicial;
- acelera validacao;
- mostra os dados da campanha no mesmo produto;
- permite evoluir com base no uso real.

Primeiras telas:

1. Visao geral da campanha.
2. Funil de conversao.
3. Abandono por etapa.
4. Respostas e NPS.
5. Clientes pendentes, iniciados, abandonados e concluidos.
6. Exportacao CSV/XLSX.

## APIs Do Sistema

APIs sao as rotas internas que conectam a interface ao banco de dados.

APIs prioritarias:

```text
GET  /api/nps/session/[token]
POST /api/nps/session/[token]/start
POST /api/nps/session/[token]/answer
POST /api/nps/session/[token]/complete
POST /api/nps/events
GET  /api/admin/dashboard
GET  /api/admin/export.csv
```

## Clarity

Para instalar o Clarity, a Prime Control deve criar um projeto no Microsoft Clarity para o subdominio:

```text
nps.primecontrol.com.br
```

Depois, basta enviar o Project ID ou o script de instalacao gerado pelo Clarity.

No sistema, vamos:

- instalar o script no Next.js;
- mascarar campos sensiveis;
- testar se as sessoes aparecem;
- validar heatmaps e replays;
- documentar a configuracao final.

