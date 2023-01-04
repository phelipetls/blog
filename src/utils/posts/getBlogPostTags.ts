import type { MDXInstance } from 'astro'

export const getBlogPostTags = (
  blogPosts: MDXInstance<BlogPostFrontmatter>[]
) => {
  return blogPosts.reduce<string[]>((tags, blogPost) => {
    return [...tags, ...(blogPost.frontmatter.tags ?? [])]
  }, [])
}
