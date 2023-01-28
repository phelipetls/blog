import type { Language } from '@utils/i18n'
import { getCollection } from 'astro:content'

export function getBlogPosts(language: Language) {
  if (language === 'pt') {
    return getCollection('posts', (blogPost) => {
      return blogPost.id.endsWith('.pt.mdx')
    })
  }

  return getCollection('posts', (blogPost) => {
    return !blogPost.id.endsWith('.pt.mdx')
  })
}
