import { getBlogPosts } from '@utils/posts/getBlogPosts'
import { getBlogPostFolderName } from '@utils/posts/getBlogPostFolderName'
import type { APIRoute } from 'astro'
import { getAbsoluteLocaleUrl } from 'astro:i18n'

export const GET: APIRoute = async () => {
  const blogPosts = await getBlogPosts('pt')

  return new Response(
    JSON.stringify(
      blogPosts.map((blogPost) => {
        const fullUrl = getAbsoluteLocaleUrl(
          'pt',
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
