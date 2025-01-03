import { getRelativeLocaleUrl } from 'astro:i18n'
import { getBlogPosts } from './getBlogPosts'
import type { Locale } from '@utils/i18n/locales'

export async function getBlogPostsAsRssItems(locale: Locale) {
  const blogPosts = await getBlogPosts(locale)

  return await Promise.all(
    blogPosts.map(async (blogPost) => {
      const { remarkPluginFrontmatter } = await blogPost.render()

      if (typeof remarkPluginFrontmatter.summary !== 'string') {
        throw new Error(
          `Expected blog post summary to be string, but instead got value '${String(
            remarkPluginFrontmatter.summary
          )}' of type '${typeof remarkPluginFrontmatter.summary}'`
        )
      }

      return {
        title: blogPost.data.title,
        pubDate: blogPost.data.date,
        description: remarkPluginFrontmatter.summary,
        link: getRelativeLocaleUrl('pt', `/posts/${blogPost.slug}`),
      }
    })
  )
}
