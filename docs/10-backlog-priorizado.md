# 10 - Backlog Priorizado

## Método De Priorização

Critérios:

- Impacto esperado em adesão.
- Impacto esperado em conclusão.
- Redução de risco operacional.
- Esforço técnico.
- Dependência de terceiros.

Escala:

- P0: essencial para lançar.
- P1: importante para primeira campanha.
- P2: otimização pós-lançamento.
- P3: inteligência avançada.

## P0 - Essencial Para Lançar

### Criar landing personalizada por token

Resultado esperado:

- Aumentar confiança e início da pesquisa.

Critérios de aceite:

- Link individual abre landing correta.
- Token inválido exibe estado seguro.
- Token expirado exibe mensagem adequada.

### Criar wizard multi-step

Resultado esperado:

- Reduzir percepção de esforço.

Critérios de aceite:

- Perguntas preservadas.
- Etapas separadas por tema.
- Progresso visível.
- Mobile funcional.

### Implementar autosave

Resultado esperado:

- Reduzir perda de progresso e abandono definitivo.

Critérios de aceite:

- Cada resposta é salva.
- Estado "salvo" aparece para o usuário.
- Falha de rede não perde respostas já salvas.

### Implementar retomada

Resultado esperado:

- Recuperar usuários que abandonaram.

Critérios de aceite:

- Usuário retorna ao ponto correto.
- Sessão concluída não permite nova resposta sem regra explícita.

### Persistir respostas e sessões

Resultado esperado:

- Garantir confiabilidade dos dados.

Critérios de aceite:

- Respostas numéricas e abertas salvas.
- Tempo por pergunta armazenado.
- Status da sessão atualizado.

## P1 - Importante Para Primeira Campanha

### Integração HubSpot

Resultado esperado:

- Sincronizar status de campanha com CRM.

Critérios de aceite:

- Contato recebe status de convidado, iniciado, abandonado ou concluído.
- Segmentos podem ser usados para lembretes.

### Tracking PostHog

Resultado esperado:

- Medir funil e comportamento.

Critérios de aceite:

- Eventos principais aparecem no PostHog.
- Funil pode ser filtrado por campanha, empresa, cargo e dispositivo.

### Microsoft Clarity

Resultado esperado:

- Ver gravações, heatmaps e cliques problemáticos.

Critérios de aceite:

- Sessões capturadas.
- Rage clicks e dead clicks disponíveis.
- Máscara de dados sensíveis configurada.

### Dashboard inicial

Resultado esperado:

- Acompanhar campanha diariamente.

Critérios de aceite:

- Mostra enviado, aberto, clicado, iniciado e concluído.
- Mostra abandono por etapa.

## P2 - Otimização

- Teste A/B de assunto de e-mail.
- Teste A/B de landing.
- Teste de CTA.
- Otimização mobile por heatmap.
- Lembretes comportamentais segmentados.
- Score de fricção por etapa.

## P3 - Inteligência Avançada

- Classificação automática de comentários.
- Score de risco por cliente.
- Correlação entre NPS e indicadores operacionais.
- Alertas para CS.
- Recomendação de follow-up por conta.

