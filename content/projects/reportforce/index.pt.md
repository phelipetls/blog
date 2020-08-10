---
title: "reportforce"
date: 2020-01-25
softwares: ["python", "pandas", "requests", "pytest"]
website: "https://reportforce.readthedocs.io"
github: "https://github.com/phelipetls/reportforce"
---

Este projeto é um cliente para a [API de
Analytics](https://resources.docs.salesforce.com/226/latest/en-us/sfdc/pdf/bi_dev_guide_rest.pdf)
da Salesforce, focado no download de relatórios.

Envolveu principalmente lidar com HTTP para autenticar via [SOAP
API](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/authenticate-soap-api.htm),
obter o relatório em JSON da Analytics API e transformá-la em um `DataFrame`.

Eu comecei esse projeto porque me poupar de baixar manualmente vários relatórios no browser.

No entanto, a API tem severas limitações, como de apenas retornar 2000 linhas
por relatório, não provendo um jeito de filtrar por número de linhas ainda por
cima. Este pacote oferece um *workaround* se você passar como parâmetro uma
coluna que serve como *key*.

Eu tentei oferecer bastante flexibilidade em termos de filtros, etc.
