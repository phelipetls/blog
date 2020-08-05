---
title: "seriesbr"
date: 2019-11-22
softwares: ["python", "pandas", "requests", "unittest"]
website: "https://seriesbr.readthedocs.io"
github: "https://github.com/phelipetls/seriesbr"
---

A Python package to get timeseries data from famous brazilian government
institutions, such as the [Brazilian Central
Bank](https://www3.bcb.gov.br/sgspub), [Institute of Applied Economic
Research](http://ipeadata.gov.br/beta3/) and [Brazilian Institute of Geography
and Statistics](https://sidra.ibge.gov.br/home/ipp/brasil).

This was my first Python project, which I started to fill my need of getting
time-series data from several brazilian government institutions, which I
previously did with various R packages.

I read through their API documentation to implement a client that would be able
to search and to get the data itself.

Most of them are public REST APIs, so I only needed to create functions to
build the URLs given user parameters and then clean up the JSON through pandas.

It was also my first experience with Test-Driven development and with
Continuous Integration (with Travis). I extensively used this approach on all of my
Python projects since it helped me greatly with maintenance and refactoring later.
