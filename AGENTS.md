# begtin.tech — personal site of Ivan Begtin

Astro static site, English at `/`, Russian at `/ru/`. See `README.md` for commands and where content lives.

- Content is data: books in `src/data/books.yaml`, projects in `src/data/projects.yaml`, career in `src/data/timeline.yaml`, texts in `src/i18n/{en,ru}.ts`. Change data, not page templates, to add a book or project.
- Every text exists in both languages. `ru.ts` is typed as `typeof en`: `npm run check` fails on a missing key.
- A number that changes (datasets, catalogs, subscribers) carries the date it was true.
- In YAML, quote a value that contains `: ` or a comma inside `{en: …, ru: …}`; prefer block style for long values.
- Run `npm run check && npm run build` before committing.
