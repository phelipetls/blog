---
title: "URL shortener"
date: 2020-08-26
softwares: ["python", "flask", "sqlalchemy", "pytest", "vue"]
website: "https://xsurl.herokuapp.com/"
github: "https://github.com/phelipetls/url-shortener"
---

This is a simple URL shortener made for learning the basics of Flask and
Vue.

<!--more-->

[It is hosted on Heroku with a silly name](https://xsurl.herokuapp.com/), using
PostgreSQL as the database and `SQLAlchemy` as ORM (with `Flask-SQLAlchemy`
extension). Of course, it has a very simple database model: a single table with
a primary key, a URL, a short token (6 characters, randomly generate with
`secrets.token_urlsafe()`) and an optional expiration date.

I was especially interested in learning how to test the application and it was
great to discover how easy it actually is.

The front-end is not very involved, but I ended reading a little bit about Vue
to make it because I was interested in it.

I spent a lot of time reading about the best algorithm to go about this. From
hashing the URL and encoding it an URL-friendly way to change the database's
number id base. I ended just using Python's `secrets` module to generate a
random 6 string because it was simpler and this isn't intended to scale anyway.
