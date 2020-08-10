---
title: "seriesbr"
date: 2019-11-22
softwares: ["python", "pandas", "requests", "unittest"]
website: "https://seriesbr.readthedocs.io"
github: "https://github.com/phelipetls/seriesbr"
---

Uma biblioteca em Python para ajudar extrair séries temporais de bancos de
dados de instituições governamentais do Brasil, como o [Banco Central do
Brasil](https://www3.bcb.gov.br/sgspub), [IPEA](http://ipeadata.gov.br/beta3/)
e [IBGE](https://sidra.ibge.gov.br/home/ipp/brasil).

Foi o meu primeiro projeto em Python, que comecei para preencher a necessidade
de baixar séries dessas diversas fontes com facilidades em um único
`DataFrame`.

Eu li a documentação de suas APIs para implementar a capacidade de procurar e
extrair séries de seus bancos de dados.

A maioria delas eram APIs REST públicas, logo foi necessário somente criar as
URLs apropriadas, dado um conjunto de parâmetros, e transformar a resposta em
JSON em um `DataFrame`.

Foi minha primeira experiência com Test-Drive development e com Continuous
Integration com Travis-CI. EU usei essa abordagem extensivamente em todos os
meus projetos em Python desde então, já que facilitou muito a manutenção e refatoração do código.
