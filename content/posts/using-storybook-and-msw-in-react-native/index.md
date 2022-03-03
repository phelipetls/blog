---
title: "Using Storybook and MSW in React Native"
date: 2022-03-02
tags: ['react native', 'javascript', 'mobile', 'storybook', 'msw']
---

The integration between [Storybook](storybook.js.org/) and [Mock Service
Worker](https://mswjs.io/) enables you to develop components isolated from your
app and your back-end server.

This is
[not](https://hmh.engineering/storybook-and-mock-service-worker-a-match-made-in-heaven-e762bd7951ce)
[new](https://blog.logrocket.com/using-storybook-and-mock-service-worker-for-mocked-api-responses/)
on the web, the
[`msw-storybook-addon`](https://storybook.js.org/addons/msw-storybook-addon)
makes it easy to get started. It's another story for React Native though, since
[MSW has only recently started supporting it](https://github.com/mswjs/msw/issues/203).

I find this combination of tools invaluable, so I couldn't resist attempting to
make it work in React Native, even though it's pretty new.

In this post, I'm gonna explain in detail how I did it.

{{< note >}}
**tl;dr:** You can read the [example
repository](https://github.com/phelipetls/react-native-storybook-msw) or this
[pull request](https://github.com/phelipetls/react-native-storybook-msw/pull/1)
instead.
{{< /note >}}

# How `msw-storybook-addon` works?

Our end goal is to port `msw-storybook-addon` to React Native. So let's first
understand how it works.

This is a library by the MSW team that provides you with a
[global Storybook decorator](https://storybook.js.org/docs/react/writing-stories/decorators).
From the docs, [here's how you add to your Storybook configuration](https://github.com/mswjs/msw-storybook-addon):

```js
// ./storybook/preview.js
import { initialize, mswDecorator } from 'msw-storybook-addon';

initialize();
export const decorators = [mswDecorator];
```

And [here's how you use
it](https://github.com/mswjs/msw-storybook-addon#usage):

```js
import { rest } from 'msw'
import { UserProfile } from './UserProfile'

export const SuccessBehavior = () => <UserProfile />

SuccessBehavior.parameters = {
  msw: {
    handlers: [
      rest.get('/user', (req, res, ctx) => {
        return res(
          ctx.json({
            firstName: 'Neil',
            lastName: 'Maverick',
          })
        )
      }),
    ]
  },
}
```

This code is using Storybook v6, but only Storybook v5 is available for React
Native. Fortunately, both versions support decorators, they differ mostly about
how you configure/use it:

```js {hl_lines=["3-4","8-9"]}
// storybook/index.js
import { getStorybookUI, configure } from '@storybook/react-native'
import { addDecorator } from '@storybook/react-native'
import { withMsw, initialize } from './mswDecorator'

import './rn-addons'

initialize()
addDecorator(withMsw)

// import stories
configure(() => {
  require('../components/Task.stories.js')
}, module)

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
})

export default StorybookUIRoot
```

# Porting `msw-storybook-addon` to React Native

A decorator is simply a function that does something before rendering the
storybok, which is a React component.

Here's what we need to do before rendering the story:

* Initialize the MSW server.
* Clean it up, which means to reset old request handlers.
* Set up the new request handlers, if any.

Our implementation should not differ very much from the `msw-storybook-addon`
[implementation](https://github.com/mswjs/msw-storybook-addon/blob/35a4b198a4b4eead9a2d0771f81460c6788e77a7/packages/msw-addon/src/mswDecorator.ts#L69-L102).

## First problem: how to initialize the server?

We can't use [`setupWorker`](https://mswjs.io/docs/api/setup-worker) because
we're not in a browser, we don't have service workers.
[`setupServer`](https://mswjs.io/docs/api/setup-server) also won't work,
because we're not in a Node.js environment.

It turns out that we need to use the `setupServer` function from the
`msw/native` module. This is still undocumented, you'll only read about it in
[this GitHub issue](https://github.com/mswjs/msw/issues/203) and in [this
example with more details on how to use
it](https://github.com/mswjs/examples/pull/60).

## Implementation

What follows is an implementation that worked for me. You can ignore all non
highlighted code, since it's only meant to stay compatible with the
[`msw-storybook-addon`
API](https://github.com/mswjs/msw-storybook-addon/blob/35a4b198a4b4eead9a2d0771f81460c6788e77a7/packages/msw-addon/src/mswDecorator.ts#L69-L102).

```js {hl_lines=["2","3-12","15"]}
// ./mswDecorator.js
import 'react-native-url-polyfill/auto'
import { setupServer } from 'msw/native'

const server = setupServer()

export const initialize = () => {
  // Do not warn or error out if a non-mocked request happens.
  // If we don't use this, Storybook will be spammy about requests made to
  // fetch the JS bundle etc.
  server.listen({ onUnhandledRequest: 'bypass' })
}

export const withMsw = (storyFn, { parameters: { msw } }) => {
  server.resetHandlers()

  if (msw) {
    if (Array.isArray(msw) && msw.length > 0) {
      // Support an Array of request handlers (backwards compatibility).
      server.use(...msw)
    }
  } else if ('handlers' in msw && msw.handlers) {
    // Support an Array named request handlers handlers
    // or an Object of named request handlers with named arrays of handlers
    const handlers = Object.values(msw.handlers)
      .filter(Boolean)
      .reduce(
          (handlers, handlersList) => handlers.concat(handlersList),
          [] as RequestHandler[]
          )

      if (handlers.length > 0) {
        api.use(...handlers)
      }
  }

  return storyFn()
}
```

You'll notice that we import a polyfill. [This is required, as explained in
this Pull Request with an
example](https://github.com/mswjs/examples/pull/60/files):

>  The polyfill `react-native-url-polyfill` is required or else calling
>  `server.start()` will result in an Error: not implemented message followed
>  by Error: Invariant Violation: Module AppRegistry is not a registered
>  callable module (calling runApplication)... due to the barebones React
>  Native URL polyfill that throws Not Implemented exceptions for functions
>  that MSW calls such as
>  [search()](https://github.com/facebook/react-native/blob/cd347a7e0ed29ae1049e041fcb34588e1aac76f9/Libraries/Blob/URL.js#L194).

# Usage

Now things should work exactly like `msw-storybook-addon`, except that you'll
be using Storybook v5, so it's a little bit different:

```jsx
import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { rest } from 'msw'
import { UserProfile } from './UserProfile'

storiesOf('Routes', module)
  .add('SuccessBehavior', () => <UserProfile />, {
    msw: {
      handlers: [
        rest.get('/user', (req, res, ctx) => {
          return res(
            ctx.json({
              firstName: 'Neil',
              lastName: 'Maverick',
            })
          )
        }),
      ],
    },
  })
```

# Example repository using the official `react-native` CLI

To prove my point, I implemented the whole thing in a brand new React Native
project using `react-native` CLI:

```sh
npx react-native init projectName
```

[You can check the final result in this GitHub
repository](https://github.com/phelipetls/react-native-storybook-msw). Here's a
video:

{{< video "./demo-msw-storybook-react-native.mp4" >}}

To my surprise, I struggled the most to get Storybook working. I came up with
issues related with a Promise polyfill that caused `Promises` to never resolve
and to [`Promise.finally` being
undefined](https://github.com/storybookjs/react-native/issues/20). I fixed it
by using `patch-package` to remove the line importing the polyfill, [as the
`@storybook/react-native` maintainer
recommended](https://github.com/storybookjs/react-native/issues/20#issuecomment-1046101914). This is
unfortunate... I hope that a stable Storybook v6 comes soon enough for React
Native.

Besides that, everything worked as expected and I hope it works for your
project too! I didn't have this problem with a project using Expo's Bare
Workflow, not sure why though.

# Advice for `react-query` users

If you use `react-query`, I think it's also wise to call
[`QueryClient.clear`](https://react-query.tanstack.com/reference/QueryClient#queryclientclear)
in a decorator, to avoid surprises with the cache.

```javascript
// storybook/index.js
import { addDecorator } from '@storybook/react-native'
import { queryClient } from '../lib/react-query'

addDecorator((storyFn) => {
  queryClient.clear()

  return storyFn()
})
```
