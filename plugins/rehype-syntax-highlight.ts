import type { Root } from 'hast'
import { toString as hastToString } from 'hast-util-to-string'
import parse from 'fenceparser'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const rehypeSyntaxHighlight: Plugin<[], Root> = () => {
  return async function (tree) {
    return visit(tree, 'element', (node, __, parent) => {
      if (
        !parent ||
        !('tagName' in parent) ||
        parent.tagName !== 'pre' ||
        node?.tagName !== 'code'
      ) {
        return
      }

      let lang = 'plaintext'
      if (Array.isArray(node.properties?.className)) {
        lang =
          node.properties?.className
            .filter(function isString(v): v is string {
              return typeof v === 'string'
            })
            .find((className: string) => className.startsWith('language-'))
            ?.replace('language-', '') ?? 'plaintext'
      }

      const metastring = node.properties?.metastring ?? ''
      const meta = parse(metastring as string) ?? {}

      const title = typeof meta.title === 'string' ? meta.title : ''

      // Transform '{ '1-3': true, '5': true }' into 1-3,5
      const highlight =
        meta.highlight &&
        typeof meta.highlight === 'object' &&
        !Array.isArray(meta.highglight)
          ? Object.keys(meta.highlight).join(',')
          : ''

      const code = hastToString(node).replace(/\n+$/, '')

      parent.properties = {
        ...parent.properties,
        title,
        highlight,
        code,
        lang,
        twoslash: Boolean(meta.twoslash),
      }
    })
  }
}
