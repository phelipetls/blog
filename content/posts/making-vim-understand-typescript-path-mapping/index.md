---
title: "Making Neovim understand TypeScript path mapping"
date: 2021-09-13
tags: ["typescript", "nvim", "lua"]
draft: true
---

Vim has this well-known feature of opening the filename/path under cursor with
[`:h gf`](http://vimdoc.sourceforge.net/htmldoc/editing.html#gf). [This article
explains well how this
works](https://vim.fandom.com/wiki/Open_file_under_cursor).

But some languages like Python has custom syntax for imports:

```python
import a.module
from .other_module import fun
from ..module import fun
```

This complicates things a bit, but [the built-in ftplugin for Python configures
Vim to understand this
already](https://github.com/vim/vim/blob/4b4b1b84eee70b74fa3bb57624533c65bafd8428/runtime/ftplugin/python.vim#L19,L35)
by changing the [`:h
includeexpr`](http://vimdoc.sourceforge.net/htmldoc/options.html#'includeexpr')
option.

In the JavaScript world this is even more complex... There are [webpack
aliases](https://webpack.js.org/configuration/resolve/), [Jest's
moduleNameMapper](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring)
and god knows what else. The TypeScript compiler has this feature as well, it's
called [path
mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

For example, to import a component from `src/components` from anywhere with
just `~/components`, you'd use the following `tsconfig.json`:

```json
{
  "compilerOptions": {
   "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  }
}
```

The bad thing is that, then, `gf` won't work, Vim has no idea what `~/` is
supposed to mean, unless we configure the `includeexpr` option to tell it, so
that's what I'm about to share with you.

# Why not LSP?

You might be wondering why not just use a language server for that?

And you'd be right, that's certainly better than implementing the TypeScript
module resolution algorithm in Lua...

But the TypeScript language servers are very resource hungry and slow to boot,
so I find that it does pay off to use a dumber way to navigate files with
built-in Vim features in case the language server is still booting or just
being slow.

# Implementation details

Our goal is to pass a function to the `includeexpr` option that will try to
substitute the "alias" (`~/*`) with its associated path (`src/*`) until it
finds a file/directory that exists, then return it. Otherwise, return `nil`.

I decided to write it in Lua in the `lua/tsconfig.lua` module. Here's how we
can configure the `includeexpr` for JavaScript/TypeScript to use this lua
function:

```vim {hl_lines=[9]}
" after/ftplugin/javascript.vim
" after/ftplugin/typescript.vim

" It's common in JavaScript to omit the file extension
" Also some plugins mess this up...
setlocal suffixesadd=.js,.jsx,.ts,.tsx,.d.ts

if has("nvim")
  setlocal includeexpr=luaeval(\"require'tsconfig'.includeexpr(_A)\",v:fname)
endif
```

And here's an skeleton of the Lua module:

```lua
-- lua/tsconfig.lua

local M = {}

local function expand_tsconfig_path(input)
  local tsconfig_file = get_tsconfig_file()

  if not tsconfig_file then
    return input
  end

  local alias_to_paths = get_tsconfig_paths(tsconfig_file)

  if not alias_to_paths then
    return input
  end

  for alias, path in pairs(alias_to_paths) do
    -- TODO: work to find a file that exists
  end

  return input
end

function M.includeeexpr(input)
  local path = expand_tsconfig_path(input)
  return path
end

return M
```

How exactly we try to find a file will be explained later.

## Finding `tsconfig.json`

Let's start with the `get_tsconfig_file` function. We can do this by searching
upwards starting from the current file's directory with the [`:h
findfile`](https://vimhelp.org/eval.txt.html#findfile()) function:
`findfile('tsconfig.json', '.;')`.

```lua
local function get_tsconfig_file()
  return find_file("tsconfig.json", ".;") or find_file("jsconfig.json", ".;")
end
```

You'll notice the `find_file` usage, which is just wrapper around `findfile`
that returns `nil` if it doesn't find one (empty strings are not falsy in Lua):

```lua
local function find_file(fname, path)
  local found = vim.fn.findfile(fname, path or "")
  if found ~= "" then
    return found
  end
end
```

I use a similar function called `find_dir` that wraps `:h finddir`.

## Reading JSON with comments

Then we'll need to read the `tsconfig.json` file. Vim has a function to
serialize JSON, [`:h
json_decode`](https://vimhelp.org/eval.txt.html#json_decode%28%29), which is
great, except that `tsconfig.json` is not strictly JSON, since it allows
comments. No problem, we can just remove them before we pass it to
`json_decode`:

```lua
local function remove_comments(line)
  return line:gsub("/%*.*%*/", ""):gsub("//.*", "")
end

local function decode_json_with_comments(fname)
  local json_without_comments = vim.tbl_map(remove_comments, vim.fn.readfile(fname))
  return vim.fn.json_decode(json_without_comments)
end
```

## Parsing `compilerOptions.paths`

Next step is to parse `compilerOptions.paths` to create a table that maps
aliases into their real full paths. For example, given this configuration:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  }
}
```

We want something like this:

```lua
{
  "~/*": {
    get_full_path(base_url) .. "src/"
  }
}
```

This is because paths are relative to `compilerOptions.baseUrl`. Also, we
should remove the catch-all character `*`:

```lua {hl_lines=[20]}
local function get_dir(fname)
  return vim.fn.fnamemodify(fname, ":h")
end

local function get_tsconfig_paths(tsconfig_fname)
  if not tsconfig_fname then
    return {}
  end

  local json = decode_json_with_comments(tsconfig_fname)
  local base_url = json and json.compilerOptions and json.compilerOptions.baseUrl

  local alias-to_paths = {}

  if json and json.compilerOptions and json.compilerOptions.paths then
    for alias, paths in pairs(json.compilerOptions.paths) do
      alias_to_paths[alias] =
        vim.tbl_map(
        function(path)
          return vim.fn.simplify(get_dir(tsconfig_fname) .. "/" .. base_url .. "/" .. path:gsub("*", ""))
        end,
        paths
      )
    end
  end

  return alias_to_paths
end
```

## Expand tsconfig

Now let's remove that TODO we left earlier.

We just need to "expand" (replace) the alias with its path until we find a file
that exist.

First, we check if the input filename matches the alias (e.g., `~/file` should
match `~/*` but also `*` since it means any value), replace the alias with its
path (`~/file` -> `src/file`) and try to find it:

```lua {hl_lines=[5,"7-8"]}
local function expand_tsconfig_path(input)
  -- ...

  for alias, paths in pairs(alias_to_paths) do
    if alias == "*" or vim.startswith(input, alias:gsub("*", "")) then
      for _, path in pairs(paths) do
        local expanded_path = input:gsub(alias, path)
        local real_path = find_file(expanded_path) or find_dir(expanded_path)

        if real_path then
          return real_path
        end
      end
    end
  end

  return input
end
```

## Handling configuration inheritance

We still one problem though... We're ignoring TS Config's
[`extends`](https://www.typescriptlang.org/tsconfig#extends) option, which
allows you to inherit from other configuration files.

To handle this, we'll need to recursively call `get_tsconfig_paths` for every
`tsconfig.json` that has an `extends` option, until it doesn't:

```lua {hl_lines=[10,"19-21"]}
local function find_tsconfig_extends(extends, tsconfig_fname)
  if not extends or vim.startswith(extends, "@") then
    return
  end

  local tsconfig_dir = get_dir(tsconfig_fname)
  return vim.fn.simplify(tsconfig_dir .. "/" .. extends)
end

local function get_tsconfig_paths(tsconfig_fname, prev_base_url)
  if not tsconfig_fname then
    return {}
  end

  local alias_to_paths = {}

  -- ...

  local tsconfig_extends = find_tsconfig_extends(json.extends, get_dir(tsconfig_fname))

  return vim.tbl_extend("force", alias_to_paths, get_tsconfig_paths(tsconfig_extends, base_url))
end
```

# Conclusion

[You can check the full implementation
here](https://github.com/phelipetls/dotfiles/blob/91e6f4929273e0af974c8c78a104f5bdb9f06125/.config/nvim/lua/tsconfig.lua).
Be aware that this will likely change.

As I said earlier, Vim's built-in file navigation features are not the best
tool for the job but it does help me when tsserver/coc.nvim/watchman are being
slow, unreliable or making my computer fans go crazy.

Vim support for go-to-definition functionality [does not stop at the
`includeexpr` option](https://vimways.org/2018/death-by-a-thousand-files/), but
the API is cumbersome to use. I tried to get go-to-defintion working for
TypeScript by using `:h include-search` but had a hard time and eventually gave
up (the `v:fname` API is not enough for nested imports), but it's nice to have
a working `gf` at least...
