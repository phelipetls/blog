---
title: "dotfiles"
date: 2020-01-01
github: "https://github.com/phelipetls/dotfiles"
weight: 2
---

Reproducible desktop and developer environment in Ubuntu and (more recently)
macOS.

[GNU Stow](www.gnu.org/software/stow/manual/stow.html) is used to create
symbolic links into the `$HOME` directory from the `dotfiles` directory, which
is useful to configure the shell and other programs.

[Ansible](https://www.ansible.com/) is used to download dependencies, such as
`npm`, `pip`, `homebrew` and `apt` packages, downloading programs from tarballs
or zip files, reproduce system-wide settings etc..

[git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) are used
to manage part of dependencies, such as neovim plugins and
[`fzf`](https://github.com/junegunn/fzf).
