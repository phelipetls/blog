---
title: "Coping with a work-issued Windows laptop"
date: 2022-08-21
tags: [windows, linux, macos, ubuntu]
---

I recently switched job and was given a Windows laptop, which is fine but not
ideal to me, since I've prefer to work with Unix-like environment and [have
invested a lot more time into perfecting
those](https://github.com/phelipetls/dotfiles). Fortunately, thanks to WSL, I
was able to reuse my setup almost unchanged in Windows!

# What about Windows without WSL?

Initially, I considered not using WSL. There are some reasons that makes this
decision easier nowadays:

- There are two third-party package managers for Windows,
  [scoop](http://scoop.sh/) and [chocolatey](http://scoop.sh/), and a
  Microsoft-developed one,
  [winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/),
  but it's still new compared to the first ones.
- PowerShell, which is ok as an interactive shell (it even has [readline
  library](https://github.com/PowerShell/PSReadLine) for a Bash-like shell
  editing experience).
- There is [NVM for Windows](https://github.com/coreybutler/nvm-windows), and
  it works well. But you have to open a shell with administrator rights to
  switch versions.
- Most CLI tools work in Windows too, notably: git, neovim,
  [fzf](https://github.com/junegunn/fzf),
  [ripgrep](https://github.com/BurntSushi/ripgrep),
  [fd](https://github.com/sharkdp/fd),
  [git-delta](https://github.com/dandavison/delta) etc.

But I ultimately decided to work exclusively in WSL for the following reasons:

- No tmux. That's a big one.
- No bash or zsh. Well, there is [Git for Windows](https://gitforwindows.org/),
  which uses Cygwin under the hood, and sure is handy to have around, but it's
  not as great as Bash itself.
- [fzf has some limitations in
  Windows](https://github.com/junegunn/fzf/wiki/Windows).
- Ansible doesn't run on Windows. It's possible to manage Windows hosts through
  a Unix-like environment, like WSL, but [it requires a non-trivial
  setup](https://docs.ansible.com/ansible/latest/user_guide/windows_setup.html)
  that I wasn't willing time into -- it's hard enough to maintain a playbook
  that works across macOS, Ubuntu and Fedora.

# Experience with WSL2

Regarding my experience with WSL2, I have no complaints whatsoever --
everything works as expected without any noticeable performance issues.

To bootstrap my development environment, I proceeded as usual:

- Install git with, say, `sudo apt install git`.
- Run `./install`.
- Run `ansible-playbook bootstrap.yml`.

But I run into issues with this because the Ansible playbook installed VS Code
and other GUI programs, which I did not want. I could have just used an Ansible
fact to detect if I'm on WSL or not, but I preferred to split the bootstrap
into two, one for non-GUI only tools and another one for GUI tools.

The optimal way to use VS Code within WSL is to run the Windows version and use
the [Remote - WSL](https://code.visualstudio.com/docs/remote/wsl-tutorial) extension. The funny thing is that, [GUI apps will open up
in WSL2](https://docs.microsoft.com/en-us/windows/wsl/tutorials/gui-apps),
which is impressive.

# Windows Terminal

I didn't have such a good experience with Windows Terminal as I had with WSL2,
unfortunately.

I was excited about Windows Terminal when [it was announced in 2019, with the
most impressive marketing video](https://www.youtube.com/watch?v=8gw0rXPMMPE),
since I started using Vim in Windows and very much wanted a better terminal
application than the built-in ones. But by the time it launched, I had already
moved to Ubuntu and never came back until now, so this is my first time trying
it out.

To my disappointment, I quickly ran when into weird glitches while using neovim
with tmux, and apparently this is an
[ongoing](https://github.com/microsoft/terminal/issues/6865)
[issue](https://github.com/microsoft/terminal/issues/6987).

I'll keep an eye on these and try it out from time to time because, apart from
this issue, which totally breaks my workflow, the user experience is an
undeniable improvement.

Meanwhile, I had to use the Ubuntu terminal, which does not have these issues,
but it's awkward to configure.

I'm also considering moving to [wezterm](https://wezfurlong.org/wezterm/).
There is also [Alacritty](https://github.com/alacritty/alacritty), but this is
not an option for me because it looks so ugly in GNOME.

# Windows clipboard integration

Using neovim and tmux in WSL2 was working perfectly well, until I tried to copy
something to paste it in my browser, and it would paste something unexpected or
nothing at all -- the copied text wasn't in the Windows clipboard!

This happened because neovim detected that an X server was being run (the
`$DISPLAY` environment variable was set, remember that GUI apps work in WSL2
now?) and the `xclip` program was available, so it did the sensible thing and
used `xclip` as the clipboard provider (see `:h clipboard-provider`). neovim
didn't attempt to integrate with the Windows clipboard, so I had to force it.

So, I did my research and came up with this solution:

```vim
if has('wsl')
  let g:clipboard = {
        \   'name': 'Windows',
        \   'copy': {
        \     '+': 'clip.exe',
        \     '*': 'clip.exe',
        \   },
        \   'paste': {
        \     '+': 'powershell.exe -c [Console]::Out.Write($(Get-Clipboard -Raw).tostring().replace("`r", ""))',
        \     '*': 'powershell.exe -c [Console]::Out.Write($(Get-Clipboard -Raw).tostring().replace("`r", ""))',
        \   },
        \ }
endif
```

You'll notice that this uses Windows executable, which is not an issue WSL2
somehow. `clip.exe` is a tool to copy code, and we use a PowerShell command to
paste the code (we also have to remove carriage returns).

I also needed to adjust my `.tmux.conf` to copy code with `clip.exe` if on
WSL2:

```plaintext {hl_lines=["4-5"]}
if-shell "uname | grep -iq Darwin" {
  bind -T copy-mode-vi y send-keys -X copy-pipe-no-clear "pbcopy"
} {
  if-shell "uname -a | grep -iq Microsoft" {
    bind -T copy-mode-vi y send-keys -X copy-pipe-no-clear "clip.exe"
  } {
    bind -T copy-mode-vi y send-keys -X copy-pipe-no-clear "xclip -sel clip -i"
  }
}
```

# ssh-agent

Windows has OpenSSH built-in now, which is awesome. One of the first things I
did was to create a new key pair and add it to my GitHub.

Unfortunately, from what I understood, there is no ssh-agent for WSL2, so you
can't use `ssh-add`, enter your password, and enjoy `git push`ing without
entering your password every time.

There are projects to overcome this, namely
[`wsl-ssh-agent`](https://github.com/rupor-github/wsl-ssh-agent) and
[OmniSSHAgent](https://github.com/masahide/OmniSSHAgent), but I chose to use
[`keychain`](https://www.funtoo.org/Funtoo:Keychain) to solve this, which I've
heard by reading the blog post ["Using SSH-Agent the right way in Windows 10
WSL2"](https://esc.sh/blog/ssh-agent-windows10-wsl2/).

This program is available in most distros (`sudo apt install keychain` in
Ubuntu) and automatically handle starting `ssh-agent` and running `ssh-add` for
you whenever you spawn a new shell, so that you'll just have to insert you
passphrase once. You'll need to put the following code into your `.profile`,
`.zshrc` or `.bashrc`:

```bash
eval "$(keychain --quiet --eval id_rsa)"
```

I want this to run only in WSL and if keychain is installed, because I don't
use keychain in Linux nor macOS:

```bash
if uname -a | grep -iq Microsoft && keychain --quiet; then
  eval "$(keychain --quiet --eval id_rsa)"
fi
```

This has been working for me so far.

# Conclusion

Overall, I was pleasantly surprised by how well things turned out for me.

I am familiar with the Windows desktop experience, of course, because I used it
for so long before switching to Linux, and Windows 11 looks nice and feels fast
-- maybe because the computer is new, but even under heavy load I didn't
experience any slowdows.

[Windows is famous for having a UI
inconsistencies](https://den.dev/blog/windows-priority-shuffle/), but they're
not immediately apparent to be annoying. I also didn't feel bombard with ads,
apart from the ones from Dell, McAfee and Microsoft Edge.
