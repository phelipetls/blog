---
title: "Moving away from tiling window managers"
date: 2022-05-01
tags: ["linux", "dwm", "gnome", "ansible", "fedora", "xubuntu"]
---

This is the story about how I'm moving away from a tiling window manager,
[dwm](https://dwm.suckless.org/), to a full-blown desktop environment,
[GNOME](https://www.gnome.org/). It's hardly an interesting story, but I feel
like writing about it.

I started using tiling window managers quite early in my Linux desktop journey,
which started in 2019 with [Xubuntu](https://xubuntu.org/).

# Why Xubuntu?

My choice for Xubuntu was largely influenced by my hardware constraints: I
wanted a lightweight distribution, meaning it shouldn't require too much of my
8GB of RAM (at the time). Because of that, I was later drawn into tiling window
managers since that's as lightweight as you can get.

# dwm, a weird choice for a beginner

I made a weird choice for a beginner: dwm. I guess because I felt challenged by
it, like what does it mean to compile it from source and configure it by
changing its source code? Since I learned a ton from it, so I don't regret it,
but it wasn't without struggles.

## The bad parts

It was perfect out of the box for my workflow for some time (mostly terminals
and Firefox), until I started to use more GUIs that have a lot of modal windows
(like Android Studio, GIMP, Inkscape etc.) and whatnot, as you can attest by
[my attempts to tweak
it](/posts/improving-the-android-studio-experience-in-dwm/).

It might come as a surprise that the function keys don't do anything out of the
box -- if you try to increase or decrease volume with it, nothing will happen.
You have to add this functionality yourself, typically by binding these keys to
a shell script like
[this](https://github.com/phelipetls/dotfiles/blob/df7cd1be47f216c42a8f9a82ad97dd913e3ce6bb/scripts/change-volume),
with software like
[sxhkd](https://github.com/phelipetls/dotfiles/blob/df7cd1be47f216c42a8f9a82ad97dd913e3ce6bb/scripts/change-volume)
or in your [dwm
`config.h`](https://github.com/phelipetls/dotfiles/blob/0616a6e0879a8dbfa4373da14780a609773aa6c0/suckless/dwm/config.h#L74-L84).

A notification system also needs to be set up,
[dunst](https://github.com/dunst-project/dunst) being a popular choice. For
example, I used
[systemd-timer](https://www.freedesktop.org/software/systemd/man/systemd.timer.html)
to [check every
minute](https://github.com/phelipetls/dotfiles/blob/df7cd1be47f216c42a8f9a82ad97dd913e3ce6bb/.config/systemd/user/battery-notifier.timer)
if my [battery is dying or if it's fully
charged](https://github.com/phelipetls/dotfiles/blob/df7cd1be47f216c42a8f9a82ad97dd913e3ce6bb/scripts/battery-notifier).

But this is all stuff you need to maintain. For example, the shell script I
used to increase/decrease/mute volume worked fine in Xubuntu but not in Fedora.

The experience will likely never gonna be as good and polished as something you
have out of the box with GNOME or KDE, as well.

## The good parts

Being lightweight is what made me stick with dwm initially, apart from
curiosity. It hardly requires any RAM to work, and does it job very well.

Managing windows with dwm was often not a problem too (unless for some GUIs as
I already noted, which wasn't typical for me anyway), the default keybindings
are very well thought, and tagging windows is really powerful.

But I also don't mind Windows-style floating windows. I really like
Windows-style <kbd>Alt</kbd>+<kbd>Tab</kbd> too, and that's something I missed, particularly to
toggle between the last two used windows.

Tiling windows are not a huge productivity gain for me, since I don't have a
huge monitor and other apps other terminals are less usable with half the
screen real estate. In fact, I would mostly use monocle layout for GUI apps
anyway.

# GNOME

Recently, I found myself more interested by beautiful user interfaces,
animations etc.. dwm, of course, is by design very plain and boring.

So I decided to install Fedora 35, with comes with GNOME as desktop environment
by default and my overall impression until now is that **it's beautiful**.

## The good parts

The whole desktop is beautiful, the animations are smooth and everything works
out of the box, and that's a major good part.

This doesn't come at a cost in usability too. I love to use touchpad gestures
to navigate through the desktop when I'm being lazy laying on my bed browsing
the web with one hand on the touchpad.

The notification system is pretty good too.

I'm still getting familiar with the keybindings, but I'm trying not to
complicate it too much. For example, I didn't even add one to open a terminal.
I just hit <kbd>Super</kbd>, type Terminal and press <kbd>Enter</kbd> to open
it.

I see now the value in not having to maintain your desktop environment. I guess
I just declared [dotfiles
bankruptcy](https://www.emacswiki.org/emacs/DotEmacsBankruptcy), I'm wondering
if one day I'll have to declare `init.vim` bankruptcy too...

Having learned that lesson, I'll try as much as possible to stick with the
vanilla experience. As minimal tweaks as possible. It's best if I just get used
to the stock experience, be productive with it, and avoid maintaining various
Ansible tasks to reproduce my desktop environment the way I like it.

## The bad parts

Unfortunately, there were more bad parts than I expected, but nothing major.
Some of them are more Fedora-related than GNOME-related.

To start with one related to GNOME (or shall I say GNOME in Wayland): Alacritty
window decorations are broken (as in not consistent, ugly etc.). [It seems to
be complicated who is the real
culprit](https://github.com/alacritty/alacritty/issues/3258), nevertheless it
happened and it sucked since I had to abandon my Alacritty configuration
because of it in favor of GNOME terminal, which do not provide the convenience
of a configuration file, so [I had to came with a questionable way of doing
it](https://github.com/phelipetls/dotfiles/blob/df7cd1be47f216c42a8f9a82ad97dd913e3ce6bb/roles/desktop/tasks/gnome.yml#L18-L22).

Talking about configuration files, this is an issue with GNOME -- it's very
hard to keep configuration under source control. Essentially, the only way to
configure it programmatically is with
[dconf](https://wiki.gnome.org/Projects/dconf), which [I have done with
Ansible's
help](https://github.com/phelipetls/dotfiles/blob/df7cd1be47f216c42a8f9a82ad97dd913e3ce6bb/roles/desktop/tasks/gnome.yml#L8-L16).

Now, going into more Fedora-related issues... All videos outside YouTube and
Netflix didn't play at all. Later I found this is solved by downloading the
`ffmpeg-libs` from the [RPM fusion](https://rpmfusion.org/) repository, [a step
I automated with Ansible
too](https://github.com/phelipetls/dotfiles/blob/df7cd1be47f216c42a8f9a82ad97dd913e3ce6bb/roles/desktop/tasks/linux.yml#L79-L94).
Fedora apparently can't bundle some proprietary video codecs for our
convenience because of legal reasons, so this is fine.

And also... GNOME takes a lot more RAM to work than dwm, obviously. I didn't
find this to be an issue now, since I'm mostly using a browser and doing
lightweight front-end web development (my side projects), but it may be.

# Conclusion

I'm oddly excited about experiencing this new desktop environment anyway, it's
a feeling familiar to my first time trying dwm as well, so I guess it has
something to do with trying new stuff. But hope I won't be changing much, I
hope I'll stick with GNOME for a very long time and just spend my time learning
other things other than configuring my desktop environment -- even though it's
fun to do and I can't help myself doing it at times, it can spare me some time.
