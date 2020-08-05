---
title: "minesweeper.js"
date: 2020-06-16
softwares: ["javascript", "css", "node", "express", "postgresql"]
website: "https://some-minesweeper.herokuapp.com"
github: "https://github.com/phelipetls/minesweeper.js"
---

This is a minesweeper implementation in pure JavaScript, to help me learn a
basic web development stack with vanilla JS, CSS, Node and PostgreSQL.

I mostly used the DOM API and custom events to handle the game logic and state.

Basic authentication was implemented with [PostgreSQL](https://postgresql.org/),
[node-postgres](https://node-postgres.com/) and
[passport-local](http://www.passportjs.org/packages/passport-local/), in order
to record the player's game history, which would then be visible at the profile page or
the leaderboard.
