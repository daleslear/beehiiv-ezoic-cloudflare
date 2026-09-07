# Prompt 02 — Worker routes (narrow)

Copy `starter/` into a Worker project. Fill in **my** domain only. Do not inject Ezoic yet — first ship routes that proxy Beehiiv unchanged (or 404 outside the allowlist).

## Routes (www and apex)

```
www.{domain}/p/*
www.{domain}/t/*
www.{domain}/archive*
www.{domain}/privacy*
www.{domain}/terms*
www.{domain}/ads.txt
{domain}/p/*
{domain}/t/*
{domain}/archive*
{domain}/privacy*
{domain}/terms*
{domain}/ads.txt
```

No `/*`. Homepage and `/_next` / static assets must stay off the Worker.

`wrangler.toml`: omit Cloudflare `account_id` in git; use the user’s logged-in wrangler / env. Never commit API tokens.

## Worker behavior at this step

- Known host → if path is monetized, `fetch(request)` Beehiiv and return as-is
- `/privacy` `/terms` → ASSETS placeholder HTML
- `/ads.txt` → temporary 404 or a stub is OK until prompt 06
- Unknown host → 404

## Done when

- A `/p/...` URL still looks like Beehiiv
- `/` is unchanged Beehiiv
- `/privacy` returns Worker HTML
- `wrangler.toml` has no secrets
