---
layout: "post"
title: "Implementing dark mode for SSR websites"
date: 2021-04-28
tags: ["hugo", "html", "css", "javascript"]
draft: true
---

I know there are a lot of resources about this already but I'll make one anyway
because I was impressed at how much harder it is than I initially thought.

There a lot of hacky things you need to do to make things work properly, so
let's get started.

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

# Theme persistence across reloads

To make theme persist, we'll use
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

The fix is to recover the theme from `localStorage` as early as possible. But
this also means that we won't be able to add an event listener to the button
because it doesn't exist yet:

```html
<body data-theme="light">
  <script>
    <!-- load theme from localStorage -->
  </script>

  ...

  <script>
    <!-- add button logic -->
  </script>
</body>
```

But that way we won't be able to share logic between scripts so (here comes the
hack) we will use a global variable to do it.

First, we set the theme inside `localStorage` (if any).

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

Then we make the button toggle theme:

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

**NOTE:** The script tag _has_ to be inline, otherwise the flash will still
happen.

# Add transition between themes

This works but we want to animate it:

```css
body {
  transition: color 0.25s ease-out, background 0.25s ease-out;
}
```

Now things are broken again, because the transition will happen on reload.
[To prevent this, I used this tip from this CSS-Tricks article.](https://css-tricks.com/transitions-only-after-page-load/)

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

If there's nothing in `localStorage`, we respect system settings.

# Hugo implementation details

In my `layouts/_default/baseof.html` template

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

Then, we need to generate stylesheets for each different colorscheme and add it
our assets folder.

```sh
hugo gen chromastyles --style=monokai > dark-syntax-highlight.css
hugo gen chromastyles --style=lovelace > light-syntax-highlight.css
```

Add them to our html (with the dark stylesheet disabled).

<!-- prettier-ignore -->
```html
{{ $syntaxHighlight := resources.Get "css/light-syntax-highlight.css" }}
{{ $darkSyntaxHighlight := resources.Get "css/dark-syntax-highlight.css" }}

<link rel="stylesheet" href="{{ $syntaxHighlight.RelPermalink }}" />
<link rel="stylesheet" href="{{ $darkSyntaxHighlight.RelPermalink }}" disabled />
```

Handle enabling/disabling stylesheet when theme changes:

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

And that's it.
