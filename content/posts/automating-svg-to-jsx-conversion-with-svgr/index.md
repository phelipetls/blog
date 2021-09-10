---
title: "Automating svg to jsx conversion with svgr"
date: 2021-09-08
tags: ["react", "javascript", "typescript"]
---

I found that getting svg files from Figma ready to be used in your React
applications can be a bottleneck and prone to error. One way to tackle this is
by using [svgr](https://react-svgr.com/) to do this. Its defaults are good
enough, but you're more likely to customize the JavaScript output with a
[template](https://react-svgr.com/docs/custom-templates/).

These templates are babel plugins. Learning how to build one can be quite
intimidating since it's a
[huge](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)
topic, but worth it.

In this blog post I want to share a template that converts a svg like this:

```svg
<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="" />
</svg>
```

...into this React component:

```tsx
import React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

export const SvgComponent: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="" />
    </SvgIcon>
  );
};
```

You'll notice it uses the Material-UI's [SvgIcon](https://next.material-ui.com/api/svg-icon/) component and it's written in TypeScript.

It has some tricky things like type annotations and spread syntax, which is not
obvious how to insert with babel. So let's get to it.

First, the full code if you're only interested in that, but I'll break down the
code further below:

```javascript
const {
  identifier,
  tsTypeAnnotation,
  tsTypeReference,
  tsTypeParameterInstantiation,
  jsxClosingElement,
  jsxElement,
  jsxIdentifier,
  jsxOpeningElement,
  jsxSpreadAttribute,
} = require('@babel/types')

const template = (
  { template },
  opts,
  { imports, componentName, props, jsx, exports },
) => {
  const plugins = ['jsx', 'typescript']

  const typescriptTemplate = template.smart({ plugins })

  const wrappedJsx = jsxElement(
    jsxOpeningElement(jsxIdentifier('SvgIcon'), [
      ...jsx.openingElement.attributes,
      jsxSpreadAttribute(identifier('props')),
    ]),
    jsxClosingElement(jsxIdentifier('SvgIcon')),
    jsx.children,
    false
  )

  componentName.typeAnnotation = tsTypeAnnotation(
    tsTypeReference(
      identifier('React.FC'),
      tsTypeParameterInstantiation([tsTypeReference(identifier('SvgIconProps'))])
    )
  )

  return typescriptTemplate.ast`
    import React from 'react'
    import { SvgIcon, SvgIconProps } from '@material-ui/core'

    export const ${componentName} = (props) => {
      return (
        ${wrappedJsx}
      )
    }
  `
}

module.exports = template
```

First, we use the TypeScript plugin by default to build the AST, there is no
opt out of it:

```javascript
const plugins = ['jsx', 'typescript']

const typescriptTemplate = template.smart({ plugins })
```

# Jsx

Now, the jsx part. Our goal is to replace the built-in `svg` element with the
`SvgIcon` component. We can do this by creating a new
[`jsxElement`](https://babeljs.io/docs/en/babel-types#jsxelement), change its
[opening](https://babeljs.io/docs/en/babel-types#jsxopeningelement) and
[closing](https://babeljs.io/docs/en/babel-types#jsxclosingelement) elements to
be `SvgIcon` and reuse the child elements (don't mind doing this recursively,
but we could I guess).

```javascript
const wrappedJsx = jsxElement(
  jsxOpeningElement(jsxIdentifier('SvgIcon'), [
    ...jsx.openingElement.attributes,
    jsxSpreadAttribute(identifier('props')),
  ]),
  jsxClosingElement(jsxIdentifier('SvgIcon')),
  jsx.children,
  false
)
```

You'll notice how we reuse the same attributes from the original jsx opening
element and also spread `props` into them using
[jsxSpreadAttribute](https://babeljs.io/docs/en/babel-types#jsxspreadattribute).

# Type Annotation

Now, to inject the type annotation into the template is what took me the most part.

Initially I thought that this would have worked:

{{< highlight javascript "hl_lines=7" >}}
// ...

return typescriptTemplate.ast`
  import React from 'react'
  import { SvgIcon, SvgIconProps } from '@material-ui/core'

  export const ${componentName}: React.FC<SvgIconProps> = (props) => {
    return (
      ${wrappedJsx}
    )
  }
`
{{< /highlight >}}

But the type annotation, `: React.FC<SvgIconProps>` is stripped out from the
final output file.

Then I went with this hack:

```javascript
componentName.name = 'SvgComponent: React.FC<SvgIconProps>'
```

This works but it doesn't spark joy... Then I decided to put in more effort and
I came up with this (more verbose) solution:

```javascript
componentName.typeAnnotation = tsTypeAnnotation(
  tsTypeReference(
    identifier('React.FC'),
    tsTypeParameterInstantiation([tsTypeReference(identifier('SvgIconProps'))])
  )
)
```

It cost me some more hours but it made me learn more about how to build AST
nodes so the next time I have to do it will be hopefully more easy. I figured
this out by reading the [babel-types](https://babeljs.io/docs/en/babel-types)
docs.

# Usage in Vim

If you're a vimmer, you can convert the current file by using `%!npx @svgr/cli
--template path/to/template.js`, which will pass the entire file to the command
as standard input and replace its content with the command's standard output.
In case you didn't know, this is a built-in feature called
[filter](http://vimdoc.sourceforge.net/htmldoc/change.html#filter).

You could also configure your project to use a template by default with a
[`.svgrrc`](https://react-svgr.com/docs/configuration-files/) file at the
project's root folder:

```javascript
// .svgrrc.js
module.exports = {
template: require('./path/to/template.js')
}
```

# Usage in VS Code

Of course, svgr also has a [VS Code
extension](https://marketplace.visualstudio.com/items?itemName=NathHorrigan.code-svgr).
But, if you prefer, you could use the [Edit With Shell
Command](https://marketplace.visualstudio.com/items?itemName=ryu1kn.edit-with-shell)
extension, which allows you to do something similar to Vim's filter.

# TODOs

Here are some improvements I couldn't figure out how to do/don't care so much,
but it would be nice to have:

- Use the file name as component name.
- Retain empty lines in the final output.
- Remove semicolons.

Right now this still requires some manual labor to get 100% right, but it's ok.

# Conclusion

Ideally I shouldn't be converting svg files into React components in this ad
hoc way, but rather use a library with all the icons ready, which unfortunately
nobody at work bothered to make.

But svgr seems like a good idea for maintaining an icons library, since I could
then update an arbitrary number of files by changing just a template and
running a cli program, which isn't bad.
