# Contributing

This pattern breaks when **Beehiiv changes www DOM or routes**. That is the highest-value PR:

- New post/tag/archive path shapes
- Title chrome that is no longer a first `h1`
- SPA navigation that the `pushState` patch misses
- CLS regressions (clip shell no longer 90px / overflow hidden)

## How to PR

1. Keep routes narrow (`/p/*` `/t/*` `/archive*` + legal + ads.txt). No `/*`.
2. Do not add Beehiiv publish/API write paths.
3. Do not commit Cloudflare tokens, account IDs, Ads.txt Manager publisher IDs, or AdSense `pub-` IDs.
4. `npm test` in `starter/` must pass.
5. Privacy/Terms HTML in `starter/public/` stays a **placeholder**. Do not paste a live publisher’s legal policy.

Not legal advice. Ezoic and Beehiiv are third-party products; this overlay is unsupported by both vendors.
