# Ezoic on Beehiiv via Cloudflare Workers

**From:** Dale Slear ([@daleslear](https://github.com/daleslear))

A Cloudflare Worker that injects **EzoicAds** in front of Beehiiv. Beehiiv stays the CMS. You do not edit the Beehiiv theme, and you do not point DNS at Ezoic Cloud.

**Default: ads are path-limited, not sitewide.** The Worker only runs on post, tag, and archive URLs (`/p/*`, `/t/*`, `/archive*`), plus `/privacy`, `/terms`, and `/ads.txt`. Homepage, subscribe, website-builder pages, images, JS, and **email** never get Ezoic. There is one header slot (728×90 / 320×50) and Ezoic’s bottom sticky anchor — not in-article units, video, or side rails.

Turn ads off without touching Beehiiv: `ezoic.enabled = false` in `starter/src/brands.js` and redeploy.

## Use with Claude or ChatGPT

1. Clone this repo into the project (or upload the folder as knowledge).
2. Paste **`PROMPTS/00-master.md`**.
3. Run prompts `01` → `07` in order. Do not skip DNS. Do not put Ezoic in Beehiiv custom head.

Short GPT instructions: `GPT-INSTRUCTIONS-SHORT.md`. Claude skill: `SKILL.md`.

## You need

- Beehiiv custom domain on Cloudflare
- `www` CNAME → `cname.beehiiv.com` **proxied** (orange cloud); apex CNAME → `www`, also proxied
- Ezoic PubDash domain + Ads.txt Manager URL
- Worker routes **only** for the paths above — never `/*`

`/ads.txt` must return **HTTP 200** on your origin (not a 302 to Ads.txt Manager). Privacy and Terms are Worker HTML because Beehiiv’s site builder is a poor place to keep them.

## Layout shift (the jump when an ad loads)

A **90px clip shell** (`overflow: hidden`) reserves the banner height before fill, plus Ezoic `reservePlaceholderSpace: true`. Taller creatives get clipped on purpose. See `CLS-AND-JITTER.md`. Cache token: `banner-clip-90`.

Beehiiv www is an SPA: static divs get wiped on hydrate, and client-nav to `/about` would leave ads behind. The boot script in `starter/src/ezoic.js` recreates mounts on monetized paths and tears them down everywhere else.

## Tradeoffs

- Extra hop on those paths (user → Cloudflare → Beehiiv). Homepage can stay up if the Worker dies.
- ~30 minute HTML cache on injected posts (bump `HTML_CACHE_VERSION` after Worker changes).
- Orange cloud is required. Do not CNAME `newsletter` (or similar) at `cname.beehiiv.com` while proxied (Cloudflare 1014).
- This is EzoicAds JS, not Ezoic Cloud. Do not also change nameservers to Ezoic.
- Beehiiv did not design this; DOM/path changes can break placement.

## Files

| Path | Role |
| --- | --- |
| `WHY.md` | Overlay vs theme vs GTM vs Ezoic Cloud |
| `CLS-AND-JITTER.md` | 90px clip shell |
| `CHECKLIST.md` | Smoke after deploy |
| `PROMPTS/` | Sequenced AI prompts |
| `starter/` | Worker — replace `example.com` and the Ads.txt Manager URL |

No keys or publisher IDs in git. Paste counsel-approved copy into `starter/public/` for Privacy/Terms — this repo does not provide legal language.
