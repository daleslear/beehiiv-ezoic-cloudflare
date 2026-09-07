# Why this overlay is viable

Beehiiv hosts the website. Ezoic wants to monetize it. Neither vendor gives you a supported “Ezoic on Beehiiv www” switch.

Three approaches people reach for, and why this kit does not use the first two as the primary path.

## 1. Beehiiv theme / custom head / post HTML

Put Gatekeeper + `sa.min.js` + placeholder divs in Beehiiv’s website settings or in each post.

**Why it fails on Beehiiv www**

- The public site is an **SPA**. First HTML may include your tags; client hydration **wipes static placeholder divs**.
- In-app navigation (post → tag → about) does **not** re-run the Worker or reload the document. Sticky anchors and 728×90 shells stay on pages that should not be monetized.
- Theme / custom-head is a bad control plane: no per-path allowlist, no kill switch without editing Beehiiv, easy to accidentally affect **email** if you put tags in post bodies.
- Beehiiv’s website builder and API/MCP are a poor place to maintain long Privacy / Terms HTML.

## 2. GTM (or Ezoic Cloud nameservers)

GTM can load Gatekeeper and Ezoic, but you still lose path control, SPA teardown, and a single kill switch. You also add a tag manager in the hot path.

**Ezoic Cloud** (change nameservers to Ezoic, let them be the CDN and rewrite HTML) fights Beehiiv. Beehiiv needs `www` → `cname.beehiiv.com`. Ezoic Cloud wants to own the zone. You cannot give the same hostname to both CDNs.

## 3. Cloudflare Worker overlay (this kit)

Keep Beehiiv as origin. Orange-cloud `www` and apex on Cloudflare. A Worker:

1. Proxies Beehiiv only on `/p/*`, `/t/*`, `/archive*`
2. Injects Gatekeeper + `sa.min.js` + a **boot script** that recreates mounts after hydrate and tears them down off those paths
3. Serves `/privacy` and `/terms` as static Worker assets
4. Serves `/ads.txt` as **HTTP 200** on origin (proxy Ads.txt Manager, optionally append an AdSense DIRECT line)
5. Leaves homepage and assets on Beehiiv (no Worker tax)

**Why it is viable**

- You never wait on Beehiiv to support Ezoic.
- Email never sees the inject (Worker only sees www HTML).
- Kill switch is `ezoic.enabled = false` + redeploy — not a theme rollback.
- ads.txt and legal pages are not trapped in Beehiiv’s site builder.
- Ezoic still keys off the **registered domain** in PubDash. No site ID is required in page HTML for the standalone ads stack.

Tradeoffs are listed in the root `README.md` (extra hop, SPA fragility, 90px clip vs jitter, 30‑minute HTML cache, not Ezoic Cloud). Read those before you copy the starter.
