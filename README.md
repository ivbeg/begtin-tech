# begtin.tech

Personal site of Ivan Begtin: about, books, projects and writing. English at `/`, Russian at `/ru/`.

Built with [Astro](https://astro.build/), deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main` and once a day (the newsletter list is fetched at build time).

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # type check, also checks that ru.ts has every key of en.ts
npm run build    # static site in dist/
```

## Where things live

| What | File |
| --- | --- |
| Books | `src/data/books.yaml` |
| Projects | `src/data/projects.yaml` |
| Career on the About page | `src/data/timeline.yaml` |
| Interface texts, bio, home page texts | `src/i18n/en.ts`, `src/i18n/ru.ts` |
| Profiles and email | `src/lib/profiles.ts` |
| Pages | `src/views/*.astro`; `src/pages/[...lang]/` only makes the EN and RU routes |

Every text in the data files has both `en` and `ru`. The build fails if a field is missing.

## Adding a book

1. Publish the book's site from its own repository on a subdomain: put `<name>.begtin.tech` in the book's `static/CNAME` (Docusaurus) and set its `url` to `https://<name>.begtin.tech` and `baseUrl` to `/`.
2. In Cloudflare DNS add `CNAME <name> → ivbeg.github.io`, proxy off (grey cloud).
3. In the book repository: Settings → Pages → Custom domain `<name>.begtin.tech`, then Enforce HTTPS.
4. Add an entry to `src/data/books.yaml` with the site and PDF links. PDF size is read from the book site at build time.

## DNS for begtin.tech

| Name | Type | Value |
| --- | --- | --- |
| `begtin.tech` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `begtin.tech` | AAAA | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `www` | CNAME | `ivbeg.github.io` |
| `datacatalogs` | CNAME | `ivbeg.github.io` |

All with the Cloudflare proxy off. Keep the MX and TXT records for Proton Mail as they are.
