import { localizeUrl } from '@utils/i18n'
import { getBlogPostFolderName, getBlogPosts } from '@utils/posts'
import type { APIRoute } from 'astro'
import type { CollectionEntry } from 'astro:content'

export async function getStaticPaths() {
  return [
    {
      params: { lang: undefined },
    },
    {
      params: { lang: 'pt' },
    },
  ]
}

export const get: APIRoute = async ({ params, request }) => {
  const language = params.lang

  let blogPosts: CollectionEntry<'posts'>[]
  if (language === 'pt') {
    blogPosts = await getBlogPosts('pt')
  } else {
    blogPosts = await getBlogPosts('en')
  }

  return new Response(
    JSON.stringify(
      blogPosts.map((blogPost) => {
        const fullUrl = new URL(
          localizeUrl(
            `/posts/images/${getBlogPostFolderName(blogPost)}`,
            language === 'pt' ? 'pt' : 'en'
          ),
          request.url
        )

        return {
          url: fullUrl,
          name: getBlogPostFolderName(blogPost),
        }
      })
    )
  )
}
