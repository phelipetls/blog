---
title: "Ipeadata Explorer"
date: 2020-09-02
softwares: ["react", "javascript"]
website: "http://ipeadata-explorer.surge.sh"
github: "https://github.com/phelipetls/ipeadata-explorer"
---

This is a frontend written in [React](https://reactjs.org/docs/getting-started.html) for the [Ipeadata](http://ipeadata.gov.br/api/)
database from IPEA, which has several time series of various themes.

It handles searching the database with several filters and also visualizing
the data.

For time series without values per geographic region, a simple line chart is
shown. Otherwise, a choropleth map is shown if the user wants to see the values
per state, microregions, macroregions and municipalities. A bar chart is used
for categorical data.

The map can also be drilled down, for example, if the user wants to see the
values per municipality for the state of Rio de Janeiro.

These visualizations were made possible thanks to
[Chart.js](https://www.chartjs.org/docs/latest/), a [Chart.js plugin for
maps](https://github.com/sgratzl/chartjs-chart-geo-chart-geo) and a [IBGE
API](https://servicodados.ibge.gov.br/api/docs/malhas?versao=2) which provides
TopoJSON for brazilian geographic regions.
