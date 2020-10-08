---
title: "URL shortener"
date: 2020-08-26
softwares: ["python", "flask", "sqlalchemy", "pytest", "vue"]
website: "https://xsurl.herokuapp.com/"
github: "https://github.com/phelipetls/url-shortener"
---

Este é um simples encurtado de URLs feito para aprender o básico de Flask e Vue.

É hospedado no Heroku com um nome qualquer, usando `PostgreSQL` como banco de
dados e `SQLAlchemy` como o ORM (com a extensão `Flask-SQLAlchemy`). Claro, tem
um modelo de banco de dados muito simples: uma tabela com uma chave primária,
URLs, uma string curta (6 caracteres, gerados aleatoriamente com
`secrets.token_urlsafe()`) e uma data de expiração opcional.

Eu estava principalmente interessado em aprender como se testar a aplicação e
foi ótimo descobrir como é fácil.

O front-end não é muito elaborado, mas eu acabei aproveitando para ler mais
sobre Vue porque eu estava interessado.

Eu gastei bastante tempo lendo sobre o melhor algoritmo para encurtar a URL.
Considerei fazer um hash da URL e encodar em um jeito amigável para URLs até
mudar a base do ID da linha no banco de dados. Eu acabei apenas usando o módulo
Python `secrets` para gerar uma string aleatória de 6 caracteres porque é mais
simples e o objetivo não é escalar de qualquer modo.
