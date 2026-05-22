# Versão clássica one-page

## Objetivo

Criar uma alternativa de pesquisa em página única, inspirada no formato direto de planilhas corporativas e pesquisas como GPTW, para comparação com o fluxo multi-step.

## Decisão de experiência

- A rota pública de teste é `/survey-classic`.
- Todas as perguntas aparecem em uma única página.
- As perguntas de escala usam quadradinhos ao lado da pergunta, na ordem visual `10 9 8 7 6 5 4 3 2 1`, conforme a referência enviada.
- Os campos abertos aparecem como `(Campo aberto)`, com área de resposta no mesmo bloco visual.
- A identificação fica no topo, em formato compacto, com placeholders para evitar esforço de apagar textos preenchidos.
- A versão principal em etapas continua preservada para comparação.

## Validação

- Nome, e-mail corporativo, empresa, área e cargo são obrigatórios.
- E-mails pessoais são bloqueados para manter a qualidade dos dados B2B.
- Todas as perguntas de escala são obrigatórias.
- Campos abertos permanecem opcionais, preservando menor esforço percebido.

## Analytics e dados

- A versão registra visualização e conclusão com `variant: classic_one_page`.
- As respostas são enviadas para o mesmo backend da plataforma.
- O token de sessão público é gerado automaticamente para evitar bloqueio por resposta anterior salva no navegador.

## Uso recomendado

Usar esta versão como teste comparativo com o fluxo multi-step. A decisão final deve considerar taxa de início, taxa de conclusão, tempo médio, abandono e qualidade das respostas abertas.
