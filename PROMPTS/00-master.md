# Master prompt (paste first)

You are implementing a **Cloudflare Worker overlay** that serves Ezoic ads on a Beehiiv website. Match `starter/` in this repo. Do not invent a different ads stack.

I have:

- A Beehiiv publication with a custom domain
- The domain on Cloudflare
- An Ezoic publisher account (PubDash) for that domain

I want this architecture:

- Beehiiv remains the CMS and origin (`www` CNAME to `cname.beehiiv.com`, **orange-cloud / proxied**)
- Apex CNAME-flattens to `www`, also proxied
- A Worker intercepts only `/p/*`, `/t/*`, `/archive*`, `/privacy`, `/terms`, `/ads.txt` on www and apex
- On monetized HTML: proxy Beehiiv, `HTMLRewriter` injects Gatekeeper CMP + `sa.min.js` + a boot script
- Boot script survives Beehiiv SPA hydration, places a **90px reserved-height clip shell** before the first `h1`, enables the bottom sticky anchor, and **tears down** ads when the client navigates off monetized paths
- CLS: clip shell `overflow:hidden` + `reservePlaceholderSpace: true` (see `CLS-AND-JITTER.md`). Cache token `banner-clip-90`
- `/privacy` and `/terms` are Worker static HTML (Beehiiv site builder is the wrong place for these)
- `/ads.txt` is HTTP **200** on origin (fetch Ads.txt Manager, optional extra DIRECT lines). Not a 302-only setup
- Kill switch: `ezoic.enabled = false` + redeploy. No Beehiiv publish.

Read `README.md` (path-limited default + tradeoffs), `WHY.md`, and `starter/` before writing code.

Work **one prompt at a time** from `PROMPTS/01` through `07`. Do not skip DNS. Do not “just add the Ezoic script to Beehiiv.” Do not invent API keys or publisher IDs — I will paste my Ads.txt Manager URL and domain.

When in doubt, match `starter/src/ezoic.js` rather than simplifying the boot script away.
