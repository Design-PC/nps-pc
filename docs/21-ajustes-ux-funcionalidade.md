# Ajustes de UX e funcionalidade - Maio 2026

Este registro documenta os ajustes realizados apos a avaliacao da interface publica da pesquisa NPS.

## Decisoes de UX

- Manter a paleta Prime Control e o tom executivo clean.
- Remover o bloco lateral "3-5 minutos" da tela inicial, pois a informacao ja aparece no topo.
- Preservar a tela inicial direta, leve e sem sensacao de pagina pesada.
- Exibir apenas o tempo estimado no topo.
- Posicionar o prazo de validade como nota discreta separada: "Disponivel ate 01/jun/26".
- Manter os tres blocos claros: Rapida, Responsavel e Retomavel.
- Reforcar que a resposta e identificada, sem criar medo ou excesso de formalidade.
- Manter a promessa de etapas curtas e progresso salvo.
- Evitar scroll na landing em desktop quando o viewport comportar a dobra principal.

## Funcionalidade e estados controlados

- A raiz do site (`/`) passou a ser a tela inicial real da pesquisa.
- O usuario final nao deve visualizar termos tecnicos como token ou link individual.
- A identificacao do respondente deve acontecer por controle interno da plataforma.
- Campos de identificacao devem usar placeholders, sem valores ficticios preenchidos.
- Quando o link nao e localizado, o usuario ve uma mensagem humana e controlada.
- Foi criada uma tela global de erro com acao de recarregar.
- Foi criada uma tela global de pagina nao encontrada com orientacao clara.

## Racional

Clientes B2B precisam sentir que a pesquisa foi preparada com cuidado e que sua resposta sera tratada com responsabilidade. A experiencia nao deve parecer um formulario generico aberto ao publico, nem uma tela tecnica. Por isso, a plataforma agora diferencia:

- acesso pela tela publica da campanha;
- pesquisa em andamento;
- pesquisa nao localizada;
- erro temporario;
- conclusao da pesquisa.

## Impacto esperado

- Maior confianca na experiencia publica da campanha.
- Menor risco de confusao em URLs quebradas ou acessos incompletos.
- Menor percepcao de peso na tela inicial.
- Melhor experiencia para clientes executivos ocupados.
- Melhor governanca para envio via HubSpot, mantendo o controle tecnico invisivel para o cliente.

## Ponto de atencao para producao

Antes do disparo oficial, a base de contatos selecionada com o time operacional precisa ser importada no banco com controle interno de identificacao. Cada contato deve responder uma vez, mas o cliente nao precisa ver ou entender esse controle.
