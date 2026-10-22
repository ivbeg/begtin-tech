// Size of a downloadable file on another site (book PDFs), asked once per build with a HEAD request.
// A size written in books.yaml wins; when the request fails the link is shown without a size.

const cache = new Map<string, Promise<number | undefined>>();

export function remoteSize(url: string): Promise<number | undefined> {
  if (!cache.has(url)) cache.set(url, head(url));
  return cache.get(url)!;
}

async function head(url: string): Promise<number | undefined> {
  try {
    const response = await fetch(url, {method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10_000)});
    const length = Number(response.headers.get('content-length'));
    return response.ok && length > 0 ? length : undefined;
  } catch {
    return undefined;
  }
}

export function formatSize(bytes: number, lang: 'en' | 'ru'): string {
  const mb = bytes / 1024 / 1024;
  const value = new Intl.NumberFormat(lang, {maximumFractionDigits: mb < 10 ? 1 : 0}).format(mb);
  return lang === 'ru' ? `${value} МБ` : `${value} MB`;
}
