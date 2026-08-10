# Sistema de Cadastro GELM 156/SC

Este protótipo usa como modelos os três PDFs fornecidos pelo Grupo Escoteiro Lobos da Montanha:
1. Ficha de registro individual;
2. Ficha médica (2 páginas);
3. Autorização de uso de imagem, voz e dados de criança e adolescente (2 páginas).

O navegador preenche os campos sobre os PDFs originais e gera:
- três PDFs separados;
- um PDF único com as 5 páginas.

## Fluxo
Registro -> Ficha médica -> Autorização de imagem.

Os dados básicos são reaproveitados automaticamente na etapa seguinte.

## Importante sobre adultos
A ficha de registro enviada é identificada como "ASSOCIADO BENEFICIÁRIO" e a autorização de imagem enviada é expressamente para "CRIANÇA E ADOLESCENTE". Portanto, o sistema aceita o perfil adulto para coleta dos dados, mas a autorização de imagem não deve ser tratada como instrumento adequado para adulto sem um modelo específico do grupo.

## Privacidade
O protótipo não envia os dados do formulário para um servidor. Os PDFs são gerados localmente no navegador. Como a ficha médica contém dados sensíveis, não há armazenamento automático em localStorage.

## Ajuste fino
As coordenadas dos textos estão em `app.js`. Como os PDFs originais são mantidos como fundo, basta ajustar as coordenadas para deixar cada campo exatamente sobre a linha correspondente.

## Publicação
Pode ser publicado no GitHub Pages. Para uso offline real, recomenda-se futuramente incluir uma cópia local do PDF-Lib e ampliar o service worker para armazenar os modelos.
