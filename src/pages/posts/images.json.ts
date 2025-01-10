import { getBlogPosts } from '@utils/posts/getBlogPosts'
import { getBlogPostFolderName } from '@utils/posts/getBlogPostFolderName'
import type { APIRoute } from 'astro'
import { getAbsoluteLocaleUrl } from 'astro:i18n'

export const GET: APIRoute = async () => {
  const blogPosts = await getBlogPosts('en')

  return new Response(
    JSON.stringify(
      blogPosts.map((blogPost) => {
        const fullUrl = getAbsoluteLocaleUrl(
          'en',
          `/posts/images/${getBlogPostFolderName(blogPost)}`
        )

        return {
          url: fullUrl,
          name: getBlogPostFolderName(blogPost),
        }
      })
    )
  )
}
