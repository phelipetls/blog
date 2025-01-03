import type { CollectionEntry } from 'astro:content'

export const getBlogPostTags = (blogPosts: CollectionEntry<'posts'>[]) => {
  return blogPosts.reduce<string[]>((tags, blogPost) => {
    return [...tags, ...blogPost.data.tags]
  }, [])
}
