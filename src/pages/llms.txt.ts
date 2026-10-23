// /llms.txt (https://llmstxt.org/): a plain-text map of the site for language models and agents.
import type {APIRoute} from 'astro';
import {getCollection} from 'astro:content';
import {t} from '../i18n';
import {EMAIL, profiles} from '../lib/profiles';

export const GET: APIRoute = async () => {
  const s = t('en');
  const books = (await getCollection('books')).sort((a, b) => a.data.order - b.data.order);
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);

  const lines = [
    `# ${s.siteName}`,
    '',
    `> ${s.about.bio}`,
    '',
    'The site is bilingual: English at https://begtin.tech/, Russian at https://begtin.tech/ru/.',
    '',
    '## Books',
    '',
    ...books.map((b) => {
      const editions = b.data.languages.map((l) => {
        const pdf = b.data.files.find((f) => f.format === 'PDF' && f.lang === l);
        return `${s.books.langNames[l]}: ${b.data.site[l]}${pdf ? `, PDF ${pdf.url}` : ''}`;
      });
      return `- ${b.data.title.en} / ${b.data.title.ru}: ${b.data.subtitle.en}. ${b.data.year}. ${editions.join('; ')}`;
    }),
    '',
    '## Projects',
    '',
    ...projects.map((p) => {
      const link = p.data.url ?? p.data.repo;
      const name = link ? `[${p.data.name.en}](${link})` : p.data.name.en;
      return `- ${name}: ${p.data.summary.en}`;
    }),
    '',
    '## Pages',
    '',
    '- [About and career](https://begtin.tech/about/)',
    '- [Books](https://begtin.tech/books/)',
    '- [Projects](https://begtin.tech/projects/)',
    '- [Writing](https://begtin.tech/writing/)',
    '',
    '## Contact',
    '',
    `- Email: ${EMAIL}`,
    ...profiles.map((p) => `- ${p.label}: ${p.url}`),
    '',
  ];

  return new Response(lines.join('\n'), {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
};
