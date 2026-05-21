# 12 - Plano De Acao Para Criacao Do Sistema

## Objetivo

Criar uma plataforma propria de Pesquisa NPS Corporativa para clientes ativos da Prime Control, com experiencia multi-step, alta adesao, autosave, retomada, integracao com HubSpot e analytics comportamental completo.

## Resultado Esperado

Ao final da implementacao, a Prime Control deve conseguir:

- Enviar convites personalizados via HubSpot.
- Identificar abertura, clique, inicio, abandono, retomada e conclusao.
- Oferecer uma experiencia premium e responsiva para o respondente.
- Preservar integralmente as perguntas aprovadas.
- Visualizar funil, drop-off e friccoes por etapa.
- Acionar CS com base em clientes silenciosos, abandono ou risco.
- Gerar relatorios executivos e historico por campanha.

## Fase 0 - Alinhamento E Preparacao

Duracao estimada:

- 2 a 4 dias uteis.

Objetivo:

- Reduzir ambiguidades antes do desenvolvimento.

Atividades:

- Confirmar lista final de perguntas e obrigatoriedade.
- Confirmar se escala sera exibida visualmente de 1 a 10 ou 10 a 1.
- Definir se as respostas serao identificadas, anonimizadas ou parcialmente anonimizadas.
- Confirmar janela da campanha.
- Confirmar usuarios internos que acessarao dashboard.
- Validar campos disponiveis no HubSpot.
- Definir stack final: Supabase ou PostgreSQL gerenciado, Power BI ou Metabase.

Entregaveis:

- Documento de decisoes do projeto.
- Lista final de perguntas congelada.
- Mapa de campos HubSpot.
- Criterios de sucesso da primeira campanha.

Decisoes criticas:

- A pesquisa sera nominal ou anonima?
- Quem pode ver resposta individual?
- Qual e o tempo de expiracao do token?
- Sera permitido responder mais de uma vez?

## Fase 1 - Fundacao Tecnica

Duracao estimada:

- 4 a 7 dias uteis.

Objetivo:

- Criar a base tecnica segura e escalavel.

Atividades:

- Criar projeto Next.js com TypeScript.
- Configurar Tailwind e Shadcn UI.
- Definir estrutura de rotas.
- Configurar banco de dados.
- Criar migrations iniciais.
- Criar camada de acesso a dados.
- Criar validacao de ambiente.
- Configurar deploy inicial.

Entregaveis:

- Aplicacao base funcionando.
- Banco configurado.
- Ambientes de desenvolvimento e producao definidos.
- Deploy tecnico inicial.

Rotas iniciais:

```text
/nps/[token]
/nps/[token]/survey
/nps/[token]/complete
/api/nps/session/[token]
/api/nps/events
```

Criterios de pronto:

- Aplicacao abre em ambiente de teste.
- Banco recebe conexao.
- Variaveis sensiveis nao ficam expostas no frontend.
- Token invalido retorna estado seguro.

## Fase 2 - Modelo De Dados E Tokens

Duracao estimada:

- 3 a 5 dias uteis.

Objetivo:

- Criar estrutura de campanhas, destinatarios, sessoes, perguntas, respostas e eventos.

Atividades:

- Implementar tabelas principais.
- Criar geracao de token unico por destinatario.
- Salvar hash do token.
- Definir expiracao.
- Criar seed da campanha.
- Criar seed das perguntas aprovadas.
- Criar importacao inicial de destinatarios do HubSpot ou CSV exportado.

Entregaveis:

- Modelo de dados implementado.
- Campanha NPS cadastrada.
- Perguntas cadastradas sem alteracao de texto.
- Destinatarios com tokens gerados.

Criterios de pronto:

- Cada destinatario tem token unico.
- Token puro nao e armazenado no banco.
- Perguntas aparecem na ordem aprovada.
- Campanha pode ser ativada ou desativada.

## Fase 3 - Experiencia Do Respondente

Duracao estimada:

- 7 a 12 dias uteis.

Objetivo:

- Construir a experiencia principal da pesquisa.

Atividades:

- Criar landing personalizada.
- Criar tela de identificacao confirmada.
- Criar wizard multi-step.
- Criar componente de escala.
- Criar componente de campo aberto.
- Criar barra de progresso.
- Criar estados de salvamento.
- Criar tela de conclusao.
- Garantir responsividade mobile.
- Implementar validacao de campos obrigatorios.

Entregaveis:

- Fluxo completo navegavel.
- Experiencia responsiva.
- Perguntas preservadas.
- Estados de erro, loading, expirado e concluido.

Criterios de pronto:

- Respondente consegue concluir em desktop.
- Respondente consegue concluir em mobile.
- Nenhuma pergunta foi alterada.
- Progresso visual aparece em todas as etapas.
- Textos auxiliares nao influenciam nota.

## Fase 4 - Autosave E Retomada

Duracao estimada:

- 4 a 6 dias uteis.

Objetivo:

- Reduzir abandono definitivo e perda de progresso.

Atividades:

- Salvar cada resposta automaticamente.
- Salvar etapa atual.
- Salvar tempo por pergunta.
- Detectar ultima atividade.
- Retomar usuario no ponto correto.
- Tratar usuario que ja concluiu.
- Tratar falhas de conexao.

Entregaveis:

- Autosave funcional.
- Retomada funcional.
- Registro de progresso por sessao.

Criterios de pronto:

- Fechar e reabrir link mantem progresso.
- Resposta salva nao e perdida.
- Usuario concluido nao sobrescreve resposta anterior sem regra definida.
- Falha temporaria de rede exibe estado claro.

## Fase 5 - Analytics E Instrumentacao

Duracao estimada:

- 5 a 8 dias uteis.

Objetivo:

- Tornar toda a jornada mensuravel.

Atividades:

- Instalar PostHog.
- Instalar Microsoft Clarity.
- Instalar GA4.
- Implementar eventos frontend.
- Implementar eventos server-side.
- Mascarar dados sensiveis nas ferramentas de replay.
- Criar funis iniciais.
- Validar eventos em ambiente de teste.

Entregaveis:

- Taxonomia implementada.
- Funil de eventos funcionando.
- Session replay ativo.
- Heatmaps habilitados.

Eventos obrigatorios:

```text
nps_landing_viewed
nps_survey_started
nps_identification_confirmed
nps_step_viewed
nps_question_viewed
nps_question_answered
nps_step_completed
nps_survey_autosaved
nps_survey_abandoned
nps_survey_resumed
nps_survey_completed
```

Criterios de pronto:

- Eventos aparecem com campaign_id e recipient_id.
- Funil mostra queda por etapa.
- Clarity nao captura dados sensiveis indevidos.
- Tempo por pergunta e etapa esta disponivel.

## Fase 6 - Integracao HubSpot

Duracao estimada:

- 4 a 7 dias uteis.

Objetivo:

- Conectar campanha, envio e status de resposta ao CRM.

Atividades:

- Criar propriedades customizadas no HubSpot.
- Definir listas de clientes ativos.
- Gerar links personalizados.
- Atualizar status conforme comportamento.
- Criar segmentos de lembrete.
- Validar UTM e origem.

Entregaveis:

- HubSpot sincronizado.
- Contatos com status da campanha.
- Segmentos prontos para lembretes.

Propriedades sugeridas:

```text
nps_2026_status
nps_2026_invited_at
nps_2026_opened_at
nps_2026_clicked_at
nps_2026_started_at
nps_2026_completed_at
nps_2026_abandoned_step
nps_2026_score
```

Criterios de pronto:

- Clique no e-mail abre link individual.
- HubSpot identifica quem abriu, clicou, iniciou, abandonou e concluiu.
- Lembretes podem ser filtrados por comportamento.

## Fase 7 - Dashboard Executivo

Duracao estimada:

- 5 a 8 dias uteis.

Objetivo:

- Dar visibilidade executiva e operacional durante a campanha.

Atividades:

- Criar visao de funil.
- Criar visao de abandono por etapa.
- Criar visao de clientes silenciosos.
- Criar visao de NPS e blocos tematicos.
- Criar visao de respostas abertas.
- Criar score inicial de friccao.

Entregaveis:

- Dashboard da campanha.
- Dashboard de clientes silenciosos.
- Dashboard de qualidade de resposta.
- Dashboard de NPS e risco.

Criterios de pronto:

- Lideranca consegue acompanhar status geral.
- CS consegue identificar contas que exigem follow-up.
- Produto consegue identificar friccoes de UX.
- Dados podem ser filtrados por campanha, empresa, cargo, segmento e dispositivo.

## Fase 8 - QA, Piloto E Ajustes

Duracao estimada:

- 5 a 10 dias uteis.

Objetivo:

- Validar experiencia, dados e operacao antes do disparo oficial.

Atividades:

- Testar desktop e mobile.
- Testar tokens validos, expirados e concluidos.
- Testar autosave.
- Testar retomada.
- Testar eventos.
- Testar dashboards.
- Rodar piloto interno.
- Rodar piloto com pequena amostra de clientes, se possivel.

Entregaveis:

- Checklist de QA aprovado.
- Relatorio de piloto.
- Ajustes finais priorizados.

Criterios de pronto:

- Sem bugs bloqueantes.
- Tracking validado.
- Mobile aprovado.
- Dashboard confiavel.
- Time de CS treinado para leitura e follow-up.

## Fase 9 - Lancamento Da Campanha

Duracao estimada:

- Janela de 7 a 14 dias corridos.

Objetivo:

- Executar campanha com acompanhamento diario.

Atividades:

- Disparar e-mail inicial.
- Monitorar funil diariamente.
- Acionar lembretes por comportamento.
- Revisar session replays criticos.
- Acionar CS para contas estrategicas silenciosas.
- Monitorar erros tecnicos.

Entregaveis:

- Campanha em producao.
- Relatorios diarios.
- Lista de acoes de CS.

Ritual diario:

- 15 minutos.
- Produto, CS, CRM e Dados.
- Revisao de funil, abandono, contas estrategicas e bloqueios.

## Fase 10 - Pos-Campanha E Evolucao

Duracao estimada:

- 5 a 10 dias uteis apos encerramento.

Objetivo:

- Transformar respostas e comportamento em plano de acao.

Atividades:

- Consolidar NPS.
- Analisar temas qualitativos.
- Analisar abandono e friccao.
- Identificar clientes silenciosos.
- Identificar clientes de risco.
- Gerar recomendacoes de melhoria.
- Atualizar backlog para proxima campanha.

Entregaveis:

- Relatorio executivo.
- Relatorio de comportamento.
- Plano de follow-up por cliente.
- Backlog de otimizacoes.

## Sequencia Recomendada De Execucao

1. Congelar perguntas e regras metodologicas.
2. Validar campos e listas no HubSpot.
3. Construir fundacao tecnica.
4. Implementar banco, campanha e tokens.
5. Construir experiencia multi-step.
6. Implementar autosave e retomada.
7. Instrumentar analytics.
8. Integrar HubSpot.
9. Criar dashboard.
10. Rodar QA e piloto.
11. Lançar campanha.
12. Analisar resultados e otimizar.

## Riscos E Mitigacoes

| Risco | Impacto | Mitigacao |
|---|---|---|
| Perguntas alteradas acidentalmente | Compromete metodologia | Congelar perguntas em tabela versionada |
| Tracking incompleto | Perde inteligencia de jornada | QA especifico de eventos antes do lancamento |
| HubSpot com dados incompletos | Preenchimento falho | Validar base antes da geracao de tokens |
| Mobile ruim | Baixa adesao | QA mobile obrigatorio e Clarity segmentado |
| Dashboard inconsistente | Perda de confianca | Validacao com eventos brutos |
| Replay capturando dado sensivel | Risco LGPD | Mascaramento e revisao de privacidade |

## Indicadores De Sucesso Do Sistema

### Conversao

- Open rate.
- Click rate.
- Start rate.
- Completion rate.
- Abandonment rate.

### Experiencia

- Tempo medio de conclusao.
- Tempo por etapa.
- Drop-off por etapa.
- Rage clicks.
- Dead clicks.
- Retomadas bem-sucedidas.

### Qualidade

- Percentual de campos abertos preenchidos.
- Tamanho medio de comentario.
- Respostas acionaveis.
- Segmentos representados.

### Negocio

- Contas estrategicas respondentes.
- Clientes silenciosos identificados.
- Clientes de risco identificados.
- Acoes de CS geradas.

