import type { Root } from 'hast'
import { toString as hastToString } from 'hast-util-to-string'
import parse from 'fenceparser'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const rehypeSyntaxHighlight: Plugin<[], Root> = () => {
  return function (tree) {
    visit(tree, 'element', (node, __, parent) => {
      if (
        !parent ||
        !('tagName' in parent) ||
        parent.tagName !== 'pre' ||
        node.tagName !== 'code'
      ) {
        return
      }

      let lang = 'plaintext'
      if (Array.isArray(node.properties.className)) {
        lang =
          node.properties.className
            .filter(function isString(v): v is string {
              return typeof v === 'string'
            })
            .find((className: string) => className.startsWith('language-'))
            ?.replace('language-', '') ?? 'plaintext'
      }

      const metastring = node.properties.metastring ?? ''
      const meta = typeof metastring === 'string' ? parse(metastring) : {}

      const title = typeof meta.title === 'string' ? meta.title : ''

      const code = hastToString(node).replace(/\n+$/, '')

      parent.properties = {
        ...parent.properties,
        title,
        highlight: JSON.stringify(meta.highlight ?? {}),
        code,
        lang,
        twoslash: Boolean(meta.twoslash),
      }
    })
  }
}
