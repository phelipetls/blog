---
title: "Configuring eslint to work with Neovim LSP"
date: 2020-12-28
categories: ["Programming", "Lua", "Neovim", "Tools"]
tags: ["lua", "nvim"]
---

The way we'll get this to work is by using a generic Language Server called
[`efm-langserver`](https://github.com/mattn/efm-langserver), which is written
in Go. There is also
[`diagnostic-languageserver`](https://github.com/iamcco/diagnostic-languageserver),
which is written in TypeScript, but I didn't try it.

These Language Servers are generic in that they were made to be powered by
command-line tools and for any language.

# Making eslint faster with eslint_d

To reduce latency when invoking `eslint`, I'd recommend using
[`eslint_d`](https://github.com/mantoni/eslint_d.js/), which runs `eslint` as a
daemon process.

This is what I began to use by configuring my `makeprg` in the following way:

```vim
setl makeprg=eslint_d\ --format=unix
setl errorformat=%f:%l:%c:\ %m,%-G%.%#
```

The problem with this workflow is to remember to run `:make` to regularly check
your code. I used to solve this by running an async version of make whenever I
saved and open the quick fix list in a non-invasive way, but I ended up finding
this to be disruptive.

Once I got used to getting this feedback through the `:h signcolumn`, I wanted
to integrate my linters with LSP as well.

# Configuring eslint_d in efm-langserver

Here's how I configured `efm-langserver` to work with `eslint_d`:

```yaml
version: 2

tools:
  eslint_d: &eslint_d
    lint-command: 'eslint_d -f unix --stdin --stdin-filename ${INPUT}'
    lint-stdin: true
    lint-formats:
      - "%f:%l:%c: %m"
    lint-ignore-exit-code: true
    format-command: 'eslint_d --fix-to-stdout --stdin --stdin-filename=${INPUT}'
    format-stdin: true

languages:
  javascript:
    - <<: *eslint_d
  javascriptreact:
    - <<: *eslint_d
  javascript.jsx:
    - <<: *eslint_d
  typescript:
    - <<: *eslint_d
  typescript.tsx:
    - <<: *eslint_d
  typescriptreact:
    - <<: *eslint_d
```

I think it's pretty much self-explanatory but I will point out the issues I had
until I got it right.

- Don't forget to configure `lint-formats`, it didn't recognize the column
  numbers without it.
- You need to configure it to work with all those "languages", which ideally
  would be just 2: javascript and typescript, but filetype names in Vim is a
  shitshow so that's that.

If you still have a problem, take advantage of the program's logging
capabilities:

```yml
version: 2
log-file: /home/phelipe/efmlangserver.log
log-level: 1
```

# Configuring efm-langserver in Neovim

This is the configuration that worked for me:

```lua
local nvim_lsp = require "nvim_lsp"

nvim_lsp.efm.setup {
  default_config = {
    cmd = {
      "efm-langserver",
      "-c",
      [["$HOME/.config/efm-langserver/config.yaml"]]
    },
    root_dir = function()
      return vim.fn.getcwd()
    end,
  },
  filetypes = {
    "javascript",
    "javascriptreact",
    "javascript.jsx",
    "typescript",
    "typescript.tsx",
    "typescriptreact"
  }
}
```

Notice that I had to override the `default_config` `cmd` value because by
default it's just `efm-langserver`, which is not ideal but I don't know of a
better way (you can also configure it in Lua, but I didn't feel like figuring
it out).

Notice also how I configured the `root_dir` parameter. This is what decides if
a buffer gets attached to a server or not, but it is optional for
`efm-langserver` because it takes into account the value of `root-markers` in
its configuration.

I find that it worked best for me to just set `root_dir` to the directory in
which I opened `nvim`, so it won't search for any other roots. Otherwise, files
inside `node_modules` would also be attached to `efm-langserver`. This is not
what I want, particularly because `eslint_d` has caching features that takes
too much RAM.

# Bonus: LSP configuration

If you're new to this, you may want to look at [my LSP
configuration](https://github.com/phelipetls/dotfiles/blob/master/.config/nvim/lsp.lua).
You'll see that I pass a callback (which just sets some keybindings) to be
called when a buffer gets attached to a LSP server (via the `on_attach` field
in the setup table). [I then source this file in my
`init.vim`](https://github.com/phelipetls/dotfiles/blob/master/.config/nvim/init.vim#L533)

# Furthermore

I just configured this so I'll see how it goes but it's definitely better than
letting `eslint` warnings pass unnoticed.

I also really wanted a way to use `eslint --fix` (preferably on save), but I
didn't manage to do that. Using `vim.lsp.buf.formatting_sync()` has a
noticeable latency (which is understandable), so running it on save is not an
option. For now, I will just run it from time to time manually. (I do use
`formatprg`, but for prettier, and at work they don't use prettier so I'm still
figuring it out how to make this more convenient).
