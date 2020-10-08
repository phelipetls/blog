---
title: "Asynchronous :make in Neovim with Lua"
date: 2020-08-12
categories: ["Programming", "Lua", "Neovim", "Tools"]
tags: ["lua", "nvim"]
---

The `:make` command in Vim is quite useful, it runs whatever program is under
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
options when you run `:compiler flake8`, [as I have in my
config](https://github.com/phelipetls/dotfiles/blob/master/.config/nvim/compiler/flake8.vim).

There are a bunch of compiler plugins built into Vim that you might be
interested, for example, `:compiler pyunit` for test suites written with the
`unittest` library.

It works great once you have these options set correctly (although the
`errorformat` can be tricky).

The only "problem" is that it is synchronous. Which means that for some expensive
programs, you will not be able to edit until it finishes. In this post we will
solve this in Neovim with Lua.

In a previous revision of this post, I used [libuv bindings for
Lua](https://github.com/luvit/luv/blob/master/docs.md), accessible under
`vim.loop`, but this is kind of a low level approach. An alternative is to use
the `jobstart()` function, which offers several conveniences.

I put the following Lua script under `~/.config/nvim/lua/` (if you use Neovim
you can get yours with `:echo stdpath("config")`) for it to be available at
runtime as [Lua module](https://www.tutorialspoint.com/lua/lua_modules.htm),
named `async_make`.

```lua
local M = {}

function M.make()
  local lines = {""}
  local winnr = vim.fn.win_getid()
  local bufnr = vim.api.nvim_win_get_buf(winnr)

  local makeprg = vim.api.nvim_buf_get_option(bufnr, "makeprg")
  if not makeprg then return end

  local cmd = vim.fn.expandcmd(makeprg)

  local function on_event(job_id, data, event)
    if event == "stdout" or event == "stderr" then
      if data then
        vim.list_extend(lines, data)
      end
    end

    if event == "exit" then
      vim.fn.setqflist({}, " ", {
        title = cmd,
        lines = lines,
        efm = vim.api.nvim_buf_get_option(bufnr, "errorformat")
      })
      vim.api.nvim_command("doautocmd QuickFixCmdPost")
    end
  end

  local job_id =
    vim.fn.jobstart(
    cmd,
    {
      on_stderr = on_event,
      on_stdout = on_event,
      on_exit = on_event,
      stdout_buffered = true,
      stderr_buffered = true,
    }
  )
end

return M
```

This function first get the current window number and the buffer in it, which I
will then use to get the local values of `makeprg` and `errorformat`.

Then I expand the `makeprg` with `expandcmd()`, which transforms something like
`make %` to `make ~/program.c`, and store it in a variable to be used by
`jobstart()`.

Then I create the function `on_event` to be a catch-all handler for job events.
The callbacks passed to `on_stdout`, `on_stderr` and `on_exit` will receive the
following arguments: `({chan-id}, {data}, {name})`. So we take advantage of the
third parameter here (see `:h channel-callback`).

When we receive data from `stdout` and `stderr`, we extend the `lines` variable
with it. Because of `stdout_buffered` and `stderr_buffered`, the callback will
only be called when all of the output was gathered (see `:h channel-buffered`).

When the program exits, we populate the quickfix list. This is done with `:h
setqflist()`. We give it a title (the expanded `makeprg`), the
lines to be parsed and the `errorformat` to parse the lines with.

Finally we trigger whatever `autocmd` is under the `QuickFixCmdPost` event.

Then, I'm able to use it inside `nvim` like this:

```vim
command! Make silent lua require'async_make'.make()
nnoremap <silent> <space>m :Make<CR>
```

Then, if you may wish to run it on save, use this:

```vim
augroup LintOnSave
  autocmd! BufWritePost <buffer> Make
augroup END
```

A command to disable it is convenient (you can re-enable it with `:e<CR>`):

```vim
command! DisableLintOnSave autocmd! LintOnSave BufWritePost <buffer>
```

[Get the full code in this
gist](https://gist.github.com/phelipetls/639a1b5f021d17c4124cccc83e518566).
