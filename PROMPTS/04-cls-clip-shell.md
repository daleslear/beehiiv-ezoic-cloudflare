# Prompt 04 — CLS clip shell

Implement `CLS-AND-JITTER.md` exactly. This is the anti-jitter work.

## Required

- Outer `.beehiiv-ezoic-clip` height **90px**, max-height 90px, overflow hidden
- Inner `.beehiiv-ezoic-ad` 728x90 / 320x50, `data-fluid="false"`
- Style the **shell**, not Ezoic’s mutated inner node
- `reservePlaceholderSpace: true` already in config from prompt 03
- `HTML_CACHE_VERSION` set to something like `banner-clip-90` and used on the cache key so old HTML is not served
- HTML cache TTL ~30 minutes on injected 200s only

## Tradeoff to tell me

90px will clip taller creatives. Do not raise the shell unless I ask; if you raise it, reserve the new height and bump the cache version.

## Done when

- Loading a post does not shove the title/body down when the ad fills
- Tests still assert 90px + overflow hidden + reservePlaceholderSpace (see `starter/test/`)
