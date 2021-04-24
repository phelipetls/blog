---
title: "Configuring eslint to work with Neovim LSP"
date: 2020-12-28
tags: ["lua", "nvim"]
---

The way we'll get this to work is by using a generic Language Server called
[`efm-langserver`](https://github.com/mattn/efm-langserver), which is written in
Go.

These Language Servers are generic in that they were made to be powered by
command-line tools and for any programming language.

# Making eslint faster with eslint_d

To reduce latency when invoking `eslint`, I'm gonna use
`eslint_d`](https://github.com/mantoni/eslint_d.js/), which runs `eslint` as a
daemon process.

# Configuring eslint_d in efm-langserver

It's possible to configure it with a YAML file, by following their README. I did
this initially I found that it's more powerful to configure it with Lua.

Here's the configuration, which more explanation below.

```lua
local lspconfig = require"lspconfig"

local eslint = {
  lintCommand = "eslint_d -f unix --stdin --stdin-filename ${INPUT}",
  lintStdin = true,
  lintFormats = {"%f:%l:%c: %m"},
  lintIgnoreExitCode = true,
  formatCommand = "eslint_d --fix-to-stdout --stdin --stdin-filename=${INPUT}",
  formatStdin = true
}

lspconfig.tsserver.setup {
  on_attach = function(client)
    if client.config.flags then
      client.config.flags.allow_incremental_sync = true
    end
    client.resolved_capabilities.document_formatting = false
    set_lsp_config(client)
  end
}

lspconfig.efm.setup {
  on_attach = function(client)
    client.resolved_capabilities.document_formatting = true
    client.resolved_capabilities.goto_definition = false
    set_lsp_config(client)
  end,
  root_dir = function()
    if not eslint_config_exists() then
      return nil
    end
    return vim.fn.getcwd()
  end,
  settings = {
    languages = {
      javascript = {eslint},
      javascriptreact = {eslint},
      ["javascript.jsx"] = {eslint},
      typescript = {eslint},
      ["typescript.tsx"] = {eslint},
      typescriptreact = {eslint}
    }
  },
  filetypes = {
    "javascript",
    "javascriptreact",
    "javascript.jsx",
    "typescript",
    "typescript.tsx",
    "typescriptreact"
  },
}
```

I defined a table to configure `efm-langserver` with `eslint_d` by giving the
necessary commands for linting and formatting.

I customize the `on_attach` function of both `efm` and `tsserver` so that only
one has `documentFormatting` capability, otherwise they would conflict with each
other.

The `root_dir` function was also customized so that `eslint_d` is spawned just
for the current working directory and not for every directory it encounters a
`.eslintrc` (or similar).

But I also want this to happen only if the directory has some sort of `eslint`
configuration. So I created a function to do this:

```lua
local function eslint_config_exists()
  local eslintrc = vim.fn.glob(".eslintrc*", 0, 1)

  if not vim.tbl_isempty(eslintrc) then
    return true
  end

  if vim.fn.filereadable("package.json") then
    if vim.fn.json_decode(vim.fn.readfile("package.json"))["eslintConfig"] then
      return true
    end
  end

  return false
end
```

# Conclusion

This is kind like a poor replacement for the VS Code eslint extension, which
does a similar thing as `eslint_d`. And it works ok, it's pretty fast, much
faster than `typescript-language-server`, so it's definitely an improvement.

It would be nice if there was a way to shut down the server if `eslint` is
broken for example, but I didn't manage to do it just yet.
