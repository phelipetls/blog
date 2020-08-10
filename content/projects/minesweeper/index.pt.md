---
title: "minesweeper.js"
date: 2020-06-16
softwares: ["javascript", "css", "node", "express", "postgresql"]
website: "https://some-minesweeper.herokuapp.com"
github: "https://github.com/phelipetls/minesweeper.js"
---

Esta é uma implementação de campo minado escrito com JavaScript, CSS, Node.js e
PostgreSQL, para me ajudar a aprender uma stack básica de desenvolvimento web.

Eu usei principalmente a API do DOM e eventos para lidar com o estado e lógica
do jogo.

Um mecanismo simples de autenticação foi implementado com PostgreSQL,
[node-postgres](https://node-postgres.com/) e
[passport-local](http://www.passportjs.org/packages/passport-local/), porque eu
queria armazenar o histórico do jogador, o que seria então visível no
*Leaderboard* ou em sua página de perfil.
