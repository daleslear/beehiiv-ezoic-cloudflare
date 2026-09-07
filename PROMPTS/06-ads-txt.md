# Prompt 06 — ads.txt as origin 200

Ezoic’s Ads.txt Manager is the seller list. Some crawlers (notably AdSense site verification) **will not accept** a 302 from `https://{domain}/ads.txt` to `srv.adstxtmanager.com`.

## Do

- I will paste my Ads.txt Manager URL: `https://srv.adstxtmanager.com/{id}/{root-domain}`
- Worker `GET /ads.txt` fetches that URL and returns **200** `text/plain` on www and apex
- Optionally append my AdSense DIRECT line if I provide one; do not invent a `pub-` id
- Cache ~5 minutes; on manager failure, serve last cached body, else 302 to the manager as last resort
- Do **not** add a Cloudflare Redirect Rule that 301s apex `/ads.txt` → www. Crawlers are picky about redirect chains. Serve 200 on both hosts.

## Done when

- `curl -sI https://www.{domain}/ads.txt` → 200, content-type text/plain
- Body contains Ezoic’s lines
- Apex `/ads.txt` is also 200
