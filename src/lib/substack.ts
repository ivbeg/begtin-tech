// Latest newsletter issues, fetched once per build from the Substack RSS feed.
// The site is rebuilt daily by the deploy workflow, so the list stays fresh without client-side JS.
// If the feed is unreachable the build still succeeds and the pages show a plain link instead.

export const SUBSTACK_URL = 'https://begtin.substack.com/';
const FEED_URL = 'https://begtin.substack.com/feed';

export interface Post {
  title: string;
  url: string;
  date: Date;
  excerpt: string;
  // Most issues are in Russian, some in English: marks up the title for screen readers and hyphenation.
  lang: 'ru' | 'en';
}

let cache: Promise<Post[]> | undefined;

export function getPosts(): Promise<Post[]> {
  cache ??= load();
  return cache;
}

async function load(): Promise<Post[]> {
  try {
    const response = await fetch(FEED_URL, {signal: AbortSignal.timeout(15_000)});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parseFeed(await response.text());
  } catch (error) {
    console.warn(`[substack] feed not loaded: ${(error as Error).message}`);
    return [];
  }
}

function parseFeed(xml: string): Post[] {
  const posts: Post[] = [];
  for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = field(item, 'title');
    const url = field(item, 'link');
    const date = new Date(field(item, 'pubDate'));
    if (!title || !url || Number.isNaN(date.getTime())) continue;
    const lang: Post['lang'] = /[а-яё]/i.test(title) ? 'ru' : 'en';
    posts.push({title, url, date, excerpt: shorten(field(item, 'description'), 220), lang});
  }
  return posts;
}

function field(item: string, tag: string): string {
  const match = item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return '';
  const raw = match[1].replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1');
  return decodeEntities(raw.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

const NAMED: Record<string, string> = {amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' '};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(n) ? entity : String.fromCodePoint(n);
    }
    return NAMED[code.toLowerCase()] ?? entity;
  });
}

function shorten(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[.,;:—–-]+$/, '')}…`;
}
