import type { CollectionEntry } from 'astro:content'

export const getBlogPostName = (blogPost: CollectionEntry<'posts'>) => {
  return blogPost.id.split('/').at(0)
}
