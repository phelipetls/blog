import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.string().array(),
    math: z.boolean().optional(),
  }),
})

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    website: z.string().optional(),
    github: z.string(),
    icons: z.string().array(),
    unmaintained: z.boolean().optional(),
  }),
})

export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
}
