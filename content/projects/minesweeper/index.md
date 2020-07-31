---
title: "minesweeper.js"
date: 2020-06-16
techs: ["javascript", "css", "node", "express", "postgresql"]
website: "https://some-minesweeper.herokuapp.com"
github: "https://github.com/phelipetls/minesweeper.js"
---

This is a minesweeper implementation in pure JavaScript, to help me learn a
basic web development stack with vanilla JS, CSS, Node and PostgreSQL.

I mostly used the DOM API and events to handle the game logic and state.

Basic authentication was implemented, with PostgreSQL,
[node-postgres](https://node-postgres.com/) and
[passport-local](http://www.passportjs.org/packages/passport-local/).

This was done in order to store a player's game history, which can be viewed at
the profile page or the leaderboard.
