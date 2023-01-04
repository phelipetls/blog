import { getDirectoryName } from '@utils/path'
import type { APIRoute, MDXInstance } from 'astro'

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

export const get: APIRoute = ({ params, request }) => {
  const language = params.lang

  let blogPosts: Record<string, MDXInstance<BlogPostFrontmatter>>

  if (language === 'pt') {
    blogPosts = import.meta.glob('../../../../content/posts/*/index.pt.mdx', {
      eager: true,
    })
  } else {
    blogPosts = import.meta.glob('../../../../content/posts/*/index.mdx', {
      eager: true,
    })
  }

  return {
    body: JSON.stringify(
      Object.entries(blogPosts).map(([_, blogPost]) => {
        const fullUrl = new URL(
          `/posts/images/${getDirectoryName(blogPost.file)}`,
          request.url
        )

        return {
          url: fullUrl,
          name: getDirectoryName(blogPost.file),
        }
      })
    ),
  }
}
