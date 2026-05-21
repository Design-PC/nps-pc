# 02 - Blueprint De Experiência

## Objetivo De UX

Fazer a pesquisa parecer rápida, clara e segura, sem remover ou alterar perguntas. A estratégia é reduzir carga cognitiva por meio de progressão, chunking, feedback visual e retomada de sessão.

## Arquitetura Recomendada

### Etapa 0 - Landing De Convite

Propósito:

- Explicar por que a pesquisa existe.
- Informar tempo estimado.
- Gerar confiança.
- Levar ao início rapidamente.

Elementos:

- Título direto.
- Texto curto de propósito.
- Tempo estimado: 3 a 5 minutos.
- Selo textual de confidencialidade/uso responsável.
- CTA principal: "Iniciar pesquisa".

### Etapa 1 - Identificação Confirmada

Propósito:

- Confirmar dados já conhecidos via HubSpot.
- Evitar digitação desnecessária.

Campos:

- Nome
- E-mail corporativo
- Empresa
- Área
- Cargo

Recomendação:

- Pré-preencher todos os campos possíveis.
- Permitir edição apenas se necessário.
- Usar token seguro para associar resposta ao contato.

### Etapa 2 - Relacionamento E Satisfação

Perguntas preservadas:

- Qual a probabilidade de você recomendar a Prime Control para outras empresas?
- Qual foi o principal motivo para a nota atribuída?

Experiência:

- Mostrar a escala em botões grandes.
- Exibir rótulos de extremos.
- Mostrar campo aberto após a nota.
- Adicionar microcopy neutra para reduzir ansiedade textual.

### Etapa 3 - Percepção De Valor

Perguntas preservadas:

- Como você avalia a Prime Control em relação ao atendimento do seu negócio?
- Como você avalia a relevância das soluções entregues para os desafios da sua empresa?
- As soluções da Prime Control têm gerado valor percebido para o seu negócio?
- Como você avalia nosso comprometimento com resultados?
- Como você avalia nosso engajamento na solução de problemas?

Experiência:

- Exibir em grupo compacto.
- Manter escala clara e repetível.
- Permitir avanço após preenchimento das obrigatórias.

### Etapa 4 - Qualidade Operacional

Perguntas preservadas:

- Como você avalia a qualidade das entregas realizadas?
- Como você avalia cumprimento dos prazos acordados?
- Como você avalia a clareza e objetividade das apresentações de resultados?
- Como você avalia o tempo de resposta da nossa equipe?
- Como você avalia qualidade do atendimento recebido?

Experiência:

- Layout idêntico à etapa anterior para manter ritmo.
- Feedback de progresso visível.

### Etapa 5 - Inovação, Transformação E Futuro

Perguntas preservadas:

- Você percebe a Prime Control como uma empresa inovadora e alinhada às tendências do mercado?
- Como você avalia a capacidade da Prime Control antecipar tendências e propor soluções para os desafios do seu negócio?
- Em quais áreas você acredita que a Prime Control poderia investir mais inovação para fortalecer ainda mais nossa parceria?
- O que você espera de uma empresa parceira estratégica que ainda não percebe na atuação da Prime Control?
- Quais iniciativas, soluções ou melhorias podem ampliar nossa parceria ainda mais valor para o seu negócio?

Experiência:

- Indicar que é a última etapa.
- Usar campos abertos com microcopy neutra.
- Evitar blocos visuais muito longos em mobile.

### Etapa 6 - Conclusão

Propósito:

- Confirmar envio.
- Reforçar que a contribuição será usada.
- Encerrar sem pedir nova ação obrigatória.

Mensagem:

"Obrigado por compartilhar sua percepção. Sua resposta foi registrada e ajudará a Prime Control a priorizar ações de melhoria e fortalecimento da parceria."

## Padrões De Interação

### Barra De Progresso

Mostrar:

- Etapa atual.
- Percentual aproximado.
- Texto simples: "Etapa 3 de 6".

### Autosave

Salvar:

- Ao responder cada pergunta.
- Ao trocar de etapa.
- Antes de fechar a aba quando possível.

Mostrar estado:

- "Salvando..."
- "Progresso salvo"
- "Erro ao salvar, tentando novamente"

### Retomada

Ao retornar pelo link:

- Se não iniciou: abrir landing.
- Se iniciou e não concluiu: mostrar banner de retomada.
- Se concluiu: mostrar confirmação de resposta já registrada.

### Mobile

Diretrizes:

- Escalas em botões tocáveis.
- Evitar tabela horizontal.
- Uma pergunta por bloco.
- CTA fixo no final da etapa, não cobrindo conteúdo.

## Racional Psicológico

- Chunking reduz sobrecarga cognitiva.
- Progresso visível ativa efeito de aproximação da meta.
- Autosave reduz ansiedade de perda.
- Pré-preenchimento reduz fricção inicial.
- Microcopy em campos abertos reduz medo de escrever muito.
- Última etapa explícita aumenta conclusão.

