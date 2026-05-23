# Integração OneDrive, SharePoint e Excel

## Objetivo

Permitir que a liderança consulte uma planilha oficial da campanha NPS 2026 no ambiente corporativo Microsoft, sem transformar o Excel no banco principal do sistema.

## Decisão recomendada

A plataforma NPS continua gravando os dados no Supabase. A planilha no SharePoint/OneDrive recebe uma cópia organizada das respostas por meio de integração com Microsoft Graph API.

Essa arquitetura evita perda de dados, preserva histórico transacional e permite que a área de Marketing/CS use o Excel como camada executiva de consulta, filtros, fórmulas e compartilhamento.

## Fluxo proposto

1. Criar ou subir no SharePoint o arquivo `Respostas NPS 2026`.
2. Manter a aba `Base automática` como destino da integração.
3. Manter a tabela técnica `TabelaRespostasNPS` dentro da aba `Base automática`.
4. A plataforma NPS grava cada resposta no Supabase.
5. Ao concluir uma resposta, a plataforma atualiza a linha correspondente no Excel via Microsoft Graph API.
6. O dashboard interno continua usando Supabase como fonte principal.
7. A equipe pode criar abas adicionais no Excel sem alterar a aba `Base automática`.
8. Heatmaps e replays continuam no Microsoft Clarity; o Excel pode receber um link manual de replay quando houver análise específica.

## Link da planilha oficial

O link da planilha SharePoint/OneDrive foi recebido no projeto, mas não deve ser registrado em arquivos versionados porque o repositório está público. O endereço real deve ser configurado apenas em variável de ambiente:

`SHAREPOINT_WORKBOOK_URL`

## Abas do modelo

- `Resumo executivo`: visão de KPIs, distribuição NPS, leitura temática e fluxo da integração.
- `Base automática`: base estruturada que será atualizada pelo sistema.
- `Configurações`: decisões de integração, origem dos dados e regras de segurança.
- `Dicionário`: explicação das colunas, origem e se podem ser editadas manualmente.

## Colunas principais

### Controle e identificação

- ID resposta
- Data de resposta
- Campanha
- Status
- Fonte
- Token / sessão
- Empresa
- Nome
- E-mail corporativo
- Cargo
- Responsável Prime Control

### Jornada e comportamento

- Início
- Conclusão
- Tempo de conclusão
- Dispositivo
- Navegador
- Perguntas respondidas
- Campos abertos preenchidos
- Etapa abandonada
- Sinal de risco
- Link replay Clarity opcional

### NPS oficial

- Nota NPS, de 1 a 10
- Classificação NPS
- Motivo da nota

Classificação:

- Promotores: notas 9 e 10.
- Neutros: notas 7 e 8.
- Detratores: notas 1 a 6.

Fórmula: `% promotores - % detratores`.

### Blocos temáticos

Os quatro blocos da pesquisa aparecem na leitura executiva com peso visual de 25% cada:

- Relacionamento e Satisfação.
- Percepção de Valor.
- Qualidade Operacional.
- Inovação, Transformação e Futuro.

Esse peso de 25% organiza a leitura temática, mas não altera o cálculo oficial do NPS.

### Follow-up interno

- Status de follow-up
- Próxima ação
- Responsável follow-up
- Data follow-up
- Observações internas

## Segurança e governança

- Não usar login ou senha pessoal na integração.
- Usar um app autorizado no Microsoft Entra ID.
- Variáveis esperadas: `MICROSOFT_TENANT_ID`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` e identificação do arquivo no SharePoint.
- Variável da planilha: `SHAREPOINT_WORKBOOK_URL`.
- Nome da tabela Excel: `SHAREPOINT_TABLE_NAME=TabelaRespostasNPS`.
- A aba `Base automática` deve ser tratada como área de sistema.
- Alterações manuais devem acontecer em outras abas ou nos campos internos previstos para follow-up.

## Permissões Microsoft Graph

A integração deve usar um app autorizado no Microsoft Entra ID com permissão para ler e escrever o arquivo no SharePoint/OneDrive. A implementação preparada resolve o arquivo a partir do link compartilhado e usa a rota de tabela do Excel para adicionar linhas na tabela `TabelaRespostasNPS`.

Endpoint interno de validação:

`/api/admin/sharepoint/status`

Esse endpoint deve ser acessado apenas pelo admin e serve para confirmar se as variáveis foram configuradas e se o arquivo foi resolvido com sucesso via Microsoft Graph.

## Arquivo modelo

Modelo gerado em:

`deliverables/Prime_Control_Respostas_NPS_2026_Modelo_SharePoint.xlsx`
