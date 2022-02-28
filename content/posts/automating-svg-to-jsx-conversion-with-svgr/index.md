---
title: "Automating SVG to JSX conversion with svgr"
date: 2021-09-08
tags: ["react", "javascript", "typescript"]
---

Transforming SVG files into JSX is boring and prone to error. We can handle it
better with [svgr](https://react-svgr.com/). Its defaults are good enough, but
you'll likely need to customize it for your needs, which is made possible by writing a
[template](https://react-svgr.com/docs/custom-templates/).

These templates are babel plugins. Learning how to build one can be
intimidating since it's a
[huge](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)
topic, but it's worth it.

In this blog post I want to share a template that converts this SVG file:

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

So we need to wrap the SVG around the
[SvgIcon](https://next.material-ui.com/api/svg-icon/) component from
Material-UI library, with type annotations and we need to override props using the spread syntax.

# Template

Here's the template that worked for me, followed by the explanation.

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

## Setting up plugins

We need to use the TypeScript plugin:

```javascript
const plugins = ['jsx', 'typescript']

const typescriptTemplate = template.smart({ plugins })
```

## Building the JSX

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

# Writing type annotations

I thought that this would work:

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

This works but it doesn't feel right... This seems to be the proper, although
more verbose, way:

```javascript
componentName.typeAnnotation = tsTypeAnnotation(
  tsTypeReference(
    identifier('React.FC'),
    tsTypeParameterInstantiation([tsTypeReference(identifier('SvgIconProps'))])
  )
)
```

To come up with this, I needed to learn how to properly [build an AST with
Babel](https://babeljs.io/docs/en/babel-types).

# Usage in Vim

If you use Vim, you can convert a file using `%!npx @svgr/cli --template
path/to/template.js`. In case you didn't know, this is a built-in feature
called [filter](http://vimdoc.sourceforge.net/htmldoc/change.html#filter).

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

`svgr` also has a [VS Code
extension](https://marketplace.visualstudio.com/items?itemName=NathHorrigan.code-svgr).
But, if you prefer, you could use the [Edit With Shell
Command](https://marketplace.visualstudio.com/items?itemName=ryu1kn.edit-with-shell)
extension, which is similar to Vim's filter feature.

# Pending improvements

Here are some improvements I couldn't figure out how to do/don't care so much,
but it would be nice to have:

- Use the file name as component name.
- Retain empty lines in the final output.
- Remove semicolons.

Right now this still requires some manual labor to get 100% right, but it's ok.
