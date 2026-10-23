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
    // Languages the book itself exists in, the original first; not the languages of this site.
    languages: z.array(z.enum(['ru', 'en'])).min(1),
    year: z.number(),
    edition: text.optional(),
    status: z.enum(['published', 'in-progress']),
    // Who published it, when the book is not a personal project.
    publisher: text.optional(),
    cover: z.string().optional(),
    // The book's site for each language in `languages`.
    site: z.object({ru: z.url().optional(), en: z.url().optional()}),
    repo: z.url().optional(),
    license: z.object({name: z.string(), url: z.url()}).optional(),
    files: z
      .array(
        z.object({format: z.string(), lang: z.enum(['ru', 'en']), url: z.url(), size: z.string().optional()}),
      )
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
