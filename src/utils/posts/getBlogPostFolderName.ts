import path from 'node:path'
import type { CollectionEntry } from 'astro:content'

export const getBlogPostFolderName = (
  blogPost: CollectionEntry<'posts'>
): string => {
  return blogPost.filePath ? path.basename(path.dirname(blogPost.filePath)) : ''
}
