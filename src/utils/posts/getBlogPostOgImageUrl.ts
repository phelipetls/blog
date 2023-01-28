import { Language, localizeUrl } from '@utils/i18n'
import type { CollectionEntry } from 'astro:content'
import { getBlogPostName } from './getBlogPostName'

export const getBlogPostOgImageUrl = (
  blogPost: CollectionEntry<'posts'>,
  language: Language
) => {
  const blogPostId = getBlogPostName(blogPost)
  return localizeUrl(`/posts/${blogPostId}/image.png`, language)
}
