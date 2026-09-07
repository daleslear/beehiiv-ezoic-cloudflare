# Prompt 07 — Smoke and kill switch

Walk `CHECKLIST.md` with me. Use curl + instructions for what I should click. Do not claim ads “fill” without a live screenshot or my confirmation.

## Kill switch

- `BRANDS.SITE.ezoic.enabled = false`
- Redeploy
- Bump `HTML_CACHE_VERSION` so 30-minute HTML cache dies
- Confirm `/p/...` HTML no longer contains `ezojs.com` or Gatekeeper

## If fill fails

Debug in this order: PubDash domain + ads.txt 200 → Cloudflare cache (version bump) → view-source has scripts → JS console / CMP → Beehiiv DOM (`h1` still exists). Do not “fix” by adding GTM or Beehiiv custom head.

## Done when

- Checklist boxes that can be verified from HTML/headers are done
- Remaining eyeball items (fill, CMP UI) are listed as my job
