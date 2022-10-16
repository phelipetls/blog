---
title: Template String Converter in Neovim with Treesitter
date: 2022-10-14
tags: [nvim, lua, treesitter, javascript]
---

In this blog post, we'll see how to use treesitter in neovim to automatically
convert a JavaScript string into a template string if it contains `${`.

This is similar to the [Template String
Converter](https://marketplace.visualstudio.com/items?itemName=meganrogge.template-string-converter)
VS Code extension.

Our program should do something like this:

1. Are we inside of a string? If yes, continue, otherwise exit.
2. Does that string contain a `${`? If yes, continue, otherwise exit.
3. Replace the surroundings of that string with \`.

[Here's the code in a GitHub
Gist](https://gist.github.com/phelipetls/70b1cf29791501cae99887938008cc6a), in
case you're just interested in that.

# Creating Lua module

Let's begin by creating a Lua module with some boilerplate code:

```lua {filename="~/.config/nvim/lua/template-string-converter.lua"}
local M = {}

M.convert = function()
  --- ...
end

return M
```

A Lua module is simply a file with Lua code in a `lua` directory in our `:h
runtimepath`.

Notice that we create a table and return it at the end. This has the effect
that we'll be able to use that table later on by requiring it, for instance to
call the `convert` function we'd write
`require("template-string-converter").convert`.

# Checking if the node under cursor is a string

Let's first check if we're inside of a string at the time we call our function:

```lua
M.convert = function()
  local node = require("nvim-treesitter.ts_utils").get_node_at_cursor()

  local is_parent_string = node:parent() and node:parent():type() == "string"

  if not (is_string or is_parent_string) then
    return
  end
end
```

We can get a bunch of information about the node via methods, such as its type.
You can learn about every the available methods at `:h tsnode`.

You may be wondering, is `"string"` some kind of special value in treesitter?
No, I could create a treesitter grammar and call a string "poop", treesitter
wouldn't care, [that's just the name the developers
chose](https://github.com/tree-sitter/tree-sitter-javascript/blob/936d976a782e75395d9b1c8c7c7bf4ba6fe0d86b/grammar.js#L887-L904)
(thanks!).

But sometimes the name of the node you're interested in might not be so
obvious. It helps to inspect the syntax tree with the `:TSPlaygroundToggle`
command of the [playground](https://github.com/nvim-treesitter/playground)
plugin.

{{< figure src="./playground-demo.png" alt=`A screenshot of neovim showing a
syntax tree representation of a JavaScript program, as implemented in
nvim-treesitter's playground plugin.` >}}

# Find `${` within a string

To check if a string contains a `${`, we'll use `:h tsnode:iter_children` to
iterate through all child nodes and `vim.treesitter.get_node_text` to get their
text, then use Lua's `string.match` to check if the text contains `${`:

```lua
M.convert = function()
  --- ...

  local has_interpolation = false

  for child in node:iter_children() do
    local child_text = vim.treesitter.query.get_node_text(child, 0)

    has_interpolation = child_text:match("${")

    if has_interpolation then
      break
    end
  end

  if has_interpolation then
    replace_surroundings_with(node, "`")
  end
end
```

{{< warn >}}

Notice that `vim.treesitter.get_node_text` takes a mandatory second argument,
which is the buffer number (we use `0` for current buffer).

{{< /warn >}}

If we detect that the string contains a `${`, we'll transform the string into a
template string by replacing its surroundings with the `replace_surroundings_with` function.

# Replace the string surroundings with `

To do this, we'll first get the node's start and end position with `:h
tsnode:range` which we'll use in `nvim_buf_set_text` to replace surrounding
quotes with \`, by calling <code>replace_surroundings_with(node, "\`")</code>.

```lua
local replace_surroundings_with = function(node, char)
  local start_row, start_col, end_row, end_col = node:range()

  vim.api.nvim_buf_set_text(0, start_row, start_col, start_row, start_col + 1, { char })
  vim.api.nvim_buf_set_text(0, end_row, end_col - 1, end_row, end_col, { char })
end
```

# Usage

The least invasive way to use this function is to call it after leaving insert
mode (with `:h InsertLeave`) and after changes in normal mode (`:h
TextChanged`):

```vim {filename="~/.config/nvim/after/ftplugin/javascript.vim"}
if has('nvim')
  augroup TemplateStringConverter
    autocmd!
    autocmd InsertLeave,TextChanged <buffer> lua require("template-string-converter").convert()
  augroup END
endif
```

{{< video src="./insertleave.webm" caption="Using with InsertLeave event." >}}
{{< video src="./textchanged.webm" caption="Using with TextChanged event." >}}

Using it at every change in insert mode, with `:h TextChangedI`, would be more
tricky.
