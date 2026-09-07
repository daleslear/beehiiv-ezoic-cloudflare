# Prompt 05 — Privacy and Terms on the Worker

Beehiiv’s website builder (and API/MCP) is a bad place to keep long legal pages current. Serve them from Worker ASSETS at `/privacy` and `/terms` on www and apex.

## Do

- Keep `starter/public/privacy.html` and `terms.html` structure (nav, canonical, Gatekeeper so CMP can open on the legal page)
- Replace the placeholder body with **counsel-approved** copy I paste. If I have not pasted copy, leave the placeholders and say so — do not invent a Privacy Policy
- Point Beehiiv footer / website links at `/privacy` and `/terms` (same-origin paths)
- Cache legal HTML modestly (e.g. 5 minutes)

## Do not

- Publish Beehiiv posts named Privacy/Terms to “make URLs”
- Copy another publisher’s legal text
- 301 legal pages through Beehiiv

## Done when

- `https://www.{domain}/privacy` and `/terms` are the Worker documents
- Apex hosts match
- CMP / “Your Privacy Choices” link has a `#do-not-sell` (or Gatekeeper) target
