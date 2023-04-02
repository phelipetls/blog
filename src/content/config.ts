import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.string().array(),
    math: z.boolean().optional(),
  }),
})

export const collections = {
  posts: postsCollection,
}
