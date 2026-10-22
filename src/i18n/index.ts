import {en} from './en';
import {ru} from './ru';

export const locales = ['en', 'ru'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'en';

export const ui = {en, ru};
export type UI = typeof en;

export const langNames: Record<Lang, string> = {en: 'English', ru: 'Русский'};
// Open Graph wants language_TERRITORY.
export const ogLocales: Record<Lang, string> = {en: 'en_US', ru: 'ru_RU'};

export function t(lang: Lang): UI {
  return ui[lang];
}

// Picks one language out of a {en, ru} pair from the data files.
export function pick<T>(value: Record<Lang, T>, lang: Lang): T;
export function pick<T>(value: Record<Lang, T> | undefined, lang: Lang): T | undefined;
export function pick<T>(value: Record<Lang, T> | undefined, lang: Lang): T | undefined {
  return value?.[lang];
}

// Every page exists in both languages: the root is English, /ru/ is Russian.
export function langPaths() {
  return [
    {params: {lang: undefined}, props: {lang: 'en' as Lang}},
    {params: {lang: 'ru'}, props: {lang: 'ru' as Lang}},
  ];
}

// '/books/' -> '/ru/books/' for Russian, unchanged for English.
export function localePath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean}`;
}

// Strips the language prefix: '/ru/books/' -> '/books/'.
export function basePath(pathname: string): string {
  const match = pathname.match(/^\/(ru)(\/.*)?$/);
  return match ? match[2] || '/' : pathname;
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang, {year: 'numeric', month: 'long', day: 'numeric'}).format(date);
}
