import type { Root } from 'mdast'
import { toString as mdastToString } from 'mdast-util-to-string'
import type { Plugin } from 'unified'

export const remarkSummary: Plugin<[], Root> = () => {
  return function (tree, file) {
    const firstParagraph = tree.children.find(
      (child) => child.type === 'paragraph'
    )

    // @ts-expect-error FIXME: find a way to inject frontmatter safely
    file.data.astro.frontmatter.summary = mdastToString(firstParagraph)
  }
}
