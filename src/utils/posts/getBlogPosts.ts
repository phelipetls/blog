import { getCollection, type CollectionEntry } from 'astro:content'
import type { Locale } from '@utils/i18n/locales'

const isProd = !import.meta.env.DEV

export function getBlogPosts(
  locale: Locale,
): Promise<CollectionEntry<'posts'>[]> {
  if (locale === 'pt') {
    return getCollection('posts', (blogPost) => {
      const isPortuguese = blogPost.filePath?.endsWith('.pt.mdx')

      if (isProd) {
        const isDraft = blogPost.data.draft
        return isPortuguese && !isDraft
      } else {
        return isPortuguese
      }
    })
  }

  return getCollection('posts', (blogPost) => {
    const isEnglish =
      blogPost.filePath && !blogPost.filePath.endsWith('.pt.mdx')

    if (isProd) {
      const isDraft = blogPost.data.draft
      return isEnglish && !isDraft
    } else {
      return isEnglish
    }
  })
}
