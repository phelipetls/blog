---
title: "Python f-strings syntax highlighting in Vim"
date: 2020-10-28
categories: ["Programming", "Tools", "Vim", "Python"]
tags: ["vim", "python"]
---

Getting Python syntax highlighting to work in Vim requires very little code, to
my surprise.

It's really useful to know how to extend or modify the syntax highlighting in
case the default ones does not match your preference or you a file type is not
at all supported.

Here is everything that you need and an explanation below.

```vim
" in ~/.config/nvim/after/syntax or ~/.vim/after/syntax
syn region pythonfString matchgroup=pythonQuotes
      \ start=+[fF]\@1<=\z(['"]\)+ end="\z1"
      \ contains=@Spell,pythonEscape,pythonInterpolation
syn region pythonfDocstring matchgroup=pythonQuotes
      \ start=+[fF]\@1<=\z('''\|"""\)+ end="\z1" keepend
      \ contains=@Spell,pythonEscape,pythonSpaceError,pythonInterpolation,pythonDoctest

syn region pythonInterpolation contained
      \ matchgroup=SpecialChar
      \ start=/{/ end=/}/
      \ contains=ALLBUT,pythonDecoratorName,pythonDecorator,pythonFunction,pythonDoctestValue,pythonDoctest

hi link pythonfString String
hi link pythonfDocstring String
```

The first two lines define a new syntax region (see `:h syn-region`) called
`pythonfString`.

We then declare how it starts by using the regex `[fF]\@1<=\z(['"]\)`, which is
equivalent to `(?:<=[fF])(")` in Perl regular expressions (see `:h \@<=`). The
second line just handles the case of a docstring.

Then we declare how it ends: it ends when we see the opening quotes again.
Because we captured the quotes inside a group, we just use that with `\z1`,
which means group 1 (we need to prefix with `z` because it will be used in an
external pattern, see `:h \z(`).

The `matchgroup` parameter tells Vim which highlight group it should use to
highlight the start/end pattern. The group `pythonQuotes` come from the default
syntax file.

We also need to declare what this region contains. For this we declare another
region called `pythonInterpolation` whose start and end patterns are much
simpler: an opening and closing braces respectively. This region, in turn, may
contain anything but stuff like a function, a decorator etc (notice the special
syntax to do that).

Finally, we link these syntax regions with an appropriate highlight group (see
`:h hi-link`): which is the `String` (see `:h group-name`).
