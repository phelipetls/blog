---
title: "seriesbr"
date: 2019-11-22
techs: ["python", "pandas", "requests", "unittest"]
website: "https://seriesbr.readthedocs.io"
github: "https://github.com/phelipetls/seriesbr"
---

A Python package to get timeseries data from famous brazilian government
institutions, such as the [Brazilian Central
Bank](https://www3.bcb.gov.br/sgspub), [Institute of Applied Economic
Research](http://ipeadata.gov.br/beta3/) and [Brazilian Institute of Geography
and Statistics](https://sidra.ibge.gov.br/home/ipp/brasil).

This is my first Python project, which I started to fill my need of getting
time-series data from several brazilian government institutions,

I read through their API documentation to implement a Python client to search
through their databases and to get the data itself.

Most of them are public REST APIs, so I only needed to create functions to
receive the users parameters, build the specific URL and clean up the JSON
through pandas.

It was also my first contact with Test-Driven development. I used the standard
unittest Python library and currently it has 99% test coverage.
