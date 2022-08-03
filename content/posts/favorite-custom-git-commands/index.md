---
title: "My favorite custom git commands"
date: 2022-08-03
tags: [git]
---

In this post I want to share my favorite custom git commands -- from aliases to
shell scripts.

<!--more-->

# git recent

[`git recent` is an
alias](https://github.com/phelipetls/dotfiles/blob/7b1d9f14debdeef1f1fd0b6603f1d116504ff1f3/.gitconfig#L29)
to list the most recent branches:

```plaintext
[alias]
  recent = branch -v --sort=-committerdate
```

It works by listing branches sorted by commit date, in descending order.

# git undo

`git undo` is an alias to undo the last commit:

```plaintext
[alias]
  undo = reset --soft HEAD^
```

It works by using the `git reset` command, which makes the tip of the branch
point to a git revision (a commit reference).

Our goal is to undo the last commit, so we need a revision to the commit before
the current one, which is what `HEAD^` means.

{{< note >}}

According to manual page for [git
revisions](https://git-scm.com/docs/gitrevisions), `^` "means the first parent
of that commit object" and `HEAD` "the commit on which you based the changes in
the working tree".

{{< /note >}}

The `--soft` option is to keep the undone commit's changes in the staging area.

I use this command most often when rebasing, e.g. to [remove a file from a
commit]({{< ref "/posts/demystifying-git-rebase#remove-a-file-from-a-commit"
>}}) or to split commits.

The `undo` name may be misleading, since it's not a general purpose undo [like
the one from git-branchless](https://blog.waleedkhan.name/git-undo/) -- it's a
lot simpler.

# git recommit

`git recommit` is an alias I use to make a commit while reusing the undone
commit's message.

```plaintext
[alias]
  recommit = commit --reedit-message ORIG_HEAD
```

It works by using the symbolic ref name `ORIG_HEAD`, described by [`man
gitrevisions`](https://git-scm.com/docs/gitrevisions) as:

> ORIG_HEAD is created by commands that move your HEAD in a drastic way, to
> record the position of the HEAD before their operation [...].

`git reset` is one of such commands that "move your HEAD in a drastic way".
That's why I often it after `git undo`.

# git spinoff

You know when you're working on a feature for a while, and later realize that
committed into `main` the whole time?

[Magit](https://magit.vc/) has a command to help you with this, called
[`magit-branch-spinoff`](https://magit.vc/manual/magit/Branch-Commands.html).

> This command creates and checks out a new branch starting at and tracking the
> current branch. That branch in turn is reset to the last commit it shares
> with its upstream. [...] This is useful to create a feature branch after work
> has already began on the old branch (likely but not necessarily "master"). 

But for those of use that don't use Emacs, there's
[git-toolbelt](https://github.com/nvie/git-toolbelt/), a collection of
git-related shell scripts, including [`git
spinoff`](https://github.com/nvie/git-toolbelt/blob/main/git-spinoff)!

The API works like `git checkout -b`, i.e. you need to pass the name of the new
branch (and an optional base -- usually it'll be `main`).

```plaintext
usage: git spinoff [-h] <new-name> [<base>]
```

{{< note >}}

`git spinoff` is not an alias, but a shell script. To be able to run it with
`git spinoff`, download it and put it in your `PATH`:

```shell-session
$ git clone https://github.com/nvie/git-toolbelt/
$ echo "export PATH="$PATH:$PWD/git-toolbelt" >> ~/.bash_profile
```

{{< /note >}}

# git cb

`git cb` is a script that combines [fzf](https://github.com/junegunn/fzf) and
`git recent` to give a nice interface to **c**hange **b**ranches.

```bash {hl_lines=["4"]}
#!/bin/bash
set -eu

branch=$(git recent --format '%(refname:short)' | fzf --height 40% --preview 'git log --oneline {}')

if [[ -n "$branch" ]]; then
  git checkout "$branch"
fi
```

It's a good idea to combine fzf with git when a workflow requires you to select
a commit from a list.

{{< video src="./git-cb.webm" caption="The script git-cb running in the terminal" >}}
