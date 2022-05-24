---
layout: "post"
title: "Implementing dark mode for static websites"
date: 2021-04-29
tags: ["hugo", "html", "css", "javascript"]
aliases: ["/posts/dark-mode-implementation-for-ssr-websites"]
summary: |
  From the basic to the hacky stuff you should do to deliver the best experience.
---

Implementing dark mode for a static website is not as simple as you may
initially think. There are some hacky things we should do to provide the best
experience and avoid things like [flash of incorrect
theme](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/) on reload,
handling transitions, persistence etc.

In this blog post I'll dive into the implementation details on how to make it
work in general and then on how to implement it in Hugo-powered websites.

# CSS

CSS variables makes it very easy to define which colors you'll use for dark or
light mode:

```css
:root {
  --black: #000000;
  --white: #ffffff;
}

body[data-theme="light"] {
  --bg-color: var(--white);
  --fg-color: var(--black);
}

body[data-theme="dark"] {
  --bg-color: var(--black);
  --fg-color: var(--white);
}
```

And that's it.

To toggle from one theme to another we just need some JavaScript:

```js
const button = document.querySelector("button.theme-toggler");

button.addEventListener("click", function() {
  if (document.body.dataset.theme === "dark") {
    document.body.setAttribute("data-theme", "light");
    return;
  }
  document.body.setAttribute("data-theme", "dark");
});
```

# Theme persistence

To make the theme persist, we'll use
[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Every time the theme changes, we save it to `localStorage`. When the page
reloads, we read from `localStorage` and change the theme:

```js
const storedTheme = localStorage.getItem("__theme");

if (storedTheme) {
  /* Change theme to storedTheme */
}

const button = document.querySelector("button.theme-switcher");

button.addEventListener("click", function() {
  /* Toggle theme */
});
```

We just need to put this in a `script` tag at the end of the `body` tag to make
it work!... except the page will flash on reload.

This is because, at the time the script runs, the page has already been drawn in
light mode, and just then we change it to dark mode.

The fix is to set the theme from `localStorage` _as early as possible_. But this
also means that we won't be able to add an event listener to the button because
it has yet to be created:

```html
<body data-theme="light">
  <script>
    <!-- load theme from localStorage -->
  </script>

  ...

  <button>Change theme</button>

  <script>
    <!-- add button logic -->
  </script>
</body>
```

But that way we won't be able to share logic between scripts unless (here comes
the hack) we use a global variable.

In the first script, right after the body tag, we set the theme from
`localStorage`.

```js
window.__setTheme = function(newTheme) {
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("__theme", newTheme);
  // More logic...
};

const storedTheme = localStorage.getItem("__theme");

if (storedTheme) {
  window.__setTheme(storedTheme);
}
```

Then we make the button change the theme:

```js
const button = document.querySelector("button.theme-toggler");

button.addEventListener("click", function() {
  if (document.body.dataset.theme === "dark") {
    window.__setTheme("light");
    return;
  }
  window.__setTheme("dark");
});
```

{{< note >}}
The script tag _has_ to be inline, otherwise the flash will still
happen.
{{< /note >}}

# Transition between themes

This works, but we want some animations:

```css
body {
  transition: color 0.25s ease-out, background 0.25s ease-out;
}
```

Now you reload the page and things are broken again, because the transition will
happen on reload.
[To prevent this, I used this trick from CSS-Tricks:](https://css-tricks.com/transitions-only-after-page-load/)

```html
<body class="preload"></body>
```

```css
.preload {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -ms-transition: none !important;
  -o-transition: none !important;
}
```

```js
window.addEventListener("load", function() {
  document.body.classList.remove("preload");
});
```

# Respect system preferences

Finally, to respect the
[`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
media query, we add to our first script:

```js
const storedTheme = localStorage.getItem("__theme");

if (storedTheme) {
  window.__setTheme(storedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  window.__setTheme("dark");
}
```

So that, if there's nothing in `localStorage`, we respect system settings.

# Hugo implementation details

In `layouts/_default/baseof.html` template, we need something like this:

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html>
  <head>
  </head>

  <body data-theme="light" class="preload">
    {{ partial "theme.html" }}

    ...

    {{ partial "theme-button.html" }}
  </body>
</html>
```

In `partials/theme.html` we change theme based on `localStorage` or
`prefers-color-scheme`. In `layouts/partials/theme-button.html` we customize the
button.

Also, to change syntax highlighting colorscheme, we need to add
`pygmentsUseClasses = true` to our configuration file.

Then, we need to generate stylesheets for each different colorscheme and move
them to our assets folder.

```shell-sesson
$ hugo gen chromastyles --style=monokai > dark-syntax-highlight.css
$ hugo gen chromastyles --style=lovelace > light-syntax-highlight.css
```

Add them to our html (with the dark stylesheet disabled).

<!-- prettier-ignore -->
```html
{{ $syntaxHighlight := resources.Get "css/light-syntax-highlight.css" }}
{{ $darkSyntaxHighlight := resources.Get "css/dark-syntax-highlight.css" }}

<link rel="stylesheet" href="{{ $syntaxHighlight.RelPermalink }}" />
<link rel="stylesheet" href="{{ $darkSyntaxHighlight.RelPermalink }}" disabled />
```

And handle enabling/disabling stylesheet when theme changes with JavaScript:

```js
window.__setTheme = function(newTheme) {
  // ...
  const oldTheme = newTheme === "dark" ? "light" : "dark";
  document
    .querySelector("link[href*='" + oldTheme + "']")
    .setAttribute("disabled", "");
  document
    .querySelector("link[href*='" + newTheme + "']")
    .removeAttribute("disabled");
};
```

And that's it, hopefully we can enjoy dark mode now.
