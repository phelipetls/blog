---
title: "Ipeadata Explorer"
date: 2020-09-02
softwares: ["javascript", "react", "material-ui"]
website: "http://ipeadata-explorer.surge.sh"
github: "https://github.com/phelipetls/ipeadata-explorer"
---

This is a frontend written in
[React](https://reactjs.org/docs/getting-started.html) for
[Ipeadata](http://ipeadata.gov.br/api/), a database from IPEA, which has several
time series from various sources and themes.

<!--more-->

It aims to help researches and students to discover and visualize the database.

It is inspired by IPEA's [official site](http://ipeadata.gov.br/beta3/), in
BETA version.

Technologies used:

- [React](https://reactjs.org/).
- [Material-UI](https://material-ui.com/).
- OData (Open Data Protocol) to interact with the database backed (queries to
  [filter](odata-url-conventions) and [aggregate](odata-aggregation) data.
- [Chart.js](https://chartjs.org/) for simple data visualization.
- [chartjs-chart-geo](https://github.com/sgratzl/chartjs-chart-geo), Chart.js
  plugin to plot geoespatial data, like a choropleth map, using topoJSON, for
  example.
- APIs from IBGE for
  [maps](https://servicodados.ibge.gov.br/api/docs/malhas?versao=2) and
  [localities](https://servicodados.ibge.gov.br/api/docs/localidades?versao=1)
  to obtain topoJSON from most of Brazil regions and related metadata.
