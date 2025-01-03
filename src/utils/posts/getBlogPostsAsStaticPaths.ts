import type { Locale } from '@utils/i18n/locales'
import { getBlogPostFolderName } from './getBlogPostFolderName'
import { getBlogPosts } from './getBlogPosts'
import type { CollectionEntry } from 'astro:content'

interface StaticPath {
  params: {
    id: string
  }
  props: {
    blogPost: CollectionEntry<'posts'> & {
      isTranslated: boolean
    }
    prevBlogPost: CollectionEntry<'posts'>
    nextBlogPost: CollectionEntry<'posts'>
  }
}

export async function getBlogPostsAsStaticPaths(
  language: Locale
): Promise<StaticPath[]> {
  const blogPosts = await getBlogPosts(language)

  const sortedBlogPosts = blogPosts.sort((blogPostA, blogPostB) => {
    return (
      new Date(blogPostA.data.date).getTime() -
      new Date(blogPostB.data.date).getTime()
    )
  })

  const otherLocale = language === 'en' ? 'pt' : 'en'
  const translatedBlogPostsNames = (await getBlogPosts(otherLocale)).map(
    (post) => getBlogPostFolderName(post)
  )

  return sortedBlogPosts.map((blogPost, index, blogPosts) => {
    const nextBlogPost = blogPosts[index + 1] ?? null
    const prevBlogPost = blogPosts[index - 1] ?? null

    const blogPostName = getBlogPostFolderName(blogPost)

    return {
      params: { id: blogPostName },
      props: {
        blogPost: {
          ...blogPost,
          isTranslated: translatedBlogPostsNames.includes(blogPostName),
        },
        nextBlogPost,
        prevBlogPost,
      },
    }
  })
}
