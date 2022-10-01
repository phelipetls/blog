---
title: Demystifying git rebase
date: 2022-04-06
tags: ["git"]
---

`git rebase` is a command for rewriting history, which sure seems scary at
first but you'll learn to love it.

# Why learn `git rebase`?

As a beginner, I remember being hard to understand what rebase even was. I
can't quite articulate why, but I'm guessing because I didn't see when I would
need to use it.

It turns out you *don't need rebase* for most of your daily tasks, you can work
just fine knowing the basics, pull-add-commit-push.

`git rebase` is very similar to `git merge`, in that you can also use it to get
the latest commits in an upstream branch. But, other than that, you'll also use
it to:

- change the order of commits.
- join commits.
- split a commit.
- edit a commit, e.g. to remove an accidentally committed `.env` file.
- edit a commit message.
- delete a commit.

This is most commonly used to tidy up the commit history. And that's it, that's
the major reason why I use rebase, to organize my commit history.

In this blog post, I'll try to explain what rebase is with examples of how I
use it daily.

# Understanding `git rebase`

`git rebase` tries to replay a bunch of commits on top of another branch.

Let's imagine you're working on a feature branch and the main branch was
updated with some code you want:

```
      E---F---G feature
     /
A---B---C---D main
```

You can run `git rebase main`, with the feature branch checked out, to achieve the
following result:

```
              E'---F'---G' feature
             /
A---B---C---D main
```

The commits `E`, `F` and `G` are now different. They are different commits,
their hash changed, because their parent commit changed.

This is similar to `git merge main`, but the resulting branch is cleaner
because the history is linear: it looks like you never branched off of an old
commit of the main branch.

# Reasons to be afraid of rebase

Because rebase implies changing the commit identity (their hash), you should
never rebase public commit history, meaning a commit history that someone else
might have worked on.

To illustrate, let's imagine a feature branch that you have pushed to remote:

```
              E---F feature
             /
A---B---C---D main
```

For some reason, a co-worker decided to collaborate and added one more commit:

```
              E---F---G feature
             /
A---B---C---D main
```

But, before he did it, you decided to rebase your branch, maybe because you
wanted to improve `E`'s commit message, and pushed it.

```
              E'---F' feature
             /
A---B---C---D main
```

Now, your co-worker will not be able to push their changes, because the `G`
commit was made on top of `F`, but it's gone from the remote branch.

git will tell your coworker that his changes were
rejected because "remote contains work that you do not have locally. [...] You
may want to first integrate the remote changes".

He could use `git force --push`, but things would only get worse because he
would've thrown away your work. Now that the damage is done, you should refer
him to the [`RECOVERING FROM UPSTREAM
REBASE`](https://git-scm.com/docs/git-rebase#_recovering_from_upstream_rebase)
section available in the `git-rebase` man page.

# Reasons NOT to be afraid of rebase

You shouldn't be afraid of losing work -- if you committed your code, it's very
hard to lose it.

Even if you did mess things up, you can always search a previous known good
state of your branch with `git reflog feature` or `git reflog HEAD`, and then
reset to that state, e.g. `git reset --hard feature@{1}` or `git reset --hard
feature@{one.min.ago}`. [Read the docs for more about
`git-reflog`](https://git-scm.com/docs/git-reflog).

# Interactive rebase

You may be wondering now: ok, but how will rebase help me to split a commit?

This is possible with the interactive mode, available with the
`--interactive` option. In this mode, git will open your text editor with a
list of every commit that will be replayed on top of another branch:

```
pick df4adc E
pick 180a94 F
pick 490b6c G

# Rebase 3409df0 onto main (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

This is known as the rebase todo list. Here, you're supposed to describe what
git should do at each commit in order to help you achieve the desired commit
history.

{{< note >}}

The opened editor is controlled by the `GIT_EDITOR` environment variable, whose
value defaults to whatever is in the `VISUAL` or `EDITOR` environment variable
(which is usually `vim` or `vi` on most Unix systems).

You can change this in your git config in your `~/.gitconfig` or with the CLI:

```shell-session
$ git config --global core.editor emacs
```

For example, to use VS Code:

```shell-session
$ git config --global core.editor 'code --wait'
```

If you have the GitLens extension installed, you'll see [a
nicer user interface to the todo
list](https://www.youtube.com/watch?v=P5p71fguFNI).

{{< /note >}}

The default command for every commit is "pick", meaning "replay this commit in
this specific order, unchanged".

This is just a text file, you can edit it however you like. When you're done,
save and close the file.

Now let's see in practice how to use `git rebase -i`.

# Changing the order of commits

Let's say you want to reverse the commits order, given this commit history:

```
              E---F---G feature
             /
A---B---C---D main
```

After running `git rebase -i main`, you'll be met with the following todo list.

```
pick df4adc E
pick 180a94 F
pick 490b6c G
```

Put the commits in reverse order:

```
pick 490b6c G
pick 180a94 F
pick df4adc E
```

Save and close the file to continue. In case there is no conflicts, your branch
will then look like this:

```
              G'---F'---E' feature
             /
A---B---C---D main
```

{{< warn >}}

`git rebase` may result in **conflicts**. In that case, you'll need to resolve
them as you normally would, by running `git mergetool` or something similar.

Reordering commits will likely lead to conflicts. If you're unsure how to
resolve them, you can always run `git rebase --abort` to cancel the rebase.

{{< /warn >}}

# Join commits, without changing commit message

Here's a more likely scenario: you committed some broken code a while ago and
wants to fix that commit.

If the commit you want to fix is the most recent one, just use with `git commit
--amend`. If you don't want to change commit message you can also use `git
commit --amend --no-edit`.

In case the commit is not the latest one, you'll need to rebase. If you don't
care about the commit message, you can use the `fixup` command.

Let's look at an example, suppose you have the following branch:

```
df4adc Add script
180a94 foo
490b6c bar
```

The commit "Add script" has some broken code you want to fix. You implemented
the fix and committed it with `git commit -m "Fix script"`:

```
df4adc Add script
180a94 foo
490b6c bar
3409df Fix script
```

After running `git rebase -i`, you get the following todo list:

```
pick df4adc Add script
pick 180a94 foo
pick 490b6c bar
pick 3409df Fix script
```

To merge the two commits, you can move the "Fix script" line up and use the
`fixup` command, instead of `pick`.

```
pick df4adc Add script
fixup 3409df Fix script
pick 180a94 foo
pick 490b6c bar
```

The resulting history will look like you never introduced the bug:

```
2d5b33 Add script
c404e9 foo
20ec55 bar
```

Another way to achieve the same result is to commit with `git commit
--fixup=df4adc` (or `git commit --fixup=:/"Add script"`). And then run `git
rebase --interactive --autosquash`. This will save you the step of editing the
file manually, git will do it automatically.

```
pick df4adc Add script
fixup 3409df0 fixup! Add script
pick 180a94 Add environment variables
pick 490b6c Add .gitlab-ci.yml
```

{{< note >}}

If you never heard of this notation of referencing commits by message, like
`git show :/"Add script"`, I recommend reading the
[`gitrevisions`](https://git-scm.com/docs/gitrevisions) man page for some other
tips.

{{< /note >}}

# Join commits, but preserve their commit messages

If we want to join multiple commits and preserve its message, we need to use
the `squash` command.

The only difference from using the `fixup` command is that you'll get the
chance to edit the commit's message while rebasing:

```
# This is a combination of 2 commits.
# This is the 1st commit message:

Add script

# This is the commit message #2:

squash! Fix script

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# ...
```

Similar to the `--fixup` option in `git commit`, you can also commit with `git
commit --squash=sha`.

# Split a commit

To split a commit, you want to use the `edit` command.

Git will stop at that commit to let you edit it however you want. After you're
done editing, run `git rebase --continue`.

To split a commit, you can first "undo" it with `git reset`, then just add
changes and commit them differently.

```shell-session
$ # undo the commit, but keep its changes in the working tree
$ git reset HEAD^
$ git add foo
$ git commit -m "One commit"
$ git add bar
$ git commit -m "Another commit"
$ git rebase --continue
```

# Remove a file from a commit

To remove a file, you'll need to edit a commit as well.

But now, it's more convenient to use `git reset --soft` to "undo" the commit,
because it'll keep the changes in the staging area. Now all you need to do is
unstage the file you want to remove and commit again.

```shell-session
$ # undo the commit, but keep its changes in the staging area
$ git reset --soft HEAD^
$ # remove the file from the staging area
$ git rm --cached .env
$ # reuse the previous commit message
$ git commit -c ORIG_HEAD
```

# Edit a commit message

To edit a commit message, use the `reword` command. git will open your editor
to let you edit the message.

# Delete a commit

To delete a commit, use the `drop` command or just delete the line.
