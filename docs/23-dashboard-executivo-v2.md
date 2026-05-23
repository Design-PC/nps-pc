# Dashboard executivo v2

## Objetivo

Reestruturar o dashboard interno para funcionar como uma central executiva da campanha, priorizando leitura rápida, contas que exigem ação e exportações para análise.

## Mudanças implementadas

- Novo topo com status da campanha e ações principais: Pesquisa, CSV, Excel, PDF e Sair.
- Barra de ações renomeada para linguagem mais clara: Visualizar pesquisa NPS, Baixar planilha, CSV, PDF e Sair com ícone.
- Nota de origem dos dados no bloco de jornada: sessões, respostas e eventos da plataforma. Mapas de calor e replays ficam no Microsoft Clarity como análise complementar.
- Indicação de que a planilha exportada é gerada em tempo real a partir da base atual, sem alterar análises feitas fora do sistema.
- KPIs principais em destaque: participação, conclusão, NPS parcial, fricção, silenciosos e tempo médio.
- Bloco de jornada com funil e abandono em formato mais claro.
- Bloco de prioridades com contas de risco, clientes silenciosos e base concluída.
- Distribuição NPS e médias por tema reorganizadas em uma segunda faixa analítica.
- Tabela de respondentes mantida como detalhe operacional.

## Racional

O dashboard anterior estava funcional, mas exigia interpretação técnica. A nova versão aproxima a tela de uma visão de gestão: o primeiro olhar mostra saúde da campanha, riscos e ações sugeridas; as tabelas ficam como suporte para investigação.

## Critérios de aceite

- A tela deve abrir em `/admin` após login.
- Os botões de exportação devem continuar funcionando.
- Os indicadores devem ser compreensíveis sem conhecimento técnico.
- A interface deve ser responsiva para notebook, tablet e mobile.
