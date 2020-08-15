---
title: "Asynchronous :make in Neovim with Lua"
date: 2020-08-12
categories: ["Programming", "Lua", "Neovim"]
tags: []
---

The `make` command in Vim is quite useful, it runs whatever program is under
the `makeprg` option and returns its output in the quickfix list, where you'll
be able to hop through the errors if they were parsed correctly by the
`errorformat` option.

For example, if you want to lint a Python file with `flake8`, it would suffice
to

```vim
setlocal makeprg=flake8\ %
setlocal errorformat=%f:%l:%c:\ %t%n\ %m
```

Or, you could create a `:h compiler` plugin named `flake8`, that set these
options when you run `compiler flake8`, [as I have in my
config](https://github.com/phelipetls/dotfiles/blob/master/.config/nvim/compiler/flake8.vim).

There are a bunch of compiler plugins that come with Vim by default that you
might be interested, for example, `:compiler pyunit` for test suites written
with the `unittest` library.

It works great once you have these options set correctly (although for some, it
can be tricky to get the `errorformat` right).

The only problem is that it is synchronous. Which means that for some expensive
programs, you will not be able to edit until it finishes. In this post we will
solve this in Neovim with Lua.

# Using Libuv through Lua

Neovim comes with [Lua bindings for
libuv](https://github.com/luvit/luv/blob/master/docs.md), accessible under `:h
vim.loop`.

What you can do with it is kind of overwhelming. Here, we'll just use the
function
[`vim.loop.spawn`](https://github.com/luvit/luv/blob/master/docs.md#uvspawnpath-options-on_exit),
to run `makeprg` in the background.

# Creating a Lua module

First, we need to create a [Lua
module](https://www.tutorialspoint.com/lua/lua_modules.htm), which I will name
`async_make`. It will have a single function called `make`.

We are supposed to put this file in `~/.config/nvim/lua` on Unix-like systems
and `~/AppData/Local/nvim/lua` on Windows.

With this we will be able to use it like so:

```vim
command! Make silent lua require'async_make'.make()
nnoremap <silent> <space>m :Make<CR>
```

# Running the program

Here's the function that does the main job. Below, we will go through it
step-by-step.

```lua
local M = {}

function M.make()
  local makeprg = vim.bo.makeprg -- (1)
  local cmd = vim.fn.expandcmd(makeprg) -- (2)
  local program, args = string.match(cmd, "([^%s]+)%s+(.+)") -- (3)

  local stdout = vim.loop.new_pipe(false)
  local stderr = vim.loop.new_pipe(false)

  handle, pid = vim.loop.spawn(program, { -- (4)
    args = vim.split(args, ' '),
    stdio = { stdout, stderr }
  },
  function(code, signal) -- (5)
    stdout:read_stop()
    stdout:close()
    stderr:read_stop()
    stderr:close()
    handle:close()
  end
  )

  vim.fn.setqflist({}, "r") -- (6)

  stderr:read_start(vim.schedule_wrap(onread)) -- (7)
  stdout:read_start(vim.schedule_wrap(onread))
end

return M
```

1. Get the value under the `makeprg` option, e.g. `flake8 %`.
2. Expand special keywords like `%` in a string, e.g. `flake8 ~/script.py`.
3. Get the program (the first sequence of non-whitespace characters, `[^%s]+`)
   and its arguments (what follows after a sequence of spaces) in two separate
   strings. This uses [Lua's pattern
   matching](http://lua-users.org/wiki/PatternsTutorial).
4. Call the function. Notice that `args` in `options` should not be a string,
   but rather a table, so we split it. Also we pass the file descriptors that
   we want available to the process, from which we will read.
5. Pass the function to execute on exit, to close everything we opened.
6. Clear the current quickfix list. It's also possible to create a new one with
   `vim.fn.setqflist({}, " ")`. Read `:h setqflist()` for details.
7. Pass the function to read from the file `stdout` and `stderr`. Notice we
   must need to wrap it with `:h vim.schedule_wrap`.


# Reading the output

Now let's see what's in that callback called `onread`, that we passed to the
[`read_start`](https://github.com/luvit/luv/blob/master/docs.md#uvread_startstream-callback)
method of `libuv`'s pipe handle.

```lua
local function onread(err, data)
  if err then
    local echoerr = "echoerr '%s'"
    vim.api.nvim_command(echoerr:format(err))
  elseif data then
    local lines = vim.split(data, "\n")
    fill_qflist(lines)
  end
end
```

This function will be called until there is no more data. If there is an error,
it will be shown with `:h echoerr`. Otherwise, we will call `fill_qflist()` to
add the output to the current quickfix list.

```lua
local function fill_qflist(lines)
  vim.fn.setqflist({}, "a", {
    title = vim.bo.makeprg,
    lines = vim.tbl_filter(has_non_whitespace, lines),
    efm = vim.bo.errorformat
  })

  vim.api.nvim_command("doautocmd QuickFixCmdPost")
end
```

The only thing worth notice here is that we first need to split the data into
lines and filter out those with only whitespace in them using the function
below.

```lua
local function has_non_whitespace(str)
  return str:match("[^%s]")
end
```

Finally, we call the `:h doautocmd` to fire the QuickFixCmdPost event and
that's all.

[Get the full code in this
gist](https://gist.github.com/phelipetls/639a1b5f021d17c4124cccc83e518566).
Please comment if you find a bug or some improvement and I'll update here.
