# CLS / jitter — reserved-height clip shell

The “jumpiness” when an ad is about to serve is **Cumulative Layout Shift (CLS)**. The Beehiiv article body paints, then Ezoic inserts a 728×90 (or taller) iframe, and everything below the slot moves.

The www fix has two parts. Both are required.

## 1. Reserved-height clip shell (layout)

Do **not** style Ezoic’s inner placeholder as the thing that “has height.” Ezoic mutates that node. Wrap it in an outer shell **you** own:

- Class: `beehiiv-ezoic-clip`
- Fixed height: **90px** (`BANNER_CLIP_HEIGHT_PX`)
- `max-height: 90px`
- `overflow: hidden`
- Inner mount: `beehiiv-ezoic-ad` with `data-sizes="728x90"` and `data-mobile_sizes="320x50"`

The page always has a 90px strip above the title (boot script places the shell before the first `h1`). When the creative fills, the strip does not grow. Taller creatives are **clipped**, not allowed to push content down.

Cache-bust token: **`banner-clip-90`**. Bump `HTML_CACHE_VERSION` in `starter/src/paths.js` whenever you change inject HTML, or visitors keep the old shell for up to the HTML TTL (30 minutes).

## 2. `reservePlaceholderSpace: true` (Ezoic)

In `ezstandalone.config`:

```js
reservePlaceholderSpace: true
```

That asks Ezoic not to collapse the placeholder to 0 before fill. It does **not** replace the clip shell. Without the shell, Ezoic can still paint a taller unit and shift the page.

## What not to do

- Do not let the slot be `height: auto` and “grow when the ad arrives.” That *is* the jitter.
- Do not put `overflow: hidden` only on the inner `.beehiiv-ezoic-ad` and leave the outer height unlocked.
- Do not add a second in-page footer 728×90 on www. This kit uses a **pre-h1 header slot** plus Ezoic’s **bottom sticky anchor** (`setEzoicAnchorAd(true)`). A second in-page footer doubled CLS and fought Beehiiv’s chrome.

## Tradeoff (also in the root README)

90px matches a standard leaderboard. Some creatives are taller; they get cropped. On HTML the Worker **owns** (not Beehiiv), you can grow the shell so creatives are not sliced — that is the opposite knob: more room, more shift unless the new height is reserved too.

For Beehiiv www, keep **90px reserved + clip**. If you raise it, raise `BANNER_CLIP_HEIGHT_PX`, bump `HTML_CACHE_VERSION`, and redeploy.

## Related: SPA leftover (not CLS, still “jank”)

Beehiiv client-navs without a full load. If you inject only in the first HTML document, then click to `/about`, the sticky anchor and clip shell stay. The boot script in `starter/src/ezoic.js` patches `pushState` / `replaceState`, listens for `popstate`, and **tears down** mounts + sticky chrome off `/p|/t|/archive`. That is a separate bug from CLS; both need to be in the Worker.
