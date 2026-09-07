# Prompt 03 — Ezoic inject + SPA boot

Turn on inject using `starter/src/ezoic.js` and `starter/src/worker.js`. Do not rewrite the boot script from scratch.

## Must include

- Gatekeeper: `cmp.gatekeeperconsent.com/min.js` and `the.gatekeeperconsent.com/cmp.min.js` with `data-cfasync="false"`
- `sa.min.js` + `ezstandalone.config` matching starter (disable interstitial/video/side rail/vignette; `anchorAdPosition: "bottom"`; `reservePlaceholderSpace: true`)
- `HTMLRewriter` appends head scripts + body mount
- Skip rewrite when HTML already has Ezoic/Gatekeeper, or is a Cloudflare challenge (`Just a moment...`, `cf-mitigated`, `challenge-platform`)
- Boot script: `ensureMounts` before first `h1`; `showAds(".beehiiv-ezoic-ad")`; `setEzoicAnchorAd(true)` on monetized paths
- SPA: patch `pushState`/`replaceState`, `popstate`; teardown + sticky sweep off `/p|/t|/archive`

## Must not include

- In-page footer 728×90 (sticky anchor covers bottom)
- Catch-all `/*`
- Beehiiv API calls
- Hardcoded publisher IDs (Ezoic keys off the registered domain)

## Done when

- View-source on `/p/...` shows Gatekeeper, `sa.min.js`, `beehiiv-ezoic-clip`
- Client-nav to About removes ads/sticky
- Kill switch in `brands.js` still works (`enabled: false` skips inject)
