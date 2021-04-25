---
title: "A Vim errorformat for pytest"
date: 2020-10-07
tags: ["python", "vim"]
---

> Ah, errorformat, the feature everybody loves to hate. :) -- lcd047, on
> [Stack Overflow](https://stackoverflow.com/a/29102995)

I really like Vim's `:h errorformat` feature, but only when I manage to get it
right. Until then, I'm sure it will frustrate me more than once. It's very
awkward to write one if the program's output you're trying to capture is not
trivial (e.g., `LaTeX`).

Recently, I committed to get it right for `pytest`. The cli allows customizing
how tracebacks are shown with the `--tb` option, e.g., `pytest --tb=short`, and
to control verbosity level with `-v`, `-vv` and `-q`. I went with
`pytest --tb=short -vv`.

To run pytest in Vim I then put this line in a `:h compiler` plugin (see
`:h write-compiler-plugin`):

```vim
    CompilerSet makeprg=pytest\ --tb=short\ -vv\ $*\ %
```

So that I can run `pytest` with `:make` or even with more arguments with
`:make -k mytest`, which will replace the token `$*`.

It outputs something like this:

    ============================= test session starts ==============================
    platform linux -- Python 3.7.5, pytest-5.3.4, py-1.8.1, pluggy-0.13.1 -- /usr/bin/python3
    cachedir: .pytest_cache
    rootdir: /home/phelipe/Documentos/python/tests
    plugins: cov-2.8.1
    collecting ... collected 3 items

    test_assert2.py::test_zero_division FAILED                               [ 33%]
    test_assert2.py::test_recursion_depth FAILED                             [ 66%]
    test_assert2.py::test_set_comparison FAILED                              [100%]

    =================================== FAILURES ===================================
    ______________________________ test_zero_division ______________________________
    test_assert2.py:5: in test_zero_division
        assert 1 / 0
    E   ZeroDivisionError: division by zero
    _____________________________ test_recursion_depth _____________________________
    test_assert2.py:15: in test_recursion_depth
        f()
    test_assert2.py:12: in f
        f()
    test_assert2.py:12: in f
        f()
    E   RecursionError: maximum recursion depth exceeded
    !!! Recursion detected (same locals & position)
    _____________________________ test_set_comparison ______________________________
    test_assert2.py:22: in test_set_comparison
        assert set1 == set2
    E   AssertionError: assert {'3', '8', '1', '0'} == {'3', '8', '0', '5'}
    E     Extra items in the left set:
    E     '1'
    E     Extra items in the right set:
    E     '5'
    E     Full diff:
    E     - {'3', '8', '1', '0'}
    E     ?            -----
    E     + {'3', '8', '0', '5'}
    E     ?               +++++
    ============================== 3 failed in 0.03s ===============================

Now, for the difficult part.

# Writing an errorformat

To make Vim understand these lines so that we can jump to each error, we must
give patterns. It will then go through every line testing against those
patterns. From `:h errorformat`:

> Error format strings are always parsed pattern by pattern until the first
> match occurs.

The order is, thus, important here.

Also, the pattern has to match the entire line. That is to say the pattern is
always implicitly surrounded by a `^` and `$`.

We will need to use `:h errorformat-multi-line` because a single error spans
multiple lines.

I found out that `pytest` gives inconsistent patterns depending on the error
(test failure, missing fixture and syntax error), so I had to handle them
separately.

# Handling test failures

A test failure starts like this:

    ______________________________ TEST_NAME ______________________________

The pattern for this is `%E_%\\+\ %o\ _%\\+`. Notice the overwhelming number of
escape characters needed because I'm passing the pattern as an option value,
like in `:set errorformat=%E_%\\+\ %o\ _%\\+` (see `:h option-backslash` to
understand).

`%E` tells Vim how an error starts. `%o` matches a string and means `module` for
Vim (it's just useful to give more context, the test name will be shown in the
quickfix list in place of the file name).

The error then continues with

    /home/phelipe/test_py.py:5: in test_add

So we add the pattern `%C%f:%l:\ in\ %o`. Where `%f` is filename, `%l` is line
number and `%C` says that this a continuation line.

I'm not really interested in capturing anything else. So I just give a pattern
that will match anything until the end pattern: `%C\ %.%#` (where `%.%#` is the
same as regular expression `.*`).

Now, I need to captura how a test failure ends:

    E   assert 3 == 1

A pattern for that may be `%ZE\ %\\{3}%m`. Where `%Z` is the token for end of
multi-line error.

I also want to filter out all the other lines that didn't match, except the ones
starting with E, so I include `%-G%[%^E]%.%#`. To also exclude empty lines also:
`%-G`.

`%G` has the purpose to capture (when prefixed with `+`) or ignore (when
prefixed with `-`) "general" messages.

The quickfix list will then look like:

    test_zero_division|5|  ZeroDivisionError: division by zero
    test_recursion_depth|15|  RecursionError: maximum recursion depth exceeded
    test_set_comparison|22|  AssertionError: assert {'1', '0', '3', '8'} == {'0', '3', '8', '5'}
    || E     Extra items in the left set:
    || E     '1'
    || E     Extra items in the right set:
    || E     '5'
    || E     Full diff:
    || E     - {'1', '0', '3', '8'}
    || E     ?  -----
    || E     + {'0', '3', '8', '5'}
    || E     ?               +++++

So far, it will understand tests failures but not syntax errors, import errors
and fixture errors, which would fail silently. This is no good.

# Syntax errors

For syntax errors, we need to parse something like this:

    ============================= test session starts ==============================
    platform linux -- Python 3.7.5, pytest-5.3.4, py-1.8.1, pluggy-0.13.1 -- /usr/bin/python3
    cachedir: .pytest_cache
    rootdir: /home/phelipe/Documentos/python/tests
    plugins: cov-2.8.1
    collecting ... collected 0 items / 1 error

    ==================================== ERRORS ====================================
    _______________________ ERROR collecting test_assert2.py _______________________
    ../../../.local/lib/python3.7/site-packages/_pytest/python.py:493: in _importtestmodule
        mod = self.fspath.pyimport(ensuresyspath=importmode)
    ../../../.local/lib/python3.7/site-packages/py/_path/local.py:701: in pyimport
        __import__(modname)
    <frozen importlib._bootstrap>:983: in _find_and_load
        ???
    <frozen importlib._bootstrap>:967: in _find_and_load_unlocked
        ???
    <frozen importlib._bootstrap>:677: in _load_unlocked
        ???
    ../../../.local/lib/python3.7/site-packages/_pytest/assertion/rewrite.py:134: in exec_module
        source_stat, co = _rewrite_test(fn, self.config)
    ../../../.local/lib/python3.7/site-packages/_pytest/assertion/rewrite.py:319: in _rewrite_test
        tree = ast.parse(source, filename=fn)
    /usr/lib/python3.7/ast.py:35: in parse
        return compile(source, filename, mode, PyCF_ONLY_AST)
    E     File "/home/phelipe/Documentos/python/tests/test_assert2.py", line 5
    E       assert 1  0
    E                 ^
    E   SyntaxError: invalid syntax
    !!!!!!!!!!!!!!!!!!!! Interrupted: 1 error during collection !!!!!!!!!!!!!!!!!!!!
    =============================== 1 error in 0.09s ===============================

What matters starts with an E. So this `errorformat` does the job:

    %EE\ \ \ \ \ File\ \"%f\"\\,\ line\ %l,
    %CE\ \ \ %p^,
    %ZE\ \ \ %[%^\ ]%\\@=%m,
    %CE\ %.%#,

The second line has the pattern `%p`, which matches a sequence of `[ -.]` to get
its length to later use as column number.

The end pattern `%ZE %[%^ ]%\@=%m` matches a line starting with E, three spaces
exactly, which is needed to distinguish it from the others, see `:h \@=`.

We also need to include a continuation format (any line starting with E and
space that didn't match the earlier ones).

# Import errors

Import errors are also slightly different:

    ============================= test session starts ==============================
    platform linux -- Python 3.7.5, pytest-5.3.4, py-1.8.1, pluggy-0.13.1 -- /usr/bin/python3
    cachedir: .pytest_cache
    rootdir: /home/phelipe
    plugins: cov-2.8.1
    collecting ... collected 0 items / 1 error

    ==================================== ERRORS ====================================
    _________________________ ERROR collecting test_py.py __________________________
    ImportError while importing test module '/home/phelipe/test_py.py'.
    Hint: make sure your test modules/packages have valid Python names.
    Traceback:
    /home/phelipe/.local/lib/python3.7/site-packages/_pytest/python.py:493: in _importtestmodule
        mod = self.fspath.pyimport(ensuresyspath=importmode)
    /home/phelipe/.local/lib/python3.7/site-packages/py/_path/local.py:701: in pyimport
        __import__(modname)
    /home/phelipe/.local/lib/python3.7/site-packages/_pytest/assertion/rewrite.py:143: in exec_module
        exec(co, module.__dict__)
    /home/phelipe/test_py.py:1: in <module>
        import pytes
    E   ModuleNotFoundError: No module named 'pytes'
    !!!!!!!!!!!!!!!!!!!! Interrupted: 1 error during collection !!!!!!!!!!!!!!!!!!!!
    =============================== 1 error in 0.09s ===============================

It starts with `ImportError while...` so I included `%EImportError%.%#\'%f\'\.`
to capture the filename. It ends with an `E %m` and we already a pattern to
capture this. But we do need to tell how it continues, and it's fine to just put
something that would match anything like `%C%.%#`.

# Fixture errors

Fixture errors are also in a different format:

    _____________________ ERROR at setup of test_zero_division _____________________
    file /home/phelipe/Documentos/python/tests/test_assert2.py, line 4
      def test_zero_division(oi):
    E       fixture 'oi' not found
    >       available fixtures: cache, capfd, capfdbinary, caplog, capsys, capsysbinary, cov, doctest_namespace, monkeypatch, no_cover, pytestconfig, record_property, record_testsuite_property, re
    cord_xml_attribute, recwarn, tmp_path, tmp_path_factory, tmpdir, tmpdir_factory
    >       use 'pytest --fixtures [testpath]' for help on them.

Which can be handled by:

    \%Efile\ %f\\,\ line\ %l,
    \%+ZE\ %mnot\ found,

The line `%+ZE %.%#not found` means that the error will match `E .*not found`,
the preceding `+` will include the whole line as a message.

# Further improvements

Notice how syntax, import and fixture errors are preceded with something like

    ______________________________ ERROR.* ______________________________

Which will match our pattern to catch the start of a test failure. There's an
easy fix for this, just put `%-G_%\\+\ ERROR%.%#\ _%\\+` before that pattern, so
it will ignore it first.

Also, if all tests passed, capture it too:

      \%+G%[=]%\\+\ %*\\d\ passed%.%#,

# Conclusion

Check out the whole [compiler plugin](gist) in my dotfiles repo.

It's tricky to figure out how to order the patterns, which I didn't risk to
explain here since I wouldn't say I fully understand how it works. It was mostly
by trial and error.

But be careful to not put more generic patterns first, because then they will
take precedence and the more specific ones will be ignored. At least, I did this
a lot.

If you're interested, I recommend reading the
[Stack Overflow answer](https://stackoverflow.com/a/29102995) and, of course,
`:h errorformat`.

If you're commited to learn Vim, It's worth it to know about this in order to
integrate a command line program into Vim.

[gist]:
  https://github.com/phelipetls/dotfiles/blob/master/.config/nvim/compiler/pytest.vim
