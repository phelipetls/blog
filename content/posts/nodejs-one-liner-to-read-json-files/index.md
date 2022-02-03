---
title: "Node.js one-liner to read JSON files"
date: 2022-01-26
tags: ["javascript"]
summary: How to use Node instead of jq for trivial property accessors
---

Imagine we have the following JSON file and we want to use the highlighted
line's value in a script.

```json {hl_lines=[3]}
{
  "expo": {
    "name": "MyApp",
    "slug": "myapp",
    "version": "1.0.0"
  }
}
```

I think most people would use `jq` to do it:

```sh
jq .expo.name app.json
```

But it turns out it's just as easy with Node.js:

```sh
node -p "require('./app.json').expo.name"
```

But a quick research revealed that this just works if the file has a `.json`
extension, otherwise Node.js wouldn't parse its contents as JSON automatically.
So you'd have to do it yourself:

```sh
node -p "JSON.parse(require('fs').readFileSync('./app)).expo.name"
```
