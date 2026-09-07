# Smoke checklist (human)

Do this after the Worker is routed and PubDash has the domain. Do not skip “view source.”

## DNS

- [ ] `www` CNAME → `cname.beehiiv.com` **proxied** (orange cloud)
- [ ] Apex CNAME → `www` **proxied** (Cloudflare CNAME flattening)
- [ ] Worker routes exist for `www` **and** apex: `/p/*`, `/t/*`, `/archive*`, `/privacy*`, `/terms*`, `/ads.txt`
- [ ] Homepage `/` is **not** on the Worker (Beehiiv serves it)

## Ezoic inject (open a real `/p/...` post)

- [ ] View source (or disable JS and fetch HTML): Gatekeeper scripts, `sa.min.js`, `data-ezoic-overlay="www"`
- [ ] `.beehiiv-ezoic-clip` has `height:90px`, `max-height:90px`, `overflow:hidden`
- [ ] Head config includes `reservePlaceholderSpace: true`
- [ ] After JS: a leaderboard sits **above** the post `h1` (or title chrome), page does **not** jump when the ad fills
- [ ] CMP / privacy choices open (Gatekeeper)
- [ ] Sticky/anchor at bottom is acceptable; no second in-page footer 728×90
- [ ] Client-nav to `/about` or `/`: clip shell and sticky **go away** within a second
- [ ] Client-nav back to a post: ads return

## Legal + ads.txt

- [ ] `https://www.{domain}/privacy` and `/terms` are the Worker pages (not Beehiiv site-builder chrome)
- [ ] Same paths work on the apex host
- [ ] `https://www.{domain}/ads.txt` is **200** `text/plain` with Ezoic’s seller list (and your AdSense line if you appended one)
- [ ] Apex `/ads.txt` is also **200**, not a 301 hop that crawlers refuse to follow

## Negative tests

- [ ] Email send / archive in Beehiiv does **not** contain `ezojs.com` (Worker never saw the email HTML)
- [ ] Kill switch: `ezoic.enabled = false`, redeploy, bump cache version — post HTML has no Gatekeeper / `sa.min.js`
- [ ] Cloudflare challenge interstitial is not rewritten (boot skips `Just a moment...`)

## PubDash

- [ ] Domain registered for EzoicAds / standalone
- [ ] Ads.txt Manager URL pasted into `starter/src/brands.js`
- [ ] Fill or a clear Ezoic status — no unexplained monetization 403
