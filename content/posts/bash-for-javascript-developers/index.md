---
title: Bash for JavaScript developers
date: 2022-07-24
tags: [javascript, react, bash, shell, linux, unix, node]
---

If there is one technology every developer has to deal with, no matter the
stack, is the shell. But most do not bother learning it, so in this post we'll
dive deep into one of the most common shells, Bash, by comparing it with a more
familiar programming language to most developers, JavaScript.

{{< note >}}

# What is a shell, anyway?

This is often subject of confusion initially, so I want to clear things before
we go any further.

A shell is an interface to your operating system, a way for you to tell your
computer to run a program and do something.

Bash is just one of many shells, it happens to be the default shell in most
Linux systems, but you may also be familiar with zsh, the default on macOS, and
PowerShell or cmd.exe, the default on Windows.

Each shell is different: they may have different features, like autocomplete,
and scripting language capabilities, like regex support.

Bash is considered to be a more powerful shell than `/bin/sh`, the Bourne Shell
that Bash aims to replace (Bourne Again Shell), but less powerful, as
interactive shell, than zsh and [fish](https://fishshell.com/).

**A terminal is different than a shell**. The way I understand it, a terminal
handles sending and showing data, while a shell interprets them. It used to be
a [hardware device](https://en.wikipedia.org/wiki/Computer_terminal), but now
we use terminal emulators for similar functionality (Alacritty, iTerm, Windows
Terminal are commonly used terminal emulators).

{{< /note >}}

# Hello World

Let's start with the "Hello World" program in both languages:

{{< tabs tabs="Bash JavaScript" id="hello-world" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
echo Hello World
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
console.log("Hello World")
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

In Bash, the equivalent of JavaScript's
[`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)
is the command `echo`, to which we just passed the words `Hello World` as
arguments and promptly got them printed back.

A correct understanding of what is a "command" and an "argument" is crucial to
use Bash as a scripting language. This is already very well explained by the
article [Commands and
Arguments](https://mywiki.wooledge.org/BashGuide/CommandsAndArguments) at
Greg's Wiki, but I'll try to summarize the most important concepts in the next
section.

# Quoting and whitespace

The correct way to understand the line `echo Hello World` is that `echo` is the
command and `Hello` and `World` are two separate arguments passed to that
command.

{{< note >}}

Bash does not magically know what is `echo`, that's just the name of an
executable file in your computer, but Bash is able to find it without the need
of the full absolute path (usually `/usr/bin/echo`) because the directory it is
located in (`/usr/bin`) is in your `$PATH` environment variable. The command
might also be a shell builtin command, i.e., not an executable. `echo` happens
to be available in both forms.

{{< /note >}}

Each argument is delimited by whitespace (spaces and tabs), no matter how many
whitespace between them:

```bash
% echo Hello World
Hello World
% echo Hello          World
Hello World
```

If we want to print the extra whitespace between arguments, we need to
**escape** the whitespace characters of their special meaning as
argument-delimiter. Here are two ways to do this, with backslash and quotes:

```bash
% echo Hello\ \ \ \ \ \ \ \ \ \ World
Hello          World
% echo "Hello          World"
Hello          World
% echo 'Hello          World'
Hello          World
```

# Standard output

The manual page for `echo`, which you can check with [`man
echo`](https://linux.die.net/man/1/echo), has the following description:

> Echo the STRING(s) to standard output.

The concept of "standard output" (`stdout`) might be unfamiliar, but in
practice we know that it means the string will show up in the terminal.

Technically, though, it is a [file
descriptor](https://mywiki.wooledge.org/FileDescriptor), a file that is opened
by default for every process. Each file descriptor is associated with a number,
and that's how we reference them in scripts: `stdout` is `1`. So, what `echo`
does is to write the string we pass to it to that file, which causes us to see
it in our terminal (somehow).

# Standard Error

There is also standard error (`stderr`, or `2`), which is meant to store error
messages. It's similar to
[`console.error`](https://developer.mozilla.org/en-US/docs/Web/API/console/error).

In practice, when we send something to `stderr` it will also show up in the
terminal. But the two are distinguishable.

# Standard input

`stdin` is another default file descriptor, used to read input from the user or
from a command. In Bash, you can use the `read` command to get input from the
user, and [in Node.js the readline
module](https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/).

We'll look how to do this later, since we need to introduce other concepts
first.

# Redirections

We saw that `echo` simply sends a string to `stdout`, but that might not be
what we want. That string could be an error message, in which case we'd want to
send it to `stderr`, or we might want to send it to a file. What then?

We can use [redirections](https://mywiki.wooledge.org/Redirection).

For instance, here's how to redirect a command's `stdout` to a file:

```shell-session
$ echo "Hello World" > file
$ echo "Hello World" > file
$ cat file
Hello World
$ # We can also append
$ echo "Second Hello World" >> file
$ cat file
Hello World
Second Hello World
```

And here's how to redirect `echo`'s `stdout` to `stderr`:

```shell-session
$ echo "An error occurred" >&2
An error occurred
```

We can suppress error messages too, by redirecting what a command writes to
`stderr` to `/dev/null`:

```shell-session
$ (echo "An error occurred" >&2) 2>/dev/null
```

The syntax used for redirections is cryptic though, so I won't dive much deeper
into it than that. I just mention it because it's inevitable that it will come
up eventually.

# Variables

Here's how to create a variable in Bash.

{{< tabs tabs="Bash JavaScript" id="variables" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
  foo=bar
  foo = bar # this won't work
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
  var foo = "bar"
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

Pay attention to the syntax used for assignment -- `foo = bar` won't work,
`foo` will, instead, be interpreted as a command and `= bar` as arguments.

Variables may also be called parameters, or, better saying, they're a special
type of parameters, a named parameter.

Bash has built-in variables, like `$HOME` and `$BASH_VERSION`, and special
parameters, like `$_` which holds the last argument passed to the last executed
command.

# Parameter expansion

Parameter expansion is simply the usage of a value that a variable holds, for
instance:

```shell-session
$ foo=bar
$ echo $foo
bar
$ echo ${foo}
bar
```

## String interpolation

Here's how to do string interpolation:

{{< tabs tabs="Bash JavaScript" id="string-interpolation" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
$ foo=bar
$ echo "Here is the content of: $foo"
Here is the content of: bar
$ echo "This is also valid: ${foo}"
This is also valid: bar
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
var foo = "bar"
console.log(`Here is the content of: ${foo}`)
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

Parameter expansion won't work within single quotes:

```bash
$ echo 'Here is the content of: $foo'
Here is the content of: $foo
```

As we've seen, quotes are used to escape characters in Bash, but single and
double quotes differ in behavior. Single quotes are more aggressive at escaping
characters, e.g., `$` is treated as the literal value `$`, it doesn't have a
special meaning. Double quotes are less aggressive, being most useful to escape
the special meaning of whitespace.

There are much more differences, but they are too many for us to explore here
and [Stack Overflow already did a good job doing
so](https://stackoverflow.com/questions/6697753/difference-between-single-and-double-quotes-in-bash).

## Command substitution

Here's how to store a command's output into a variable:

```shell-session
$ foo=$(echo bar)
$ echo "\$foo is $foo, but this gives us the same result: $(echo $foo)"
$foo is bar, but this gives us the same result: bar
```

## Parameter expansion tricks

[Parameter expansion syntax allows for a bunch of
tricks](https://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion)
that goes from providing a default or alternative values to manipulating the
value.

For example, the syntax `${parameter:-word}` allows you to use `word` as a
default value in case `$parameter` is unset or null:

{{< tabs tabs="Bash JavaScript" id="default-values" >}}
{{< tab "Bash" >}}
{{< highlight shell-session >}}
$ foo=${SOME_GLOBAL_VARIABLE:-default}
$ echo $foo
default
{{< /highlight >}}
{{< /tab >}}

{{< tab "JavaScript" >}}
{{< highlight jsx "hl_lines=10" >}}
> var foo = window.SOME_GLOBAL_VARIABLE || 'default'
undefined
> foo
'default'
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

This is useful when a variable is populated in CI environment only, but you
want to provide a fallback value when running locally:

```bash
export ENVIRONMENT=${CI_ENVIRONMENT_NAME:-local}
```

# Arithmetic expressions

You will be surprised to learn that arithmetic expressions do not simply work
in Bash:

```shell-session
$ foo=1+2
$ echo $foo
1+2
```

We have to use some special syntax:

```shell-session
$ foo=$(( 1+2 ))
$ echo $foo
3
```

# Exit codes

There are no boolean values in Bash, but the commands `true` and `false` do
exist. They apparently don't do anything, though:

```shell-session
$ true
$ false
```

They don't print anything, but they do something useful: they have different
**exit code**.

The `true` command's exit code is `0`, which by convention denotes success,
while `false`'s exit code is `1`, which denotes failure (is non-zero). The
special parameter `$?` gives us the last executed command's exit code.

```shell-session
$ true
$ echo $?
0
$ false
$ echo $?
1
```

I think it's ok to understand command's exit code as the shell's boolean
values, it's the way we can tell if everything went OK or if something bad
happened.

For instance, ESLint exits with `0` if everything was OK, `1` if something went
wrong and `2` if the configuration is broken. Here's the [documentation on
ESLint's exit
codes](https://eslint.org/docs/latest/user-guide/command-line-interface#exit-codes)
for more details.

# Conditionals

We know and use a lot the `||`, `&&` and `!` operators to manipulate boolean
expressions in JavaScript:

```javascript
> true && false
false
> false && true
false
> true || false
true
> false || true
true
> !true
false
```

A common pattern in React is to conditionally render a component using
short-circuit evaluation, which [relies on the fact that booleans are ignored
in
JSX](https://reactjs.org/docs/jsx-in-depth.html#booleans-null-and-undefined-are-ignored):

{{< react path="short-circuit-react.jsx" hl_options=`hl_Lines=[11]` >}}

Similarly in Bash, we can conditionally execute a command if the previous
command's exit code is `0` by using the same operator `&&`:

```shell-session
$ true && echo "I will be executed"
I will be executed
$ false && echo "I won't be executed"
```

We could also execute a fallback command in case the previous command failed
with the control operator `||`:

{{< tabs tabs="Bash JavaScript" id="logical-or" >}}
{{< tab "Bash" >}}
{{< highlight shell-session >}}
$ rm "song.mp3" || echo "Couldn't remove $_ because it doesn't exist"
rm: cannot remove 'song.mp3': No such file or directory
Couldn't remove song.mp3 because it doesn't exist
{{< /highlight >}}
{{< /tab >}}

{{< tab "JavaScript" >}}
{{< highlight jsx "hl_lines=10" >}}
import { useState } from 'react'

export function App() {
  const [name, setName] = useState('')

  return (
    <>
      <input onChange={(e) => setName(e.target.value)} />

      {`Your name is ${name}` || 'Please, enter your name'}
    </>
  )
}
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

It's also possible to negate (or invert) a command's exit code with `!`.

```shell-session
$ ! true
$ echo $?
1
$ ! false
$ echo $?
0
```

Of course, using `true` and `false` commands is not very useful per se, we
actually need to check for something, like if a number is equal to 10 or if the
string `foo` is inside `$bar`.

## Comparing numbers

Here are some common ways to compare two numbers:

{{< tabs tabs="Bash JavaScript" id="conditionals-numbers" >}}
  {{< tab "Bash" >}}
{{< highlight shell-session >}}
$ num=1
$ [[ $num == 1 ]] && echo "$num is equal to 1"
1 is equal to 1
$ [[ $num != 10 ]] && echo "$num is different than 10"
1 is different than 10
$ [[ $num > 0 ]] && echo "$num is greater than 0"
1 is greater than 0
$ [[ $num < 10 ]] && echo "$num is less than 10"
1 is less than 10
$ [[ $num >= 0 ]] && echo "$num is greater than or equal to 0"
1 is greater than or equal to 0
$ [[ $num <= 10 ]] && echo "$num is less than or equal to 10"
1 is less than or equal to 10
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
> var num = 1
> num === 1 ? `${num} is equal to 1` : ''
'1 is equal to 1'
> num != 10 ? `${num} is different than 10` : ''
'1 is different than 10'
> num > 0 ? `${num} is greater than 0` : ''
'1 is greater than 0'
> num < 10 ? `${num} is less than 10` : ''
'1 is less than than 10'
> num >= 0 ? `${num} is greater than or equal to 0` : ''
'1 is greater than or equal to 0'
> num <= 10 ? `${num} is less than or equal to 10` : ''
'1 is less than or equal to 10'
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

{{< warn >}}

The `[[` command is a Bash feature, or a
[Bashism](https://mywiki.wooledge.org/Bashism), the examples provided won't
work in `/bin/sh` because `<` and `>` are used for redirections and are no
especially treated when inside `[[` by the Bourne Shell.

The most POSIX-compliant way of writing a conditional is to use the command `[`
(or `test`). `[` is similar to `[[`, but with less features. Read [`man
test`](https://linux.die.net/man/1/test) for more information.

{{< details "Click to see the same examples but using the `[` command." >}}

```shell-session
$ num=1
$ [ "$num" = 1 ] && echo "$num is equal to 1"
1 is equal to 1
$ [ "$num" != 10 ] && echo "$num is different than 10"
1 is different than 10
$ [ "$num" -gt 0 ] && echo "$num is greater than 0"
1 is greater than 0
$ [ "$num" -lt 10 ] && echo "$num is less than 10"
1 is less than 10
$ [ "$num" -ge 0 ] && echo "$num is greater than or equal to 0"
1 is greater than or equal to 0
$ [ "$num" -le 10 ] && echo "$num is less than or equal to 10"
1 is less than or equal to 10
```

{{< /details >}}

There are other differences between `[[` and `[` that will need your attention,
particularly around parameter expansion and quoting, but they're best explained
by Greg's Wiki article [Conditional Blocks (if, test and
\[\[)](https://mywiki.wooledge.org/BashGuide/TestsAndConditionals#Conditional_Blocks_.28if.2C_test_and_.5B.5B.29).

{{< /warn >}}

## Comparing strings

And here are some common ways to compare strings, including regex:

{{< tabs tabs="Bash JavaScript" id="conditionals-string" >}}
  {{< tab "Bash" >}}
{{< highlight shell-session >}}
$ foobar="foo bar"
$ #mnemonic: is length *z*ero?
$ [[ -z "$foobar" ]] && echo '$foobar is empty' || echo '$foobar is not empty'
$foobar is not empty
$ #mnemonic: is length *n*ot zero?
$ [[ -n "$foobar" ]] && echo '$foobar is not empty' || echo '$foobar is empty'
$foobar is not empty
$ [[ "$foobar" == "foo bar" ]] && echo "\$foobar is equal to 'foo bar'" || echo "\$foobar is not equal to 'foo bar'"
$foobar is equal to 'foo bar'
$ [[ "$foobar" =~ "^foo" ]] && echo "\$foobar starts with 'foo'"
$foobar starts with 'foo'
$ [[ "$foobar" =~ "bar$" ]] && echo "\$foobar ends with 'bar'"
$foobar ends with 'bar'
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
> var foobar = 'foo bar'
> foobar === '' ? '$foobar is empty' : 'foobar is not empty'
'foobar is not empty'
> foobar !== '' ? '$foobar is not empty' : 'foobar is empty'
'$foobar is not empty'
> foobar === "foo bar" && "$foobar is equal to 'foo bar'"
"$foobar is equal to 'foo bar'"
> foobar.match(/^foo/) && "$foobar starts with 'foo'"
"$foobar starts with 'foo'"
> foobar.match(/bar$/) && "$foobar ends with 'bar"
"$foobar ends with 'bar"
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

{{< warn >}}

regex is tricky, there a bunch of different flavors, and the one used by Bash
is certainly not the same one used by JavaScript engines. This might be a
source of friction when writing shell scripts.

{{< /warn >}}

## Glob patterns

A glob pattern is possibly one of the best shell features. Let's look at some
examples.

```shell-session
$ [[ "foo bar" == foo* ]] && echo "'foo bar' starts with 'foo'"
'foo bar' starts with 'foo'
$ [[ "foo bar" == *bar ]] && echo "'foo bar' ends with 'bar'"
'foo bar' ends with 'bar'
$ [[ "foo?bar" == *bar ]] && echo "there is a character between 'foo' and 'bar'"
there is a character between 'foo' and 'bar'
$ [[ "foo[ ]bar" == *bar ]] && echo "there is a space between 'foo' and 'bar'"
there is a space between 'foo' and 'bar'
```

You'll notice that `*` means "any (or many) character", `?` means "any single
character" and `[ ]` a set of character, which kind of regex-like.

They are much more feature-rich, but let's stop here for now, but [you can read
more about globs here](https://mywiki.wooledge.org/BashGuide/Patterns).

## Conditional blocks

Bash also has something more similar to `if` statements in JavaScript:

{{< tabs tabs="Bash JavaScript" id="if-statement" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
if true; then
  echo "This will be printed."
elif false; then
  echo "This is unreachable."
else
  echo "This is also unreachable."
fi
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
if (true) {
  console.log("This will be printed.")
} else if (false) {
  console.log( "This is unreachable.")
} else {
  console.log("This is also unreachable.")
}
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

In Bash, we just just need to pass an arbitrary command, such as `true`, after
the `if` or `elif`, and Bash will execute the `then` block if the command's
exit code is `0` and the `else` or `elif` block otherwise.

# Switch statement

The JavaScript `switch` statement equivalent in Bash is called `case`. Because
my creativity is lacking right now, let's use the example in [MDN's
documentation page about
switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch).

{{< tabs tabs="Bash JavaScript" id="switch-statement" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
expr=Papayas
case $expr in
  Oranges)
    echo "Oranges are \$0.59 a pound."
    ;;
  Mangoes|Papayas)
    echo "Mangoes and papayas are \$2.79 a pound."
    ;;
  *)
    echo "Sorry, we are out of $expr."
    ;;
esac
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
const expr = 'Papayas';
switch (expr) {
  case 'Oranges':
    console.log('Oranges are $0.59 a pound.');
    break;
  case 'Mangoes':
  case 'Papayas':
    console.log('Mangoes and papayas are $2.79 a pound.');
    break;
  default:
    console.log(`Sorry, we are out of ${expr}.`);
}
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

Bash's `case` command looks more convenient than JavaScript switch statement
though, for example, we don't need to reach for the ugly `switch (true)`
pattern:

{{< tabs tabs="Bash JavaScript" id="switch-true-pattern" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
case "$file" in
  *.jpg|*.jpeg)
    echo "$file is a jpg image"
    ;;
  *.png)
    echo "$file is a png image"
    ;;
  *.pdf)
    echo "$file is a pdf"
    ;;
  *)
    echo "$file has unknown extension"
    ;;
esac
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
switch (true) {
  case file.endsWith('jpg') || file.endsWith('jpeg'):
    console.log(`${file} is a jpg image`);
    break;
  case file.endsWith('png'):
    console.log(`${file} is a png image`);
    break;
  case file.endsWith('pdf'):
    console.log(`${file} is a pdf`);
    break;
  default:
    console.log(`${file} has unknown extension`);
}
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

# Loops

Bash has the same loop constructs than JavaScript, i.e., `for`, `while` etc.,
but we'll just cover `for` here.

Let's start by counting from number `0` to `n`:

{{< tabs tabs="Bash JavaScript" id="for-loop" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
n=10

for (( i=0; i < n; i++ )); do
  echo "$i"
done
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
var n = 10

for (let i = 0; i < n; i ++) {
  console.log(i)
}
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

This loop syntax is the most JavaScript-like, but rather unusual in my
experience. It's more usual to use loops in Bash that will iterate through
plain words:

```bash
for i in 0 1 2 3 4 5 6 7 8 9; do
  echo "$i"
done
```

But since we're programmers, we can't expect to give a hard-coded list of words
for a loop. Brace expansion can help us to generate a dynamic sequence of
numbers:

```bash
for i in {0..9}; do
  echo "$i"
done
```

But it's not possible to use something like `{0..$n}`, we have to use the `seq`
command for this:

```bash
for i in $(seq 0 $(( n - 1))); do
  echo "$i"
done
```

# Arrays

Bash has arrays too:

{{< tabs tabs="Bash JavaScript" id="arrays" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
$ fruits=(banana apple pear)
$ echo "The first fruit is ${fruits[0]}"
The first fruit is banana
$ echo "The last fruit is ${fruits[-1]}"
The last fruit is pear
$ for fruit in "${fruits[@]}"; do
>  echo "$fruit is a fruit"
> done
banana is a fruit
apple is a fruit
pear is a fruit
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
var fruits = ["banana", "apple", "pear"]

console.log(`The first fruit is ${fruits[0]}`)

console.log(`The last fruit is ${fruits[fruits.length - 1]}`)

for (const fruit of fruits) {
  console.log(`${fruit} is a fruit`)
}
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

# Associative arrays

Associative arrays in Bash are like JavaScript objects, if you choose to view
them like a key-value pair collection.

I still have to find usage for them as a JavaScript developer that occasionally
has to deal with Bash, but let's look how to use them anyway:

{{< tabs tabs="Bash JavaScript" id="associative-arrays" >}}
  {{< tab "Bash" >}}
{{< highlight shell-session >}}
$ declare -A user
$ user=(name "Phelipe Teles" age "26")
$ echo "user's name is ${user[name]}"
user's name is Phelipe Teles
$ for key in "${!user[@]}"; do echo "user's $key is ${user[$key]}"; done
user's age is 26
user's name is Phelipe Teles
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
> var user = {name: "Phelipe Teles", age: "26"}
> `user's name is ${user.name}`
"user's name is Phelipe Teles"
> for (const key of Object.keys(user)) {
... console.log(`user's ${key} is ${user[key]}`)
... }
user's name is Phelipe Teles
user's age is 26
undefined
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

You'll notice that we had to use `declare -A user` to tell Bash that this
variable should be treated as an associative array, otherwise Bash wouldn't be
able to distinguish it from simply being an array of strings.

# Fizz buzz

Let's combine what we've learned so far and implement Fizz buzz in both Bash
and JavaScript.

{{< tabs tabs="Bash JavaScript" id="fizzbuzz" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
n=15

for (( i=1; i <= n; i++ )); do
  if [[ $(( "$i" % 3 )) == 0 && $(( "$i" % 5 )) == 0 ]]; then
    echo "FizzBuzz"
  elif [[ $(( "$i" % 3 )) == 0 ]]; then
    echo "Fizz"
  elif [[ $(( "$i" % 5 )) == 0 ]]; then
    echo "Buzz"
  else
    echo "$i"
  fi
done
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
var n = 15

for (let i = 1; i <= n; i++) {
  if ((i % 3) == 0 && (i % 5) == 0) {
    console.log("FizzBuzz")
  } else if ((i % 3) == 0) {
    console.log("Fizz")
  } else if ((i % 5) == 0) {
    console.log("Buzz")
  } else {
    console.log(i)
  }
}
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

# Functions

We can reuse logic with functions in Bash. Bash functions do not have named
parameters, only positional parameters, accessible via special parameters `$1`,
`$2` and so on.

Let's refactor our Fizz buzz implementation to illustrate how to use functions:

{{< tabs tabs="Bash JavaScript" id="fizzbuzz-with-functions" >}}
  {{< tab "Bash" >}}
{{< highlight bash "hl_lines=3-9 12 14 16" >}}
n=15

function is_divisible_by_3() {
  [[ $(( $1 % 3 )) == 0 ]]
}

function is_divisible_by_5() {
  [[ $(( $1 % 3 )) == 0 ]]
}

for (( i=1; i <= n; i++ )); do
  if is_divisible_by_3 "$i" && is_divisible_by_5 "$i"; then
    echo "FizzBuzz"
  elif is_divisible_by_3 "$i"; then
    echo "Fizz"
  elif is_divisible_by_5 "$i"; then
    echo "Buzz"
  else
    echo "$i"
  fi
done
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript "hl_lines=3-9 12 14 16" >}}
var n = 15

function isDivisibleBy3(i) {
  return i % 3 === 0
}

function isDivisibleBy5(i) {
  return i % 5 === 0
}

for (let i = 1; i <= n; i++) {
  if (isDivisibleBy3(i) && isDivisibleBy5(i)) {
    console.log("FizzBuzz")
  } else if (isDivisibleBy3(i)) {
    console.log("Fizz")
  } else if (isDivisibleBy5(i)) {
    console.log("Buzz")
  } else {
    console.log(i)
  }
}
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

You'll notice that calling a function in Bash is no different than executing a
command: `is_divisible_by_5 "$i"`, not `is_divisible_by_5("$i")`.

Also, we didn't use any `return` statements in Bash, we didn't need to: the
last executed command's exit code was used as the function exit code. This is
unlike JavaScript, since it does not have implicit return. Bash does have
`return` though, but they'd just make our function more verbose in this case:

```bash
function is_divisible_by_3() {
  if [[ $(( $1 % 3 )) == 0 ]]; then
    return 0
  else
    return 1
  fi
}
```

# Scripts

Until now, we have been executing commands in the command line. Let's instead
create a script, a text file containing Bash code we can execute.

We first need to create a text file with some code in it, say `echo "Hello
World"`:

```shell-session
$ echo 'echo "Hello World"' > my-script.sh
$ cat my-script.sh
echo "Hello World"
```

Then, we can execute it like this:

```shell-session
$ bash my-script.sh
Hello World
```

Which is fine, but not the usual approach -- the programs you execute don't
usually have extension and you don't have to pass them to bash as argument, you
execute them directly.

To do this, we just need to create the `my-script` file, without extension, and
execute it like a normal command (notice we have to pass the script absolute
path, `./my-script`):

```shell-session {hl_lines="[5]"}
$ echo 'echo "Hello World"' > my-script
$ cat my-script
echo "Hello World"
$ ./my-script
bash: ./my-script: Permission denied
```

That won't work though because the file does not have permission to be
executed. We can grant permission for the current user to execute a file with
the `chmod` command:

```shell-session
$ chmod u+x my-script
$ ./my-script
Hello World
```

# Shebang

When the command `./my-script` is executed, the shell you're using, be it bash
or zsh, will simply run the code in it. We can tell the operating system that
this script should always be interpreted by bash with a shebang, a comment-like
line at the start of the file:

```bash
#!/bin/bash
echo "Hello World from Bash ${BASH_VERSION}"
```

Now, it doesn't matter if I'm using zsh or bash, the OS will use the program
`/bin/bash` to interpret the code.

```shell-session
% zsh
% ./my-script
Hello World from Bash 5.1.16(1)-release
% bash
$ ./my-script
Hello World from Bash 5.1.16(1)-release
```

Similarly, we can tell the OS to always execute a file with `node`:

```javascript
#!/bin/env node
console.log("Hello World from Node.js")
```

We use the `env` program to find the `node`'s path because it's usually in a
more dynamic place, depending on your OS or node version manager.

# Script arguments

A Bash script may take arguments to accomplish a task. Here's how we can handle
them in Bash and Node.js:

{{< tabs tabs="Bash JavaScript" id="script-args" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
#!/bin/bash
echo "Script name is $0"
echo "First argument: ${1:-empty}"
echo "Second argument: ${2:-empty}"
echo "All arguments: $*"
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
#!/bin/env node
console.log(`Script name is ${process.argv[0]}`)
console.log(`First argument: ${process.argv[1] || 'empty'}`)
console.log(`Second argument: ${process.argv[2] || 'empty'}`)
console.log(`All arguments: ${process.argv.join(' ')}`)
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

# Reading from `stdin`

Let's modify our Fizz buzz implementation to get `n` from `stdin`:

{{< tabs tabs="Bash JavaScript" id="fizzbuzz-from-stdin" >}}
  {{< tab "Bash" >}}
{{< highlight bash "hl_lines=1" >}}
read -p "Insert a non-negative integer, please: " n

function is_divisible_by_3() {
  [[ $(( $1 % 3 )) == 0 ]]
}

function is_divisible_by_5() {
  [[ $(( $1 % 3 )) == 0 ]]
}

for (( i=1; i <= $n; i++ )); do
  if is_divisible_by_3 $i && is_divisible_by_5 $i; then
    echo "FizzBuzz"
  elif is_divisible_by_3 $i; then
    echo "Fizz"
  elif is_divisible_by_5 $i; then
    echo "Buzz"
  else
    echo "$i"
  fi
done
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript "hl_lines=1-6 16 29" >}}
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function isDivisibleBy3(i) {
  return i % 3 === 0
}

function isDivisibleBy5(i) {
  return i % 5 === 0
}

rl.question('Insert a non-negative integer, please: ', (n) => {
  for (let i = 1; i <= n; i++) {
    if (isDivisibleBy3(i) && isDivisibleBy5(i)) {
      console.log('FizzBuzz')
    } else if (isDivisibleBy3(i)) {
      console.log('Fizz')
    } else if (isDivisibleBy5(i)) {
      console.log('Buzz')
    } else {
      console.log(i)
    }
  }

  rl.close()
})
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

# Signals

Image we might want to do something before our script gets interrupted. In Unix
systems, this happens because the process opened by the program received a
`SIGINT` signal, described as "Interrupt from keyboard" by [`man
signal(7)`](https://man7.org/linux/man-pages/man7/signal.7.html), which is
usually what happens when you press <kbd>Ctrl</kbd> + <kbd>c</kbd> while a
program is running.

If we wish to handle this signal differently, we can use the `trap` builtin
command. For example, here's a script that forever echoes "Loading...", but
upon interruption it says goodbye and exit.

{{< tabs tabs="Bash JavaScript" id="signals" >}}
  {{< tab "Bash" >}}
{{< highlight bash >}}
#!/bin/bash
function close() {
  echo "Ok. Bye :)"
  exit 0
}

trap "close" "SIGINT"

while true; do
  echo "Loading..."
  sleep 1
done
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
#!/bin/env node
process.on('SIGINT', () => {
  console.log( "Ok. Bye :)")
  process.exit(0)
})

console.log("Loading...")

setInterval(() => {
  console.log("Loading...")
}, 1000)
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}


```shell-session
$ ./long-running-script
Wait... I'm thinking
Wait... I'm thinking
Wait... I'm thinking
Wait... I'm thinking
^COk. Bye :)
```

Signals are a very important component of Unix systems, it's how processes
communicate with each other. There are a bunch more, for example, others
similar to `SIGINT` are `SIGTERM` to ask the process to terminate, `SIGKILL` to
hard-kill processes -- kills it immediately and the program cannot handle it
differently.

# Pipes

A pipe is a way for us to combine commands to accomplish a task. It works by
passing the previous command's stdout as stdin for the next command in the
pipeline.

For example, we can combine the `echo` and `cut` command to get the second
field from a comma-delimited string:

{{< tabs tabs="Bash JavaScript" id="echo-and-cut" >}}
  {{< tab "Bash" >}}
{{< highlight shell-session >}}
$ echo "Apple,Oranges,Pear" | cut -d, -f 2
Oranges
{{< /highlight >}}
  {{< /tab >}}

  {{< tab "JavaScript" >}}
{{< highlight javascript >}}
"Apple,Oranges,Pear".split(',')[1]
{{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

There's no equivalent in JavaScript, but as of time of writing there's a
[proposal in stage 2 to add Hack-style pipes to
ECMAScript](https://tc39.es/proposal-pipeline-operator/), which offers a
similar syntax to compose functions.

# Conclusion

I hope this post helped you understand how to work with Bash to do basic tasks.

To be proficient with Bash though, you'll need to study more about the most
common Unix commands, such as `grep`, `sed`, `cut`, `xargs`, `tr`, and others.
