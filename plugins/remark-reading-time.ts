import { toString as mdastToString } from 'mdast-util-to-string'
import getReadingTime from 'reading-time'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'

export const remarkReadingTime: Plugin<[], Root> = () => {
  return function (tree, file) {
    const textOnPage = mdastToString(tree)
    const readingTime = getReadingTime(textOnPage)

    // @ts-expect-error FIXME: find a way to inject frontmatter safely
    file.data.astro.frontmatter.readingTime = readingTime.minutes
  }
}
