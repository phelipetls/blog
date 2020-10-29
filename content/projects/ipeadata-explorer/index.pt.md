---
title: "Ipeadata Explorer"
date: 2020-09-02
softwares: ["react", "javascript"]
website: "http://ipeadata-explorer.surge.sh"
github: "https://github.com/phelipetls/ipeadata-explorer"
---

Um frontend escrito em [React](https://reactjs.org/docs/getting-started.html)
para a base de dados [Ipeadata](http://ipeadata.gov.br/api/) do IPEA, que
contém várias séries temporais de temas e fontes diversos.

<!--more-->

O site tem como objetivo ajudar pesquisadores, estudantes e a quem mais
interesse, a descobrir e visualizar as séries disponíveis.

Tive como inspiração a versão 3 (beta) do [site oficial do
Ipeadata](http://ipeadata.gov.br/beta3/).

Tecnologias utilizadas:

- [React](https://reactjs.org/).
- [Material-UI](https://material-ui.com/).
- OData (Open Data Protocol) para interagir com o backend do Ipeadata (queries
  para [filtrar](odata-url-conventions) e [agregar](odata-aggregation) os dados
  etc.).
- [Chart.js](https://chartjs.org/) para visualizações de dados simples.
- [chartjs-chart-geo](https://github.com/sgratzl/chartjs-chart-geo), plugin do
  Chart.js para plotar dados distribuídos geograficamente, como um mapa
  choropleth, utilizado topoJSON, por exemplo.
- APIs de [malhas](https://servicodados.ibge.gov.br/api/docs/malhas?versao=2) e
  de
  [localidades](https://servicodados.ibge.gov.br/api/docs/localidades?versao=1)
  para obter o TopoJSON de regiões geográficas do Brasil e listas de todas as
  regiões, respectivamente.
