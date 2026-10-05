import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    tagline: z.string().optional(),
    role: z.string(),
    location: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(), // omit for current role
    technologies: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      status: z.enum(['completed', 'ongoing']),
      period: z.coerce.string(), // e.g. "2024 — 2026" or "Since 2026"
      role: z.string().optional(),
      tech: z.array(z.string()),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      cover: image().optional(), // relative path to an image in src/assets/projects
      visual: z.enum(['voice', 'crosshair', 'calendar']).optional(), // animated cover when there's no screenshot
      interactive: z.enum(['sleep-diary']).optional(), // embeds a live demo on the project page
      order: z.number().default(100),
      draft: z.boolean().default(false), // drafts show in dev only
    }),
});

export const collections = { experience, projects };
