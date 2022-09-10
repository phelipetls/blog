---
title: A surprising React bug
date: 2022-09-10
tags: [react, javascript, html]
---

The `details` HTML element doesn't work well when we use it as a controlled
component in React. I like using plain HTML elements whenever I can, but this
time I got bitten by this issue, [which is still open on
GitHub](https://github.com/facebook/react/issues/15486).

Here it is:

{{< react path="details-summary-react-bug.js" version="18.2.0" >}}

Here's a video showing it next to an HTML inspector:

{{< video src="details-summary-react-bug.webm" caption="The details HTML element open attribute is not synchronized with React's state" >}}

The `isOpen` state changes as expected, but the `<details>` element's `open`
attribute is not synchronized with it -- or rather, it's in a negative way, as
if we're passing `open={!isOpen}`.

# Why?

It turns out React is "doing the right thing", but in the end things break
because the `details` element has state of its own that React doesn't know
about.

In short, the issue is that there are two sources of truth for the `open`
attribute -- React and the browser.

[This was masterfully explained in this GitHub
comment](https://github.com/facebook/react/issues/15486#issuecomment-873516817).
The user begins by explaining what happens the first time we click the button:

1. The `onClick` event handler of the `summary` element is triggered, which
   changes `isOpen` from `false` to `true`.
2. React re-renders, setting the `open` attribute of the `details` element to
   `true`.
3. The default behavior of the `details` element toggles its `open` state,
   reversing it back to `false` -- but React doesn't know about it.

So that's how the `details` element ends up without an `open` attribute
(equivalent to `isOpen={false}`) while our `isOpen` state is `true` -- the
browser removed it and React doesn't know about it.

On the second click:

1. The `onClick` handler of the `summary` element is triggered, which toggles
   `isOpen` to `false`.
2. React re-renders, and finds `details` already closed, so it doesn't change
   it.
3. The default behavior of the `details` element toggles its `open` state again
   -- it was `false` (closed) so it changes it to `true` (open), and React has
   no clue.

Everything is broken.

# Workarounds

## `e.preventDefault()`

The fix is to call `preventDefault` on the `onClick` event handler of the
`summary` element:

{{< react path="details-summary-react-prevent-default.js" hl_options=`hl_Lines=12-13` version="18.2.0" >}}

This fixes it because now only React controls the `open` attribute.

## `toggle` event

Another way is to listen to the `toggle` event handler, which I learned about
thanks to this bug:

{{< react path="details-summary-react-toggle.js" hl_options=`hl_Lines=10-15` version="18.2.0" >}}

But unfortunately, this may still cause trouble. For instance, a button that
toggles `isOpen` on click, like the "Toggle details" button below, will cause
an infinite loop:

{{< react path="details-summary-react-toggle-infinite-loop.js" hl_options=`hl_Lines=20` version="18.2.0" >}}

Here's how this happens:

1. The button `onClick` event listener toggles `isOpen`, which changes the
   `open` attribute.
2. The `open` attribute change fires the `toggle` event, which executes the
   `onToggle` event listener.
3. The `onToggle` event listener toggles `isOpen`, which changes the `open`
   attribute -- so we're back to step 2, hence the infinite loop.

# What about other frameworks?

I later wondered if other JavaScript frameworks -- specifically Solid, Svelte
and Vue -- could handle this any better, so I tried to reproduce the issue
using their "playgrounds" web apps.

Surprisingly (to me), **they all have the same issue**!

Here are links to playgrounds where the issue is reproduced:

- [Vue][vue-playground-url]
- [Solid][solid-playground-url]
- [Svelte][svelte-playground-url]

# Not a React bug?

In light of this, **I don't think it's fair to say this is a React bug**.

It sure is an application bug, but it's not React's fault. The problem is that
there more than a single source of truth controlling the `open` state, which is
to ask for trouble.

In fact, all of this suggested to me that it would still happen in vanilla
JavaScript. And indeed it does:

{{< html path="details-summary-vanilla-javascript.html" hl_options=`hl_lines=10-29` >}}

# Closing thoughts

In conclusion, this seems to be a more fundamental issue with how the `details`
element work. For now, there's no way around it than just get used to
immediately calling `e.preventDefault()` on `summary`'s `onClick` event
handlers when controlling the `details` `open` attribute, which will let React
be the single source of truth for its state.

[vue-playground-url]: https://sfc.vuejs.org/#eNp9Ub1OwzAQfpXDS1qpiSU6EaWlSCxMDF29hORaQv0n2ylCUd6dcxJKKFIn6/z9+tyxJ2uzc4ssZ4WvXGMDeAyt3QrdKGtcgA4cHqCHgzMKEqImQgtdGe0DNP7VooZNpCwOpfS4/AWDOR4lvvxQFkvYbKETGiZZdi5li4TczWehe6ELPnahFjQEVFaWAWkCKLwt9XYfaM6h66YGj5AYOhPIIamk8VgnfU8ukRs9SFdjKBvpIY/EjWCjUrDBNfq2SpXuC3aVbKoTEeb9LzSA/cibVHySTSkAz2PMEMmnTAILfnkFW7FxtakqbfbhjablD3uhUgPgBaO3jX6C0crjLNh7CNbnnLfano5ZZRTfEcZdq0OjMK2N2q2z+2z9wOvGh/l9hl6lb858enSUKNhqZs7p8owudahrdOhuhl1x/wReYf9CYyZ9bs/6b1lx2Hs=

[solid-playground-url]: https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqps+YpU6DW09CysrGXoIZlw0WgheAGEGCBdGAAoASn4rXgd4sj5gNDIAeWIILF4yOFwASTKKgF1eAF4HJxd3Lyg1dJlemszLBPyIQt5cWg8PNTgG8uE23iy2gD5q2oWK9IBCEsWILOHw0aFcJgT03LzeAB41m9v7skIoCDXXXGc4RH4DnbZAD8vAA5LQKqDeH9Qcw1LQaiJQZI7vpXu8Nqdnnk7mJvmg1GReBDhK0QADhFlJI9RtiXvQYKhGPhiRBEhpmABrMlTGZzbbCalPOnVBlM-DC56oshiqDMmmS24AEVq6EJitReLVZBpUv0ut4JwgklOQlE4nSq1aGzuySiaV4+qqIlozAZwlwADoPLUAKJzeCpABC+DqImuYCghEIKkyuyNYEkTSAA

[svelte-playground-url]: https://svelte.dev/repl/ad0d7f727ee14f069d53503a6ae32709?version=3.50.1
