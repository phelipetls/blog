---
title: "reportforce"
date: 2020-01-25
softwares: ["python", "pandas", "requests", "pytest"]
website: "https://reportforce.readthedocs.io"
github: "https://github.com/phelipetls/reportforce"
---

This projects is a client for Salesforce's [Analytics REST
API](https://resources.docs.salesforce.com/226/latest/en-us/sfdc/pdf/bi_dev_guide_rest.pdf)
focused on downloading reports.

It mostly involved dealing with HTTP stuff to authenticate via [SOAP
API](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/authenticate-soap-api.htm),
download the JSON and transform it into a pandas DataFrame.

I begun this project becasue I needed to daily retrieve a Salesforce report,
and it was very time consuming to do it manually in the browser.

The API has unfortunate limitations, such as giving just 2000 rows per request
and it gives you no way to filter by row numbers. So the only workaround I
thought of was to filter out the previous reports by excluding the past values
of a column with unique identifiers such as an ID.
