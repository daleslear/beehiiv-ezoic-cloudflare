# Prompt 01 — DNS (orange cloud)

Set up DNS so a Cloudflare Worker can sit in front of Beehiiv. Do not deploy the Worker yet.

## Target state

- `www.{domain}` CNAME `cname.beehiiv.com`, **proxied** (orange cloud)
- Apex `{domain}` CNAME `www.{domain}`, **proxied** (Cloudflare flattens the apex)
- Beehiiv publication: Web domain = `www.{domain}`, Redirect domain = `{domain}` if they use that split
- No Ezoic nameserver change
- Do **not** orange-cloud a `newsletter.{domain}` (or similar) CNAME directly at `cname.beehiiv.com` — Cloudflare error 1014. If a leftover `newsletter` host exists, 301 it to apex with a dummy proxied A record, or leave it grey/unproxied

## Ask me for

- Apex domain
- Whether Beehiiv currently expects grey-cloud (we will switch www+apex to proxied)
- Any extra hostnames that must stay untouched (do not attach this Worker to them)

## Done when

- `dig` / Cloudflare dashboard shows orange cloud on www and apex
- Visiting `https://www.{domain}/` still serves Beehiiv (Worker not attached yet)
- You have written the exact `wrangler.toml` route hostnames we will use in prompt 02
