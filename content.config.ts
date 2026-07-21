import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(),
        draft: z.boolean().default(false),
        tags: z.array(z.string()).optional(),
        image: z.string(),
        // image: z.object({
        //   src: property(z.string()).editor({ input: 'media' }),
        //   alt: z.string(),
        // }),
      }),
    }),
  },
})
