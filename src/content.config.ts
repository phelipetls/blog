import { glob } from 'astro/loaders'
import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.string().array(),
    math: z.boolean().optional(),
    draft: z.boolean().optional(),
    description: z.string().optional(),
  }),
})

export const collections = {
  posts: postsCollection,
}
