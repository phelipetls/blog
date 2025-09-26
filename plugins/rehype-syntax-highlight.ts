import type { Root } from 'hast'
import { toString } from 'hast-util-to-string'
import { toHtml } from 'hast-util-to-html'
import parse from 'fenceparser'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { createHighlighter } from 'shiki'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'

const theme = 'one-dark-pro'

const langs = [
  'vb',
  'java',
  'javascript',
  'mdx',
  'yaml',
  'typescript',
  'jsx',
  'tsx',
  'bash',
  'html',
  'css',
  'json',
  'markdown',
  'python',
  'shell',
  'lua',
  'vim',
  'c',
  'r',
  'diff',
  'scheme',
]

const highlighter = await createHighlighter({
  themes: [theme],
  langs,
})

export const rehypeSyntaxHighlight: Plugin<[], Root> = () => {
  return function (tree) {
    visit(tree, 'element', (node, __, parent) => {
      const isCodeBlock =
        node.tagName === 'code' &&
        parent &&
        'tagName' in parent &&
        parent.tagName === 'pre'

      if (!isCodeBlock) {
        return
      }

      if (Array.isArray(node.properties.className) && node.properties.className.includes('language-math')) {
        return
      }

      let lang = ''
      if (Array.isArray(node.properties.className)) {
        lang =
          node.properties.className
            .filter((v) => typeof v === 'string')
            .find((className: string) => className.startsWith('language-'))
            ?.replace('language-', '') ?? ''
      }

      const metastring =
        typeof node.properties.metastring === 'string'
          ? node.properties.metastring
          : ''

      const code = toString(node).replace(/\n+$/, '')

      const meta = parse(metastring)
      const title = typeof meta.title === 'string' ? meta.title : ''

      const rootHast = highlighter.codeToHast(code, {
        lang,
        theme,
        transformers: [
          transformerMetaHighlight(),
          transformerTwoslash({
            explicitTrigger: true,
            renderer: rendererRich({
              hast: {
                hoverPopup: {
                  tagName: 'div',
                },
                hoverCompose({ popup, token }) {
                  return [
                    token,
                    {
                      type: 'element',
                      tagName: 'template',
                      properties: { class: 'twoslash-popup-template' },
                      content: {
                        type: 'root',
                        children: [popup],
                      },
                      children: [],
                    },
                  ]
                },
              },
            }),
          }),
          {
            line(node) {
              if (node.children.length === 0) {
                node.children = [
                  {
                    type: 'element',
                    properties: {},
                    tagName: 'span',
                    children: [
                      {
                        type: 'text',
                        value: ' ',
                      },
                    ],
                  },
                ]
              }
            },
          },
        ],
        meta: {
          __raw: metastring,
        },
      })

      const preTagHast = rootHast.children.find(
        (node) => node.type === 'element' && node.tagName === 'pre',
      )

      const preStyle =
        preTagHast?.type === 'element' &&
        typeof preTagHast.properties.style === 'string'
          ? preTagHast.properties.style
          : ''

      const syntaxHighlightedCodeAsHtml = toHtml(rootHast)

      parent.properties = {
        ...parent.properties,
        title,
        codeAsPlainText: code,
        syntaxHighlightedCodeAsHtml,
        codeBackground: parseCssStyleBackground(preStyle),
        codeForeground: parseCssStyleForeground(preStyle),
        lang,
      }
    })
  }
}

function parseCssStyleBackground(cssStyle: string): string | null {
  const match = /background-color:\s*(#[0-9a-fA-F]+)/.exec(cssStyle)
  return match ? match[1].trim() : null
}

function parseCssStyleForeground(cssStyle: string): string | null {
  const match = /(?<!background-)color:\s*(#[0-9a-fA-F]+)/.exec(cssStyle)
  return match ? match[1].trim() : null
}
