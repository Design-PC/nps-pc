# Skill de Auditoria UX - Plataforma NPS Prime Control

Este documento registra a criacao da skill local `prime-nps-ux-auditor`, usada para avaliar interfaces da Plataforma NPS Corporativa da Prime Control.

## Objetivo

Padronizar avaliacoes de UX, experiencia do usuario, CRO, acessibilidade, neutralidade metodologica e analytics comportamental antes de enviar a pesquisa para clientes.

## Quando usar

Usar sempre que houver uma nova versao de:

- landing da pesquisa;
- fluxo multi-step da pesquisa;
- tela de conclusao;
- dashboard interno;
- e-mail convite;
- e-mail lembrete;
- jornada completa do respondente.

## Criterios avaliados

- clareza da proposta;
- esforco percebido;
- risco de abandono;
- excesso cognitivo;
- confianca e tom executivo;
- visibilidade de progresso;
- neutralidade da escala NPS;
- acessibilidade e responsividade;
- separacao entre experiencia externa e interna;
- eventos necessarios para analise no Clarity, PostHog ou dashboard interno.

## Severidade

- P0: bloqueia resposta, coleta ou acesso.
- P1: aumenta abandono ou reduz confiabilidade do dado.
- P2: reduz clareza, confianca ou qualidade percebida.
- P3: melhoria incremental ou acabamento.

## Prompt recomendado

Solicitar:

> Use a skill `prime-nps-ux-auditor` para avaliar esta interface da pesquisa NPS da Prime Control. Entregue veredito, riscos, recomendacoes priorizadas e checklist de aceite.

## Primeira leitura da interface atual

Pontos positivos:

- a tela publica nao exibe termos tecnicos internos;
- o tempo estimado esta visivel;
- a proposta esta clara e em tom profissional;
- a marca esta presente sem pesar a interface;
- o fluxo multi-step reduz a sensacao de formulario longo.

Pontos de atencao:

- deixar explicito, de forma objetiva, que as respostas sao identificadas, ja que a pesquisa nao e anonima;
- revisar a contagem "5 de 22 respostas" na etapa de identificacao, pois os campos pre-preenchidos podem inflar a percepcao de progresso;
- avaliar se os campos de identificacao devem ser editaveis ou apenas confirmaveis quando o contato ja vier do CRM;
- garantir que o botao de continuidade fique sempre visivel ou facil de acessar em telas menores;
- para a campanha 2026, manter NPS de 0 a 10 e satisfacao de 1 a 5, pois estas escalas foram definidas oficialmente.
