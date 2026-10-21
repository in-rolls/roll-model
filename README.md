# Roll Model

An open, static demonstration of an electoral-roll-style explorer. Select a demo state, year, and parliamentary constituency; search and sort the example records; and download the filtered examples as CSV.

The ideas, intended user flow, original scope, and open decisions are documented in [PRODUCT.md](PRODUCT.md). Start there if you are considering a new version of this product.

**Every record is synthetic.** The site contains no real voter data, payment flow, accounts, database connection, API keys, or analytics. The earlier storefront is not part of this public codebase.

## Run locally

Serve the `site` directory with any static HTTP server. For example:

```sh
python3 -m http.server 8000 --directory site
```

Open <http://localhost:8000>. No dependency installation or build step is needed.

Run the checks with Node.js 22 or newer:

```sh
npm ci
npm run check
npm test
npm run test:e2e
```

The browser test uses Playwright. Install a Chromium browser with `npx playwright install chromium` if Chrome is not available locally.

## How it works

- `site/js/data.js` generates deterministic, clearly labelled example records and provides filtering, sorting, pagination, and CSV export.
- `site/js/app.js` connects those operations to the interface. It puts record values into the DOM as text rather than HTML.
- `site/index.html` and `site/styles.css` form the static site.
- `tests/data.test.js` checks the data operations and synthetic-data boundary; `tests/ui.spec.js` exercises the interface in a browser.

The GitHub Actions workflow runs the checks and publishes `site/` to GitHub Pages when `main` changes. The site does not call an external service. The local clone requires an HTTP server because browser modules do not reliably load from `file://`.

## Scope

The interface demonstrates an idea, not a data service. It does not ingest electoral rolls, verify records, grant access to personal data, or process payments. Any future real-data product would need a separate design and review of data rights, privacy, access control, and security.

## License

MIT. See [LICENSE](LICENSE). This implementation does not include the old dashboard template or its assets.
