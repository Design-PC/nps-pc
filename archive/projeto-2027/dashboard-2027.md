# Dashboard executivo

## Objetivo

Manter o dashboard interno como uma central de decisão da campanha NPS, com leitura rápida, pouca carga textual e foco nos próximos movimentos: aumentar adesão, reduzir abandono, acompanhar risco e exportar dados.

## Ajustes implementados

- Topo simplificado com ações essenciais: Ver pesquisa, Planilha, CSV, PDF e Sair.
- Hero reduzido para uma mensagem objetiva: status da campanha e respostas concluídas.
- KPIs priorizados: adesão, conclusão, NPS, atrito, clientes silenciosos e tempo médio.
- Bloco de jornada renomeado para deixar clara a pergunta central: onde perdemos resposta.
- Fonte dos dados resumida: plataforma NPS para eventos estruturados; Microsoft Clarity para heatmaps e replays.
- Bloco de próximos movimentos enxuto, sem textos longos.
- Distribuição NPS reorganizada com percentuais automáticos por grupo: promotores 9-10, neutros 7-8 e detratores 1-6.
- Fórmula do NPS exibida no painel: percentual de promotores menos percentual de detratores.
- Leitura temática exibida em 4 blocos com peso visual de 25% cada, sem alterar o cálculo oficial do NPS.
- Tabela de respondentes mantida como detalhe operacional.
- Exportação PDF corrigida para gerar arquivo PDF válido e compatível com leitores comuns.

## Arquitetura da informação

1. Ações globais no topo.
2. Saúde da campanha em destaque.
3. KPIs executivos.
4. Jornada e abandono.
5. Próximas ações.
6. Leituras analíticas.
7. Base detalhada.

## Origem dos dados

O dashboard usa dados registrados pela própria plataforma: contatos, sessões, respostas, status, tempo de atividade, progresso e eventos internos. O Microsoft Clarity não é consumido automaticamente pelo dashboard nesta versão; ele deve ser acessado separadamente para análise visual de mapa de calor, gravações de sessão, cliques mortos e cliques de raiva.

## Cálculo NPS

O NPS oficial usa somente a pergunta de recomendação. A escala da pesquisa é de 1 a 10:

- Promotores: notas 9 e 10.
- Neutros: notas 7 e 8.
- Detratores: notas 1 a 6.

Fórmula: `% promotores - % detratores`.

Os neutros entram na base total de respostas, mas não somam nem subtraem diretamente. A leitura de 25% por bloco é uma organização executiva dos quatro temas da pesquisa, não uma alteração do cálculo metodológico do NPS.

## Critérios de aceite

- `/admin` deve abrir após login administrativo.
- Exportações CSV, Excel e PDF devem funcionar.
- O PDF deve baixar com `Content-Type: application/pdf` e abrir como relatório.
- A primeira dobra deve comunicar status, KPIs e ações sem excesso de texto.
- A tela deve continuar responsiva para notebook, tablet e mobile.
