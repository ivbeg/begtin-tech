import {defineCollection} from 'astro:content';
import {file} from 'astro/loaders';
import {z} from 'astro/zod';

// Every human-readable field exists in both languages.
const text = z.object({en: z.string(), ru: z.string()});

const books = defineCollection({
  loader: file('src/data/books.yaml'),
  schema: z.object({
    order: z.number(),
    title: text,
    subtitle: text,
    summary: text,
    // Language of the book itself, not of the site page about it.
    language: z.enum(['ru', 'en']),
    year: z.number(),
    edition: text.optional(),
    status: z.enum(['published', 'in-progress']),
    // Who published it, when the book is not a personal project.
    publisher: text.optional(),
    cover: z.string().optional(),
    site: z.url(),
    repo: z.url().optional(),
    license: z.object({name: z.string(), url: z.url()}).optional(),
    files: z
      .array(z.object({format: z.string(), url: z.url(), size: z.string().optional()}))
      .default([]),
    parts: z.array(text).default([]),
  }),
});

const projects = defineCollection({
  loader: file('src/data/projects.yaml'),
  schema: z.object({
    group: z.enum(['discovery', 'organizations', 'government', 'preservation', 'tools']),
    order: z.number(),
    name: text,
    role: text.optional(),
    years: z.coerce.string().optional(),
    summary: text,
    url: z.url().optional(),
    repo: z.url().optional(),
  }),
});

const timeline = defineCollection({
  loader: file('src/data/timeline.yaml'),
  schema: z.object({
    order: z.number(),
    years: z.coerce.string(),
    title: text,
    org: text.optional(),
    summary: text.optional(),
  }),
});

export const collections = {books, projects, timeline};
