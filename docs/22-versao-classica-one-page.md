# Versão clássica one-page

## Objetivo

Criar uma alternativa de pesquisa em página única, inspirada no formato direto de planilhas corporativas e pesquisas como GPTW, para comparação com o fluxo multi-step.

## Decisão de experiência

- A rota pública oficial é `/`.
- A rota `/survey` permanece como caminho direto alternativo para a mesma experiência.
- A rota `/survey-classic` permanece como alias da mesma experiência.
- A landing anterior foi preservada como backup em `/landing-backup`.
- O fluxo multi-step anterior foi preservado como backup em `/survey-backup`.
- Todas as perguntas aparecem em uma única página.
- As perguntas são numeradas de forma discreta para facilitar orientação e referência interna.
- As perguntas de escala usam quadradinhos ao lado da pergunta, na ordem visual `10 9 8 7 6 5 4 3 2 1`, conforme a referência enviada.
- Os campos abertos aparecem como áreas de resposta diretas, sem rótulos internos operacionais.
- A identificação fica no topo, em formato compacto, com placeholders para evitar esforço de apagar textos preenchidos.
- A versão em página única passa a ser a experiência principal da campanha.
- A hierarquia visual foi suavizada: perguntas com peso médio, bordas mais leves, seções mais claras e botões de nota com área de clique maior.

## Validação

- Nome, e-mail corporativo, empresa e cargo são obrigatórios.
- E-mails pessoais são bloqueados para manter a qualidade dos dados B2B.
- O campo de e-mail exibe feedback visual quando o endereço informado é inválido ou pessoal.
- Todas as perguntas de escala são obrigatórias.
- Campos abertos permanecem opcionais, preservando menor esforço percebido.

## Analytics e dados

- A versão registra visualização e conclusão com `variant: classic_one_page`.
- As respostas são enviadas para o mesmo backend da plataforma.
- O token de sessão público é gerado automaticamente para evitar bloqueio por resposta anterior salva no navegador.
- O dashboard interno oferece exportação em CSV, Excel visual em tons de cinza e PDF executivo resumido.

## Uso recomendado

Usar esta versão como teste comparativo com o fluxo multi-step. A decisão final deve considerar taxa de início, taxa de conclusão, tempo médio, abandono e qualidade das respostas abertas.
