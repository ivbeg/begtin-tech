// A book can exist in several languages, each with its own site and files.
// A page shows the edition in its own language when the book has one, otherwise the original.
import type {CollectionEntry} from 'astro:content';
import type {Lang} from '../i18n';

type Book = CollectionEntry<'books'>['data'];

export function editionLang(b: Book, lang: Lang): Lang {
  return b.languages.includes(lang) ? lang : b.languages[0];
}

export function siteFor(b: Book, lang: Lang): string {
  return b.site[editionLang(b, lang)] ?? b.site[b.languages[0]]!;
}

// Files of the reader's edition first, then the other languages in the order of `languages`.
export function filesFor(b: Book, lang: Lang) {
  const first = editionLang(b, lang);
  const rank = (l: Lang) => (l === first ? -1 : b.languages.indexOf(l));
  return [...b.files].sort((x, y) => rank(x.lang) - rank(y.lang));
}

// Editions other than the one the page leads to, for "Read in …" links.
export function otherEditions(b: Book, lang: Lang): Lang[] {
  const first = editionLang(b, lang);
  return b.languages.filter((l) => l !== first && b.site[l]);
}
