import type { Language } from '@utils/i18n'
import { getCollection } from 'astro:content'

const isProd = !import.meta.env.DEV

export function getBlogPosts(language: Language) {
  if (language === 'pt') {
    return getCollection('posts', (blogPost) => {
      const isPortuguese = blogPost.id.endsWith('.pt.mdx')

      if (isProd) {
        const isDraft = blogPost.data.draft
        return isPortuguese && !isDraft
      } else {
        return isPortuguese
      }
    })
  }

  return getCollection('posts', (blogPost) => {
    const isEnglish = !blogPost.id.endsWith('.pt.mdx')

    if (isProd) {
      const isDraft = blogPost.data.draft
      return isEnglish && !isDraft
    } else {
      return isEnglish
    }
  })
}
