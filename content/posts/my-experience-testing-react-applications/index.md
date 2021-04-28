---
layout: post
title: "My experience testing React applications"
date: 2021-04-29
tags: ["react", "javascript"]
---

Testing is not easy, it's a trade-off: either you slow down new feature
development by writing test to avoid regressions later, or you develop untested
features and bugs will inevitably be introduced later.

But I can understand how that ends up happening: we have to develop new features
fast and we don't have time for tests. It's not easy writing tests, but it's a
skill we have to develop. I try to do this with my side projects.

I started to write tests for my Python projects with the `unittest` and `pytest`
libraries. I wasn't very good at it as everything was new to me but I was
obsessed with getting a ~100% test coverage badge in the README so I persisted.
The benefits were obvious: I could refactor all I wanted later.

Sometimes tests got ugly because of all the mock/monkeypatch I needed to do to
make them isolated, which was annoying but it was worth it. It was usually a
seamless and rewarding experience.

But writing tests for React applications is a different beast -- we're testing
user interfaces:

- Things change, often asynchronously, which means we need to wait for them to
  appear or disappear.
- We need to simulate user interactions.
- There are a lot more network requests to mock, so it's harder to isolate.
- Integration test are more useful than unit tests, so tests are more complex.
- It's harder to debug (I didn't find an equivalent of `pytest --pdb`).
- It's **much slower**.

In this blog post I'm going to talk about my experience with JavaScript
libraries for testing front-end web apps.

# `react-testing-library`

This library seems to be what everyone is using now, and I do see how that
happened. It has a very consistent API and good documentation.

I liked that:

- You can get elements on the screen with
  [queries that resembles the DOM API](https://testing-library.com/docs/queries/about/).
- You don't have to
  [wrap anything in `act`](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#wrapping-things-in-act-unnecessarily).

I disliked that:

- It was hard to debug (difficult to grasp the UI state from the output of
  `screen.debug()`)
- You have to
  [wait for appearance and disappearance explicitly](https://testing-library.com/docs/guide-disappearance).
- Requires some boilerplate to
  [set up your tests](<(https://testing-library.com/docs/react-testing-library/setup/)>)
  \(for example, to wrap some components in
  [MemoryRouter](https://reactrouter.com/web/api/MemoryRouter), context
  providers,
  [QueryClient](https://react-query.tanstack.com/reference/QueryClient)\).
- Your tests have to run in a node.js/jsdom environment, so (for example) if you
  use canvas in your app,
  [it won't work out of the box](https://github.com/jsdom/jsdom#canvas-support).

But it got the job done most of the time.

I usually combined it with `nock` and `msw` for mocking network requests.

# `nock`

The `nock` library works in node-only environment and has a well-thought, easy
to use API.

In my experience, it has just a few unexpected issues like
[not working with axios out of the box](https://www.npmjs.com/package/nock#axios).

# `msw`

I later also tried `msw` after reading
[Stop mocking fetch](https://kentcdodds.com/blog/stop-mocking-fetch/) by Kent C.
Odds, and I liked it at lot. It can work in a browser (as a service worker) or
node.js (by intercepting requests made by native modules).

The problems I had with it is that it does not recognize URL search/query params
in the URL,
[you have to parse it yourself in the response handler](https://github.com/mswjs/msw/issues/71).
This is by design though, it's just something I disliked.

Also, all mocks are usually in a separate file, like in `./mocks/handlers.js`,
which I thought made tests harder to read. It doesn't have to be like that of
course, but it's response handlers can get pretty long so it's a sane option.

# `cypress`

All of these led me to try [`Cypress`](https://docs.cypress.io/), and I'm
inclined to say it is my favorite solution so far.

You don't have to explicitly wait for anything to appear or disappear because it
does so automatically by
[retrying it multiple times until a timeout is reached](https://docs.cypress.io/guides/core-concepts/retry-ability)
and it has a built-in API for mocking network requests with the
[intercept function](https://docs.cypress.io/api/commands/intercept).

But it's not perfect either:

- It has its own quirks like using the `window` object might not work as you
  expect because
  [Cypress uses two different windows](https://docs.cypress.io/api/commands/window#Cypress-uses-2-different-windows).
- The `intercept` API has some unexpected behaviors like
  [requiring URLs to be properly encoded](https://github.com/cypress-io/cypress/issues/15956),
  and others only recently fixed like its
  [most recent calls not overriding earlier ones](https://github.com/cypress-io/cypress/issues/9302).

The benefits far outweigh these problems, mainly around debuggability:

- Each step (assertion, interceptions) is traced and shown by the test runner.
- You have access to browser debugging capabilities, so you have access to the
  browser DevTools.
- There are snapshots of the UI state for each step.
- Screenshots and videos of the test runs are recorded by default.

# Conclusion

I think everyone would agree that Cypress is much well-suited for integration
tests. I thought `react-testing-library` to be complicated for complex
functional tests, so I'd prefer to use it for unit testing small component
logic.
