import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Artur Bania'),
    category: z.string().default('Porady'),
    image: z.string().default('/images/17ktvQuSBDmjDTM3Gr3L7nOKHE.jpg'),
  }),
});

export const collections = { blog };
