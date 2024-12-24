import type { Locale } from '@utils/i18n/locales'
import { getBlogPosts } from './getBlogPosts'
import { getBlogPostTags } from './getBlogPostTags'
import type { CollectionEntry } from 'astro:content'

type StaticPath = {
  params: { id: string }
  props: {
    blogPosts: CollectionEntry<'posts'>[]
    isTranslated: boolean
  }
}

export async function getBlogPostsTagsAsStaticPaths(
  locale: Locale
): Promise<StaticPath[]> {
  const blogPosts = await getBlogPosts(locale)
  const tags = getBlogPostTags(blogPosts)

  const otherLocale = locale === 'en' ? 'pt' : 'en'
  const translatedBlogPosts = await getBlogPosts(otherLocale)

  return tags.map((tag) => {
    return {
      params: { id: tag },
      props: {
        blogPosts: blogPosts.filter((blogPost) => {
          return blogPost.data.tags?.includes(tag)
        }),
        isTranslated: getBlogPostTags(translatedBlogPosts).includes(tag),
      },
    }
  })
}
