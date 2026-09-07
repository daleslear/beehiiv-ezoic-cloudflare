# Starter Worker

Copy this directory. Replace `example.com` and the Ads.txt Manager URL. Do not commit Cloudflare API tokens or account IDs.

```bash
npm install
npm test
npx wrangler login   # your Cloudflare user — never commit the token
npx wrangler deploy
```

| File | Purpose |
| --- | --- |
| `src/worker.js` | Routes: ads.txt, privacy/terms, proxy+inject |
| `src/ezoic.js` | Gatekeeper + sa.min.js + SPA boot + 90px clip shell |
| `src/adsTxt.js` | Origin 200 for ads.txt |
| `src/brands.js` | Host map + kill switch + Ads.txt Manager URL |
| `src/paths.js` | Monetized paths + `banner-clip-90` cache version |
| `public/privacy.html` / `terms.html` | Placeholders — paste counsel copy |

This starter is **one site** so it is obvious what to edit.
