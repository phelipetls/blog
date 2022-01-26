---
layout: post
title: Improving the Android Studio experience in dwm
date: 2022-01-25
tags: ["c", "linux", "dwm", "x11"]
---

In this post, I want to share how I started to change [dwm](dwm.suckless.org/)
source code in order to improve my experience with Android Emulator.

First, let me briefly explain the problem. When you launch Android Emulator, a
window with the Android device and a window with buttons to control it appear
(maybe a modal window saying "Loading state..." too).

The device window is usually the one I'm mostly interested in. I don't recall
ever wanting to focus the other ones (except by interacting with the mouse) and
I don't want them to show up in the taskbar (since I use the
[`awesomebar`](https://dwm.suckless.org/patches/awesomebar/) patch).

At first, I went in and modified the source code ignore these windows by their
`WM_NAME` properties, which is easy to find out with `xprop`. The thing is
they're very badly named and not very distinct from each other).

But later I learned that these other windows are [*transient
windows*](https://en.wikipedia.org/wiki/Transient_(computer_programming)) in
X11:

> A window is said to be transient for another window if it belongs to that
> other window and may not outlast it: a dialog box, such as an alert message,
> is a common example.

These windows have a property called
[`WM_TRANSIENT_FOR`](https://tronche.com/gui/x/icccm/sec-4.html#WM_TRANSIENT_FOR),
whose value we can get with an Xlib function named
[`XGetTransientForHint`](https://tronche.com/gui/x/xlib/ICC/client-to-window-manager/XGetTransientForHint.html).

Here's an example on how to use this function, taken from the [`dwm` source
code](https://git.suckless.org/dwm/file/dwm.c.html#l1038):

``` c {hl_lines=["9-11"]}
void
manage(Window w, XWindowAttributes *wa)
{
	Client *c, *t = NULL;
	Window trans = None;

	// ...

	if (XGetTransientForHint(dpy, w, &trans) && (t = wintoclient(trans))) {
		c->mon = t->mon;
		c->tags = t->tags;
	} else {
		// ...
	}
}
```

As you can see, it's pretty simple, `XGetTransientForHint` assigns a `Window`
to the `trans` variable, if it succeeds, and then we get the respective
`Client` with the `wintoclient` function.

This example provided me with enough knowledge to solve most of my problems:

- I don't want them in the taskbar.
- I don't want them in the monocle layout count.
- I never want to focus on these transient windows with the keyboard.
- When I apply the nth tag to the leader window, the same tag should be applied
  to its transient windows.
- On floating layout, if I focus on a leader window, I want its transient
  windows to be raised into view as well.

# Skipping transient windows in the taskbar

The taskbar is drawn by the `drawbar` function.

Since I applied the `awesomebar` patch to my `dwm` build, I wanted to ignore
transient windows in the taskbar:

```c {hl_lines=["10-11","23-24"]}
void
drawbar(Monitor *m)
{
	// ...
	Client *c, *t = NULL;
	Window trans;

	// ...
	for (c = m->clients; c; c = c->next) {
		if (ISVISIBLE(c) && !XGetTransientForHint(dpy, c->win, &trans))
			n++;
		// ...
	}

	// ...

	if ((w = m->ww - sw - stw - x) > bh) {
		if (n > 0) {
			// ...
			for (c = m->clients; c; c = c->next) {
				if (!ISVISIBLE(c) || XGetTransientForHint(dpy, c->win, &trans))
					continue;
				if (m->sel == c)
					scm = SchemeSel;
				else if (HIDDEN(c))
					scm = SchemeHid;
				else
					scm = SchemeNorm;
				drw_setscheme(drw, scheme[scm]);
				// ...
			}
		// ...
		}
	}
	// ...
}
```

We need to be careful here and also change the `buttonpress` function, which
handles clicks in the taskbar:

```diff
diff --git a/dwm.c b/dwm.c
--- a/dwm.c
+++ b/dwm.c
@@ -518,6 +518,7 @@ buttonpress(XEvent *e)
	Client *c;
	Monitor *m;
	XButtonPressedEvent *ev = &e->xbutton;
+	Window trans = None;
 
	click = ClkRootWin;
	/* focus monitor if necessary */
@@ -546,7 +547,7 @@ buttonpress(XEvent *e)
 
			if (c) {
				do {
-					if (!ISVISIBLE(c))
+					if (!ISVISIBLE(c) || XGetTransientForHint(dpy, c->win, &trans))
						continue;
					else
						x += (1.0 / (double)m->bt) * m->btw;
```

Later, by investigating various `xprop` output, I found that some windows give
a hint called `_NET_WM_STATE_SKIP_TASKBAR` so window managers shouldn't include
them in the taskbar, [so I went ahead with
it](https://github.com/phelipetls/dotfiles/commit/7333e85b50abc63da0193705d204cf40c19b63bc).

# Skipping transient windows in monocle layout count

This is simple, we just need to *not* increment a counter when the window is
transient:

```c {hl_lines=["9-10"]}
void
monocle(Monitor *m)
{
	unsigned int n = 0;
	Client *c;
	Window trans;

	for (c = m->clients; c; c = c->next)
		if (ISVISIBLE(c) && !XGetTransientForHint(dpy, c->win, &trans))
			n++;
	if (n > 0) /* override layout symbol */
		snprintf(m->ltsymbol, sizeof m->ltsymbol, "[%d]", n);
	// ...
}
```

# Do not focus transient windows with <kbd>mod</kbd> + <kbd>j</kbd> and <kbd>mod</kbd> + <kbd>k</kbd>

I started by checking which function is bound to these keys in `config.h`: the
`focusstack` function.

Then it's quick to realize I just need to add another condition to the various
if statements (careful not to mix up the `i` and `c` variables):

```diff
diff --git a/suckless/dwm/dwm.c b/suckless/dwm/dwm.c
index 86e4a41..852666b 100644
--- a/suckless/dwm/dwm.c
+++ b/suckless/dwm/dwm.c
@@ -1053,6 +1053,7 @@ void
 focusstack(int inc, int hid)
 {
	Client *c = NULL, *i;
+	Window trans = None;
 
	if (!selmon->sel && !hid)
		return;
@@ -1062,22 +1063,22 @@ focusstack(int inc, int hid)
	if (inc > 0) {
		if (selmon->sel)
			for (c = selmon->sel->next;
-					 c && (!ISVISIBLE(c) || (!hid && HIDDEN(c)));
+					 c && (!ISVISIBLE(c) || (!hid && HIDDEN(c)) || XGetTransientForHint(dpy, c->win, &trans));
					 c = c->next);
		if (!c)
			for (c = selmon->clients;
-					 c && (!ISVISIBLE(c) || (!hid && HIDDEN(c)));
+					 c && (!ISVISIBLE(c) || (!hid && HIDDEN(c)) || XGetTransientForHint(dpy, c->win, &trans));
					 c = c->next);
	} else {
		if (selmon->sel) {
			for (i = selmon->clients; i != selmon->sel; i = i->next)
-				if (ISVISIBLE(i) && !(!hid && HIDDEN(i)))
+				if (ISVISIBLE(i) && !(!hid && HIDDEN(i)) && !XGetTransientForHint(dpy, i->win, &trans))
					c = i;
		} else
			c = selmon->clients;
		if (!c)
			for (; i; i = i->next)
-				if (ISVISIBLE(i) && !(!hid && HIDDEN(i)))
+				if (ISVISIBLE(i) && !(!hid && HIDDEN(i)) && !XGetTransientForHint(dpy, i->win, &trans))
					c = i;
	}
```

# Applying nth tag to a leader window's transient windows

To achieve this, I also started by checking which function is bound to
<kbd>Mod</kbd> + <kbd>Shift</kbd> + <kbd>n</kbd> in `config.h`, which is the
`tag` function.

Then I modified it to apply the same tag to all transient windows whose window
leader is the selected client:

```c {hl_lines=["10-16"]}
void
tag(const Arg *arg)
{
	Client *c, *t = NULL;
	Window trans = None;

	if (selmon->sel && arg->ui & TAGMASK) {
		selmon->sel->tags = arg->ui & TAGMASK;

		for (c = selmon->stack; c; c = c->snext) {
			if (XGetTransientForHint(dpy, c->win, &trans) && (t = wintoclient(trans))) {
				if (selmon->sel == t) {
					c->tags = arg->ui & TAGMASK;
				}
			}
		}

		focus(NULL);
		arrange(selmon);
	}
}
```

# Raising all transient windows when the leader window gets focused

Since the transient windows do not appear in the taskbar and we also ignore
them in the `focusstack` function, there is no way to focus on them if they're
not visible on the screen.

So in floating layout there's an UX problem where transient windows are never
visible.

The natural thing to do here is to raise all windows into view when the leader
window gets focus:

```diff
diff --git a/suckless/dwm/dwm.c b/suckless/dwm/dwm.c
index 389c61d..70a6dc1 100644
--- a/suckless/dwm/dwm.c
+++ b/suckless/dwm/dwm.c
@@ -1001,6 +1001,9 @@ expose(XEvent *e)
 void
 focus(Client *c)
 {
+	Client *i = NULL, *t = NULL;
+	Window trans = None;
+
 	if (!c || !ISVISIBLE(c))
 		for (c = selmon->stack; c && (!ISVISIBLE(c) || HIDDEN(c)); c = c->snext);
 	if (selmon->sel && selmon->sel != c) {
@@ -1023,6 +1026,12 @@ focus(Client *c)
 		grabbuttons(c, 1);
 		XSetWindowBorder(dpy, c->win, scheme[SchemeSel][ColBorder].pixel);
 		setfocus(c);
+
+		for (i = selmon->stack; i; i = i->snext) {
+			if (ISVISIBLE(i) && XGetTransientForHint(dpy, i->win, &trans) && (t = wintoclient(trans)) && (t == c)) {
+				XRaiseWindow(dpy, i->win);
+			}
+		}
 	} else {
 		XSetInputFocus(dpy, root, RevertToPointerRoot, CurrentTime);
 		XDeleteProperty(dpy, root, netatom[NetActiveWindow]);
```

# Final result

Here's a demonstration of the final result:

<video controls width="100%">
  <source src="./demo.mp4" type="video/mp4">
</video>

[^1]: https://specifications.freedesktop.org/wm-spec/1.3/ar01s05.html
