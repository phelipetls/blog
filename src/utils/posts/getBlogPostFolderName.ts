import type { CollectionEntry } from 'astro:content'

export const getBlogPostFolderName = (blogPost: CollectionEntry<'posts'>) => {
  return blogPost.id.split('/').at(0)
}
