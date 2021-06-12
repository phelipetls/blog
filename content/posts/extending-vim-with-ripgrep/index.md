---
title: "Extending vim with ripgrep"
date: 2021-06-11
tags: ["tools", "vim", "ripgrep"]
---

In this post I want to talk about how I use `ripgrep` in `vim` (`nvim` to me
but it doesn't matter here).

This is a crucial part of my daily workflow. It's fast because of `ripgrep` and
extensible because of how nicely `vim` is integrate with the command line.

Here's the configuration needed:

```vim
if executable("rg")
  set grepprg=rg\ --vimgrep\ --smart-case\ --hidden
  set grepformat=%f:%l:%c:%m
endif
```

At first, it was not obvious to me how would I use beyond `:grep foo`. So I
want to share how I use it.

# Common use cases

- Search for `foo` in current working directory: `:grep foo`.
- Search for `foo` in files under `src/`: `:grep foo src`.
- Search for `foo` in current file directory: `:grep foo %:h`[^1].
- Search for `foo` in current file directory's parent directory: `:grep foo
  %:h:h` (and so on).

# Less common use cases

- Search for the exact word `foo` (not `foobar`): `:grep -w foo` (equivalent to
  `:grep '\bfoo\b'`).
- Search for `foo` in JavaScript files: `:grep foo -t js`
- Search for `foo` in files matching a glob: `:grep foo -g '*.js'`

# Extensibility

This is nice but here is where it truly shines. I can give any command line
output as an argument.

Say I want to search in files modified between git revisions:

```
:grep foo `git diff --name-only master..`
```

Or only modified files:

```
:grep foo `git ls-files --modified`
```

I don't use this everyday but I enjoy it when I do.

# Usage with vim

This will populate the quickfix list with the search results, so I can navigate
them with commands I'm already familiar with.

For example, to replace foo with bar across files (asking me to confirm
before): `:cdo s/foo/bar/gc`. And then `:cfdo update`. Sometimes I narrow the
search down with `:Cfilter` too.

# Downsides

The only downside is that you can't use backreferences or look-around in
regexes. In the rare case I need them, I use `:vimgrep`.

# Conclusion

This might be one of the few sane reasons why I insist on using `nvim` for
development (`vim-fugitive` and LSP as well). It's just one of those things I
enjoy using and makes development more fun (to me).

[^1]: `%:h` is expanded by `vim` to get the header of the current file. See `:h
expand`.
