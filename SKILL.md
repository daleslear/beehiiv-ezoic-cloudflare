---
name: beehiiv-ezoic-cloudflare
description: >-
  Implement a Cloudflare Worker overlay that serves Ezoic ads on a Beehiiv www
  site (HTMLRewriter inject, SPA boot/teardown, 90px CLS clip shell, ads.txt 200,
  Privacy/Terms assets). Use when the user has Beehiiv + Cloudflare + Ezoic and
  wants this pattern — not Beehiiv theme tags, not GTM, not Ezoic Cloud NS.
---

# Beehiiv + Ezoic via Cloudflare Worker

You are implementing **this overlay**, not inventing a new ads stack. Match `starter/` rather than simplifying the boot script away.

## Non-negotiables

1. Edge HTML only. Never create, patch, confirm, publish, or schedule Beehiiv posts to install ads.
2. Do not put Ezoic or Gatekeeper in Beehiiv custom head / post HTML / GTM as the primary path.
3. Do not change nameservers to Ezoic Cloud. Cloudflare stays DNS+CDN; Beehiiv stays origin; EzoicAds is standalone JS.
4. Worker routes are **narrow**: `/p/*`, `/t/*`, `/archive*`, `/privacy*`, `/terms*`, `/ads.txt` on `www` and apex. Not `/*`.
5. `www` and apex DNS must be **proxied** (orange cloud). Workers do not run on grey-cloud records.
6. `/ads.txt` must be HTTP **200** on origin. Do not 302-only to Ads.txt Manager.
7. CLS: 90px `.beehiiv-ezoic-clip` + `overflow:hidden` + `reservePlaceholderSpace: true`. See `CLS-AND-JITTER.md`.
8. Beehiiv www is an SPA: recreate mounts after hydrate; teardown on client-nav off monetized paths.
9. Kill switch: `ezoic.enabled = false` + redeploy + bump `HTML_CACHE_VERSION`.
10. Privacy/Terms are Worker static assets. Paste counsel-approved HTML; do not invent legal language.

## Order of work

Follow `PROMPTS/01` through `07`. Start from `starter/`. Fill placeholders (`example.com`, Ads.txt Manager URL). Never copy anyone's API keys, Cloudflare account IDs, or publisher IDs from examples.

## Read first

- `README.md` (path-limited default + tradeoffs)
- `WHY.md`
- `CLS-AND-JITTER.md`
- `starter/src/ezoic.js` and `starter/src/worker.js`
