import type { Root } from 'hast'
import { toString as hastToString } from 'hast-util-to-string'
import { h } from 'hastscript'
import shiki from 'shiki'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import _ from 'lodash'

const THEME = 'one-dark-pro'

export const rehypeSyntaxHighlight: Plugin<[], Root> = () => {
  return async function (tree) {
    const shikiTheme = await shiki.loadTheme(`themes/${THEME}.json`)

    const highlighter = await shiki.getHighlighter({
      theme: 'one-dark-pro',
    })

    return visit(tree, 'element', (node, __, parent) => {
      if (
        !parent ||
        !('tagName' in parent) ||
        parent.tagName !== 'pre' ||
        node?.tagName !== 'code'
      ) {
        return
      }

      const metastring =
        'metastring' in node.properties
          ? (node.properties.metastring as string)
          : ''

      let title = ''
      if (metastring?.includes('title=')) {
        title = metastring.match(/title="(.+)"/)?.[1]
      }

      if (Array.isArray(node.properties.style)) {
        node.properties.style = node.properties.style.concat([
          `color: ${shikiTheme.fg}`,
        ])
      }

      parent.properties = {
        ...parent.properties,
        shikiBg: shikiTheme.bg,
        shikiFg: shikiTheme.fg,
        title,
      }

      let lang = ''

      if (Array.isArray(node.properties.className)) {
        lang = node.properties.className
          .filter(isString)
          .find((className: string) => className.startsWith('language-'))
          ?.replace('language-', '')
      }

      // Parse highlighted lines, with the syntax '{1-2, 5}'
      const highlightedLines =
        metastring
          .match(/{[0-9-, ]+}/)?.[0]
          .replace('{', '')
          .replace('}', '')
          .split(',')
          .map((s: string) => s.trim())
          .flatMap((str: string) => {
            if (str.includes('-')) {
              const [start, end] = str.split('-')
              return _.range(Number(start), Number(end) + 1)
            }

            return Number(str)
          }) || []

      const plainCode = hastToString(node)

      const themedTokens = highlighter.codeToThemedTokens(plainCode, lang)

      const syntaxHighlightedCode = themedTokens.flatMap((tokens, index) => {
        const isLastLine = index === themedTokens.length - 1
        const isEmptyLine = tokens.length === 0
        const isLineHighlighted = highlightedLines.includes(index + 1)

        return h(
          'span',
          {
            className: ['line', isLineHighlighted && 'highlighted']
              .filter(Boolean)
              .join(' '),
          },
          isEmptyLine && !isLastLine
            ? h('span', {}, ' ')
            : tokens.map((token) => {
                return h(
                  'span',
                  token.color && { style: `color: ${token.color}` },
                  token.content
                )
              })
        )
      })

      parent.properties = {
        ...parent.properties,
        plainCode,
        lang,
      }

      node.children = syntaxHighlightedCode
    })
  }
}

export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}
