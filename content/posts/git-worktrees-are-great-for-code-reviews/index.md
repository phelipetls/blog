---
title: "Git worktrees are great for code reviews"
date: 2022-11-06
tags: [git]
---

At first, I didn't understand how to use [git
worktrees](https://git-scm.com/docs/git-worktree), but now I find myself using
it more and more for code reviews.

<!--more-->

Here's what my workflow looks like when I have to review code:

- `cd` into a previously created worktree with `cd ../code-review`.
- Run `git fetch`.
- Check out the branch to review with `git checkout <branch>`.
- Install dependencies with `npm install`
- Run the app with `npm run start` to help me review the code.

When I'm done reviewing, I can just `cd` into the folder I was previously
working on.

This saves me from polluting my `git stash` or messing up my `node_modules` and
`.env` (in case I needed to modify them to run the reviewee's code).

# What is a worktree?

A worktree enables you to check out more than one branch at a time per
repository.

Each worktree has its own working tree, meaning you can have completely
different files and directories per worktree -- for instance, the untracked
`.env` and `node_modules` may be different.

In practice, a worktree is just like a directory. After you create it with `git
worktree add`, you can `cd` into it and start working.

We could check out more than one branch by cloning the repository in a
different folder, but it's slower -- creating worktrees is instant -- and
inconvenient -- your local branches are shared across worktrees.

# Creating a worktree

The command to add worktree is `git worktree add`. It expects you to pass the
path of the new worktree:

```shell-session
$ git worktree add ../code-review
```

Actually, this will create a new branch called `code-review` and automatically
switch to it.

```shell-session
(master) $ git worktree add ../code-review
(master) $ cd ../code-review
(code-review) $
```

You can choose to check out an existing branch instead by passing its name as
the second argument:

```shell-session
(master) $ git worktree add ../bugfix JIRA-311
(master) $ cd ../bugfix
(JIRA-311) $
```

As I said, I don't typically create a lot of worktrees, I just have one sitting
there, and recycle it when I have to do some code reviews, but that's how you
create it.

# Independent working trees

Independent working trees per worktree is a big part of why it's useful for
code reviews.

{{< note >}}

A working tree is git terminology for the directory in the file system you're
working on.

{{< /note >}}

But even on solo projects, like my blog, this can come in handy -- e.g. I'm on
a migration from Cypress to Playwright, I would have to run `npm install` to
install the correct dependencies every time I switched branches, which is
inconvenient.

By doing the migration to Playwright in a worktree, my work on that branch
wouldn't interfere with the main worktree with the Cypress test suite.

# Removing worktrees

To remove a worktree:

```shell-session
$ git worktree remove code-review
```

This will only succeed if the worktree is clean -- which means ["no untracked
files and no modification in tracked
files"](https://git-scm.com/docs/git-worktree#Documentation/git-worktree.txt-remove).

# Conclusion

I don't have a lot of use cases for worktrees but using them for code reviews
has become a staple for me so I wanted to share it. Adding and removing them is
pretty much all I use and it's already very useful.

I hope this encourage you to actually run the reviewee's code because it often
results in better code reviews, for me at least.
