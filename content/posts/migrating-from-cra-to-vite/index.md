---
title: "Migrating from CRA to Vite"
date: 2021-04-23
categories: ["Programming", "JavaScript", "TypeScript", "Tools"]
tags: ["javascript", "typescript"]
---

I started to learn React with `create-react-app` like everyone else, and it
really does its job well. I never had to worry too much about tooling but... it
is slow to start up.

This never bothered me too much but it's noticeable and noticeable and everyone
would agree it could be better. Lately, we're finally witnessing projects meant
to solve this very problem, more noticeably
[esbuild](https://github.com/evanw/esbuild) and [Vite](https://vitejs.dev/),
and I was surprised at how well Vite worked.

I just migrated a small app of mine, mostly written in Typescript, to Vite and
it took me a few hours messing with configuration files.

# Initial setup

First, I installed Vite:

```sh
npm install vite
```

Updated my npm scripts:

```diff
diff --git a/package.json b/package.json
index f3307f5..32724e4 100644
--- a/package.json
+++ b/package.json
@@ -31,10 +31,10 @@
     "typescript": "^4.1.2"
   },
   "scripts": {
-    "start": "react-app-rewired start",
+    "start": "vite",
-    "build": "react-app-rewired build",
+    "build": "vite build",
     "test": "react-scripts test",
```

Next, I needed to modify my index.html file. [The following steps are explained
in more detail here](https://vitejs.dev/guide/#index-html-and-project-root).

Moved my `index.html` from the `./public` folder to my root folder and added
a `script` tag with my JS entry point as its `src` attribute.

```diff
diff --git a/public/index.html b/index.html
similarity index 88%
rename from public/index.html
rename to index.html
index ecb0830..3abb36f 100644
--- a/public/index.html
+++ b/index.html
@@ -12,5 +12,6 @@
   <body>
     <noscript>You need to enable JavaScript to run this app.</noscript>
     <div id="root"></div>
+    <script type="module" src="/src/index.jsx"></script>
   </body>
 </html>
```

I didn't had to but if you have any `%PUBLIC_URL%` in your html file, just
replace it with `/`, as explained in the linked article.

# TypeScript setup

At this point, I couldn't get my app to run because I took advantage of
`tsconfig.json` `include` properties to make absolute imports, which Vite
didn't understand.

The solution was simple: install a Vite plugin called
[`vite-tsconfig-paths`](https://github.com/aleclarson/vite-tsconfig-paths)
which supports, apart from [path
mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping),
`include` and `exclude` properties as well:

```sh
npm install vite-tsconfig-paths
```

Once installed, we add it to our `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [tsconfigPaths()],
});
```

I also set the output directory to be `build`, instead of the default `dist`,
because that's what CRA uses.

After that, I was able to start a server and see my app running.

# Jest setup

Because I intend to remove `react-scripts` from my project, I need to figure
out how to run my Jest tests without `react-scripts test`.

I needed a way to get Jest to understand/transpile TypeScript and JSX.

Fortunately, there is project just for that purpose already
[`ts-jest`](https://kulshekhar.github.io/ts-jest/), so all we need to do is to
add it as a jest preset in `jest.config.js`:

```js
module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>src/setupTests.ts"],
  testPathIgnorePatterns: ["<rootDir>/cypress/"],
  moduleDirectories: ["node_modules", "src"]
};
```

For my specific setup, I also needed to:

- Ignore `*.spec.js` files inside `./cypress` folder
- Rename `./src/setupTests.js` to `./src/setupTests.ts`. Otherwise, types from
  the `@testing-library/jest-dom/extend-expect` wouldn't be imported.
- Add `"src"` to `moduleDirectories`, because it would not understand absolute
  imports that look up paths inside `tsconfig.json` `include` property

# Conclusion

I just finished setting this up, but it seems to be working fine so far.

I'm excited about the things going on in the JavaScript tooling ecosystem, I
think we can expect great things to come.

That said, `create-react-app` is a wonderful tool that I'll probably continue
to use. And, as the project states:

> Create React App is a comfortable environment for learning React

It's undeniable that it has been doing its jobs very well.
