# Cadastro GELM V3 — editor estilo Canva

Esta versão muda a estratégia de preenchimento.

Em vez de tentar adivinhar uma coordenada fixa para cada campo, os PDFs originais continuam como fundo e cada dado é um **elemento independente**, como em um editor de design:

- cada campo aparece na prévia;
- "Ajustar campos" permite arrastar qualquer campo;
- a posição fica salva no navegador;
- a mesma posição é usada ao gerar o PDF;
- os PDFs originais continuam sendo usados como modelos;
- o cadastro de jovem/adulto permanece separado do gerador de certificados.

Isso permite calibrar o formulário visualmente uma vez e depois usar a mesma configuração.

## Como usar

1. Abra `index.html`.
2. Preencha os dados.
3. Veja a prévia.
4. Clique em **🎨 Ajustar campos**.
5. Arraste os campos para o local exato do formulário.
6. Clique em **💾 Salvar**.
7. Vá para "Gerar" e gere os PDFs.

Os dados ficam apenas no `localStorage` do navegador nesta versão.
