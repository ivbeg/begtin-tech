// schema.org markup: search engines and dataset/book indexes read it from every page.
import type {CollectionEntry} from 'astro:content';
import {type Lang, localePath, pick, t} from '../i18n';
import {EMAIL, profiles} from './profiles';

const SITE = 'https://begtin.tech';
const PERSON_ID = `${SITE}/#person`;

export function person(lang: Lang) {
  const s = t(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: s.siteName,
    alternateName: lang === 'en' ? 'Иван Бегтин' : 'Ivan Begtin',
    url: `${SITE}${localePath(lang, '/')}`,
    image: `${SITE}/img/ivan-begtin.webp`,
    email: `mailto:${EMAIL}`,
    jobTitle: lang === 'en' ? 'Founder and CTO, Dateno' : 'Основатель и технический директор Dateno',
    description: s.about.bio,
    worksFor: [
      {'@type': 'Organization', name: 'Dateno', url: 'https://dateno.io/'},
      {
        '@type': 'NGO',
        name: lang === 'en' ? 'Infoculture' : 'АНО «Информационная культура»',
        url: 'https://infoculture.ru/',
      },
    ],
    knowsAbout: s.about.expertise,
    sameAs: profiles.map((p) => p.url),
  };
}

export function book(entry: CollectionEntry<'books'>, lang: Lang) {
  const b = entry.data;
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: pick(b.title, lang),
    alternativeHeadline: pick(b.subtitle, lang),
    description: pick(b.summary, lang),
    author: {'@id': PERSON_ID, '@type': 'Person', name: t(lang).siteName},
    inLanguage: b.language,
    datePublished: String(b.year),
    url: b.site,
    ...(b.cover && {image: `${SITE}${b.cover}`}),
    ...(b.license && {license: b.license.url}),
    ...(b.publisher && {publisher: {'@type': 'Organization', name: pick(b.publisher, lang)}}),
    ...(b.files.length > 0 && {
      encoding: b.files.map((f) => ({
        '@type': 'MediaObject',
        encodingFormat: f.format === 'PDF' ? 'application/pdf' : f.format,
        contentUrl: f.url,
      })),
    }),
  };
}
