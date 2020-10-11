---
title: "Ipeadata Explorer"
date: 2020-09-02
softwares: ["react", "javascript"]
website: "http://ipeadata-explorer.surge.sh"
github: "https://github.com/phelipetls/ipeadata-explorer"
---

Este é um frontend escrito em [React](https://reactjs.org/docs/getting-started.html) para a base de dados
[Ipeadata](http://ipeadata.gov.br/api/) do IPEA, que contém várias séries temporais de temas
diversos.

Com ele você consegue pesquisar a base de dados com base em vários filtros e
também visualizar os dados.

It handles searching the database with several filters and also visualizing
the data.

Séries temporais sem valores por regiões geográficas serão mostradas com um
gráfico de linha. De outro modo, um mapa choropleth é usado se a região for a
Unidade da Federação, microrregião, (macror)região ou município. Um gráfico de
barras é usado para dados categóricos.

O mapa pode ser filtrado também, por exemplo, se o usuário quiser visualizar os
valores por município para o estado do Rio de Janeiro.

Essas visualizações foram feitas possíveis graças aos projetos
[Chart.js](https://www.chartjs.org/docs/latest/) e um [plugin para
maps](https://github.com/sgratzl/chartjs-chart-geo-chart-geo) e à [API do
IBGE](https://servicodados.ibge.gov.br/api/docs/malhas?versao=2) que provê
TopoJSON para as regiões geográficas do Brasil.
