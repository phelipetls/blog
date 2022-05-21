---
title: "Ansible for your dotfiles: the introduction I wish I've had"
date: 2022-05-18
draft: true
tags: ["ansible", "linux", "fedora", "ubuntu", "macos"]
---

Here's the problem: you have your dotfiles hosted somewhere, with your
preferred configuration for git, tmux etc., but you don't have neither git or
tmux installed, so they're useless. You solved the configuration problem, but
not the dependencies one: you still need to install git and tmux when on a new
machine. Ansible can help solve this, let's see how.

Ansible would often come up as a solution to dependency management, but I'd
quickly dismiss it because it seemed overkill for my needs. [The landing page
certainly contributed to this impression](https://www.ansible.com), it looks
too big, complex and enterprise-y. It doesn't help convey the idea of what
Ansible essentially is: a tool to automate tasks in a declarative way. The
[official docs is a better place to
start](https://docs.ansible.com/ansible/latest/user_guide/index.html#getting-started),
but I think it's overwhelming as an introduction.

I wish I was introduced to Ansible differently, in a way that made clear how it
would help me automatically set up my machine in the way I like -- with my
preferred programs, appearances, settings etc. We'll deliberately abstract away
the more complex applications of Ansible that most companies neeed.

# Installing Ansible

First things first, let's install Ansible. It's available on most Linux distros
package managers and in Homebrew. The official docs has an [an extensive list
with instructions for many Unix-like operating
systems](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-specific-operating-systems).

Another option is to use [pip](https://pypi.org/project/pip/), the package
manager for Python, like I did:

```sh
% pip install ansible
```

{{< warn >}}

[Ansible cannot run on a Windows
machine](https://docs.ansible.com/ansible/latest/user_guide/windows_faq.html#windows-faq-ansible),
which is surprising. It can only *remotely manage* Windows machines, from a
Unix-like OS, such as WSL.

{{< /warn >}}

# How Ansible clicked for me

I don't remember what actually got me into Ansible, but I think it was by
looking at the source code of a dotfiles repo that used it. Its `README.md`
explained that you needed just one command to set up everything:

```sh
% ansible-playbook --ask-become-pass bootstrap.yml
```

So I went and looked at the `bootstrap.yml` file:

```yaml
---
- name: Bootstrap development environment
  hosts: localhost

  tasks:
  - name: Install packages with apt
    become: yes
    ansible.builtin.apt:
      name:
        - git
        - tmux
      state: present
```

Then things immediately clicked for me: it's using `apt` to download packages!

There's a lot going on that we still have to understand, like what is `become`,
`hosts` etc. But this already shows Ansible's primary goal, which is *to leave
a machine in a desired state after playing various tasks*. In this example,
that desired state is to have git and tmux installed, but that state will
likely not be that simple. Also, what if we're on macOS? Or Fedora? We would
have to use another package manager then. We'll see that Ansible makes it easy
to do all this.

# Playbook

The file `bootstrap.yml` is, in Ansible terminology, a
[playbook](https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html),
which is, in my own words, a way to declare which tasks should run in a machine
in order to achieve the desired state. Playbooks are written in YAML, which is
easy to read and [learn](https://learnxinyminutes.com/docs/yaml/).

A playbook may contain various plays, and each play may contain various tasks.
For example, the `bootstrap.yml` playbook has a single play, named "Boostrap
development environment", with one task, "Install packages with apt".

# Hosts and inventory

Ansible can execute tasks on remote and local machines. This is managed with
the help of an
"[inventory](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html)",
where these machines (`hosts`) are classified with patterns like "prod",
"test", "webserver" etc..

We're not interested in that here since we just want to run tasks on our local
machine. Passing `localhost` as a playbook's `hosts` will do what we want,
without any inventory, because [Ansible will implicitly define localhost to
match the local
machine](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

```yaml {hl_lines=[2]}
- name: Bootstrap development environment
  hosts: localhost
```

# Tasks

Now, let's dissect the "Install packages with apt" task:

```yaml {hl_lines=["4-8"]}
  tasks:
  - name: Install packages with apt
    become: yes
    ansible.builtin.apt:
      name:
        - git
        - tmux
      state: present
```

This is the equivalent of running `sudo apt install git tmux`, but in a
declarative way.

## Become

[`become`](https://docs.ansible.com/ansible/latest/user_guide/become.html) is
an Ansible keyword that means "become another user when playing this task",
that user being, by default, "root".

So it's the equivalent of using `sudo`. This is also why you need to run the
playbook with the option `--ask-become-pass` (`-K` for short), because it'll be
necessary to prompt for your password.

If you need to become another user other than `root`, use the `become_user`
keyword.

## Modules

`ansible.builtin.apt` is an [Ansible
module](https://docs.ansible.com/ansible/latest/user_guide/modules_intro.html),
which is the preferred way to interact with another program in an Ansible
playbook.

Ansible has several built-in modules, [here's a full
list](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/index.html).
It has modules for most Linux distributions package managers, like
[`dnf`](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/dnf_module.html).
But there are also community-developed modules, like one for
[Homebrew](https://docs.ansible.com/ansible/latest/collections/community/general/homebrew_module.html),
if you're on macOS, which we'll have to download separately.

An Ansible module takes arguments to accomplish a task. In the
`ansible.builtin.apt` case, we pass a list of packages to the
[`name`](https://docs.ansible.com/ansible/2.9/modules/apt_module.html#parameter-name)
argument and the desired state we want them to be in to the
[`state`](https://docs.ansible.com/ansible/2.9/modules/apt_module.html#parameter-state)
argument.

```yaml {hl_lines=["4-8"]}
  tasks:
  - name: Install packages with apt
    become: yes
    ansible.builtin.apt:
      name:
        - git
        - tmux
      state: present # could also be 'latest' or 'absent'
```

## Idempotency

Ansible playbooks are meant to be idempotent, meaning that, no matter how many
times they run, the machine will end up in the same desired state.

An Ansible module can tell if something changed between runs. For example,
let's say I already have git and tmux installed and run the `bootstrap.yml`
playbook:

```sh {hl_lines=["9-10","13"]}
% ansible-playbook -K bootstrap.yml
BECOME password:

PLAY [Bootstrap development environment] *****************************************************************************

TASK [Gathering Facts] ***********************************************************************************************
ok: [localhost]

TASK [Install packages with apt] ******************************************************************************************
ok: [localhost]

PLAY RECAP ***********************************************************************************************************
localhost                  : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

The task "Install packages with apt" was labelled "ok", as in "nothing
changed": git and tmux were already present. If either were absent, the task
would have been labelled as "changed", because now both are present.

This feature is module-dependent. The task could be idempotent by nature, yet
Ansible wouldn't know about it unless the module is smart enough to tell it.

To illustrate this, let's use the
[`ansible.builtin.shell`](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/shell_module.html#shell-module),
which is used to run arbitrary commands into a shell.

[Let's run a task using this module in an ad hoc
way](https://docs.ansible.com/ansible/latest/user_guide/intro_adhoc.html), i.e.
outside of a playbook:

```sh
% ansible localhost -m ansible.builtin.shell -a 'echo $SHELL'

[WARNING]: No inventory was parsed, only implicit localhost is available
localhost | CHANGED | rc=0 >>
/bin/bash
```

Ansible says something has changed, but why? Running `echo $SHELL` cannot
change anything in a system (I guess?). But Ansible has no way to know this,
since it could be any arbitrary command, such as `rm -rf $HOME`.

Most of Ansible built-in modules are idempotent and smart enough to tell if
something changed between runs. `ansible.builtin.shell` is kind of a low-level
one, so it's best to avoid it whenever possible.

# Check mode

Ansible can also run playbooks in [check
mode](https://docs.ansible.com/ansible/latest/user_guide/playbooks_checkmode.html#using-check-mode),
or dry-run mode.

```sh
% ansible-playbook bootstrap.yml --check
```

In this mode, tasks won't make any changes to the system, instead they'll tell
you what changes they *would* have made.

But not every module has support for it. You can check for support in the
module's documentation page, e.g. [`ansible.builtin.apt` fully supports
check_mode](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html#attribute-check_mode),
while [`ansible.builtin.shell` does
not](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/shell_module.html#attribute-check_mode).

# Diff mode

Running a playbook in [diff
mode](https://docs.ansible.com/ansible/latest/user_guide/playbooks_checkmode.html#using-diff-mode),
with `--diff`, will report the changes at the end, whether in check mode or
not. Again, not every module supports this mode too.

# Facts and conditionals

Now let's imagine you use macOS and Ubuntu. You want to install git and tmux in
both operating systems with Ansible. You'll need to add some sort of
conditional logic to your playbook since `apt` isn't available in macOS, and
you probably don't want to use Homebrew in Linux, even though you could.

[We can run a task conditionally with the `when`
keyword](https://docs.ansible.com/ansible/latest/user_guide/playbooks_conditionals.html#basic-conditionals-with-when):

```yaml {hl_lines=["9","19"]}
  tasks:
  - name: Install packages with apt
    become: yes
    ansible.builtin.apt:
      name:
        - git
        - tmux
      state: present
    when: ansible_distribution == "Ubuntu"

  tasks:
  - name: Install packages with brew
    become: yes
    community.general.homebew:
      name:
        - git
        - tmux
      state: present
    when: ansible_distribution == "MacOSX"
```

The task will run if the expression passed to `when` evaluates to `True`. This
expression is a Jinja2 expression, a template engine written in Python, so it's
not strictly Python syntax but it looks a lot like it.

The `ansible_distribution` variable is an Ansible fact: information about your
system gathered and provided by Ansible, for convenience. There are a LOT of
facts, you can run `ansible localhost -m ansible.builtin.setup` to check what's
available, but here's the [most commonly used
ones](https://docs.ansible.com/ansible/latest/user_guide/playbooks_conditionals.html#commonly-used-facts):
`ansible_distribution`, `ansible_distribution_version` and `ansible_os_family`.

# Ansible Galaxy

The module `community.general.homebrew` is not a built-in module, you have to
install it separately with [Ansible Galaxy](https://galaxy.ansible.com/docs/),
which is a hub for Ansible content.

Ansible Galaxy provides a command-line interface to install stuff, like
[collections](https://galaxy.ansible.com/docs/contributing/creating_collections.html)
and roles (which we'll learn about shortly). `community.general` is a
collection, which we can install with this command:

```sh
% ansible-galaxy collection install community.general
```

# Loops

You may eventually need a loop to accomplish a task.

For example, the following task will build dwm, slock and dmenu from source, by
running `sudo make install` in their directories:

```yaml
- name: Build and install suckless tools
  become: true
  loop:
    - dwm
    - slock
    - dmenu
  community.general.make:
    target: install
    chdir: "suckless/{{ item }}"
    make: /usr/bin/make
```

Some modules, like
[`community.general.npm`](https://docs.ansible.com/ansible/latest/collections/community/general/npm_module.html),
do not accept a list of strings as argument, just a string, so a `loop` will be
needed. For example, to install some npm modules globally:

```yaml {hl_lines=["2-5",7]}
- name: Install npm global packages
  loop:
    - yalc
    - npm-merge-driver
    - diff-so-fancy
  community.general.npm:
    name: "{{ item }}"
    state: present
    global: true
```

This task will be executed for each item in the array, with the variable `item`
holding the current item's value.

# Jinja2

[Jinja2](https://jinja.palletsprojects.com/en/3.1.x/templates/) was mentioned
briefly, but since it's a huge component of Ansible, let's see more examples on
how it's used.

Actually, we've been using Jinja2 throughout this post, e.g., `{{ item }}` is a
Jinja2 expression to expand the value in the variable `item`.

It's possible to manipulate this value with
[filters](https://jinja.palletsprojects.com/en/3.1.x/templates/#filters), e.g.
`{{ item | upper }}` would make it uppercase. [There are a lot of filters
available by
default](https://jinja.palletsprojects.com/en/3.1.x/templates/#list-of-builtin-filters).

Filters may also come in handy in complex loops:

```yaml {hl_lines=["3-4","7"]}
- name: Give users access to multiple databases
  community.mysql.mysql_user:
    name: "{{ item[0] }}"
    priv: "{{ item[1] }}.*:ALL"
    append_privs: yes
    password: "foo"
  loop: "{{ ['alice', 'bob'] | product(['clientdb', 'employeedb', 'providerdb']) | list }}"
```

Ansible uses [Jinja2
tests](https://docs.ansible.com/ansible/latest/user_guide/playbooks_tests.html#playbooks-tests)
for conditional logic, i.e. expressions that must evaluate to a Boolean. The
syntax for tests is different than filter syntax:

```yaml {hl_lines=[7]}
vars:
  url: "https://example.com/users/foo/resources/bar"

tasks:
    - debug:
        msg: "matched pattern 1"
      when: url is match("https://example.com/users/.*/resources")
```

There usual [comparison
operators](https://jinja.palletsprojects.com/en/latest/templates/#comparisons)
are available, like `<`, `lt`, `<=`, `>`, `>=`, `==`, `=`, `!=`, as well as
[combining boolean
expressions](https://jinja.palletsprojects.com/en/latest/templates/#logic) with
`and` and `or`. It's very Python-like, as you can see, just slightly different
in some ways.

# Roles

An Ansible role is a way to organize your tasks logic into a file structure.

A role is the format in which you use other people's code, e.g., [there is an
Ansible role to install Visual Studio
Code](https://github.com/gantsign/ansible-role-visual-studio-code). It's
available in Ansible Galaxy, so we can isntall it with `ansible-galaxy role
install gantsign.visual-studio-code`. It has parameters for customizability,
e.g. to install extensions:

```yaml
# ...
    - role: gantsign.visual-studio-code
      users:
        - username: phelipe
          visual_studio_code_extensions:
            - "eamodio.gitlens"
            - "kahole.magit"
            - "PhilHindle.errorlens"
            - "sleistner.vscode-fileutils"
            - "vscodevim.vim"
# ...
```

In practice, it's just a way to organize tasks into file structure that Ansible
understands.

You'll usually start by creating a `tasks/main.yml`, which is the entry point,
from which tasks will be defined.

For example, here's a role I made to install neovim:

```sh
% tree roles/nvim
roles/nvim
└── tasks
    ├── fedora.yml
    ├── macos.yml
    ├── main.yml
    └── ubuntu.yml

1 directory, 4 files
```

The contents of `main.yml` simply import tasks from other files depending on
which OS I'm on:

```yaml
---
- name: Build nvim from source in Ubuntu
  import_tasks: ubuntu.yml
  when: ansible_distribution == "Ubuntu"

- name: Build nvim from source in Fedora
  include_tasks: fedora.yml
  when: ansible_distribution == "Fedora"

- name: Install nvim with Homebrew in macOS
  import_tasks: macos.yml
  when: ansible_distribution == "MacOSX"
```

There's a LOT more than that, of course, but I won't go any further here. Check
out the [official docs about
roles](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html)
to learn more.

# Dotfiles use cases

Now let's look at some examples at how I used Ansible to manage [my
dotfiles](https://github.com/phelipetls/dotfiles).

## Building Neovim from source

Let's build Neovim from source with Ansible, in Ubuntu, with the help of the
[official guide](https://github.com/neovim/neovim/wiki/Building-Neovim).

I already have Neovim source code, as a git submodule in `deps/neovim`, but
it's also possible to add a task to clone its repository with the
[`ansible.builtin.git`](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/git_module.html)
module.

We'll need to install build dependencies, run some `make` commands, and that's
it!

```sh
# In case you don't like git submodules
- name: Clone nvim repository
  git:
    repo: https://github.com/neovim/neovim
    dest: "{{ ansible_env.HOME }}/src/nvim"
    clone: true
    version: "v6.0.0"

- name: Install nvim build dependencies
  become: true
  apt:
    name:
      - ninja-build
      - gettext
      - libtool
      - libtool-bin
      - autoconf
      - automake
      - cmake
      - g++
      - pkg-config
      - unzip
      - curl
    state: present

- name: Build nvim release version
  community.general.make:
    chdir: deps/neovim
    params:
      CMAKE_BUILD_TYPE: Release

- name: Install nvim release version
  become: true
  community.general.make:
    chdir: deps/neovim
    target: install
```

## Installing efm-langserver

[`efm-langserver`](https://github.com/mattn/efm-langserver) is a Language
Server written to make any LSP client understand the output of an arbitrary
linter or formatter.

Let's install it using Ansible too! It's a go app, so we could use Go toolchain
to install it, but I had too much trouble going down this path, so now I just
download the tarball from GitHub, unpack (with `ansible.builtin.archive`
module) it and put the binary into my `PATH` (in `$HOME/.local/bin`):

```yaml
- name: Create directory ~/.local/bin/
  file:
    path: "{{ ansible_env.HOME }}/.local/bin"
    state: directory

- name: Install efm-langserver in Linux
  unarchive:
    src: https://github.com/mattn/efm-langserver/releases/download/v0.0.37/efm-langserver_v0.0.37_linux_amd64.tar.gz
    dest: "{{ ansible_env.HOME }}/.local/bin"
    remote_src: true
    extra_opts:
      - "--strip-components=1"
      - "efm-langserver_v0.0.37_linux_amd64/efm-langserver"
  when: ansible_distribution == "Ubuntu" or ansible_distribution == "Fedora"
```

[It isn't as easy to do this in macOS
though](https://github.com/phelipetls/dotfiles/blob/d10072c4ab01d02018f5caeb1510d3c6c0ebbd95/roles/efm-langserver/tasks/macos.yml),
just because it's a zip file instead, which lacks the convenience of the
`extra_opts` parameter... But I might be missing something.

## Installing linters and formatters

I also install every linters and formatter programs I use with Ansible. Here's
a snippet of it:

```yaml
- name: Install linters and formatters with dnf
  become: true
  dnf:
    name:
      - ShellCheck
    state: present
  when: ansible_distribution == "Fedora"

# ...

- name: Install linters and formatters with pip
  ansible.builtin.pip:
    name:
      - flake8
      - black
      - yamllint
      - git+https://github.com/Vimjas/vint@master
    state: present
    executable: pip3

- name: Install linters and formatters with npm
  loop:
    - eslint_d
    - prettier
  community.general.npm:
    name: "{{ item }}"
    global: true
    state: present
```

[If you're interested, you can look at the entire file at
GitHub](https://github.com/phelipetls/dotfiles/blob/d10072c4ab01d02018f5caeb1510d3c6c0ebbd95/roles/efm-langserver/tasks/main.yml#L21-L62).

## stow

stow is a huge part of dotfiles management: it's responsible to put the
contents of my dofiles into my `$HOME` directory, as symlinks, while preserving
the same folder structure.

I also install and run stow in my playbook. There isn't an Ansible module for
stow though, so I have to resort to `ansible.builtin.shell`, which isn't great
because it's dumb. But not all is lost, we can make it smarter by tweaking the
task parameters. We can determine if something changed between runs by running
stow in verbose mode (`--verbose=2`), to make it describe everything it did,
and then analyze its output.

```
stow dir is /home/phelipe/dotfiles
stow dir path relative to target /home/phelipe is dotfiles
Planning stow of package ....
--- Skipping .profile as it already points to dotfiles/.profile

# A lot of output omitted here...

Planning stow of package .... done
Processing tasks...
```

By looking at the output, we see that stow says it's "skipping" files if there
is already a symlink pointing at it in `$HOME`. But in the case there isn't,
it'll describe it differently:

```
LINK: .profile => dotfiles/.profile
```

So, if the string `LINK` is in the stderr, it means a symlink had to be
created:

```yaml {hl_lines=["8"]}
- name: Run stow
  shell: "stow . --target {{ ansible_env.HOME }} --verbose=2"
  register: result
  changed_when: 'result.stderr is search("LINK: ")'
```

This is a small thing, but it's just nice to run a playbook and have everything
labelled as "ok".

# GNOME

We can't customize GNOME with configuration files, unlike most window managers.
We normally configure it with GUIs, which is not a great thing if we're
interested in automating the customization step.

Fortunately, there is a command line interface to make this possible called
[`dconf`](https://wiki.gnome.org/Projects/dconf) (there's also `gsettings` but
we won't use it). The collection `community.general` has a [module for
`dconf`](https://docs.ansible.com/ansible/latest/collections/community/general/dconf_module.html),
so let's use it.

For now, I just made two tweaks to my GNOME DE:

- Click by tapping on the touchpad.
- Show battery percentage next to the battery icon.

Here's the equivalent tasks:

```yaml {hl_lines=["1-4","6-9"]}
- name: Enable tap to click on touchpad
  community.general.dconf:
    key: "/org/gnome/desktop/peripherals/touchpad/tap-to-click"
    value: "true"

- name: Show battery percentage
  community.general.dconf:
    key: "/org/gnome/desktop/interface/show-battery-percentage"
    value: "true"
```

But how did I find that I needed
`/org/gnome/desktop/peripherals/touchpad/tap-to-click` specifically? That's the
hard part, but it's easier if we use
[`dconf-editor`](https://wiki.gnome.org/Apps/DconfEditor), a GUI to explore
GNOME applications internal settings. Navigate through it until you find the
desired setting that seems responsible for what you want, grab its path and
pass the value you want to it.
