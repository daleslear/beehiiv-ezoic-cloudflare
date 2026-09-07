/**
 * Serve ads.txt as HTTP 200 on origin.
 * Ezoic Ads.txt Manager stays the seller list. Optional extraLines (e.g. AdSense DIRECT).
 */

export const ADS_TXT_CACHE_SECONDS = 300;
export const ADS_TXT_CACHE_VERSION = "v1";

export function normalizeAdsTxtBody(body) {
  return String(body || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function withAdsTxtLines(body, extraLines = []) {
  const text = normalizeAdsTxtBody(body);
  const have = new Set(
    text
      .split("\n")
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line && !line.startsWith("#")),
  );
  const add = [];
  for (const line of extraLines) {
    const trimmed = String(line || "").trim();
    if (!trimmed || have.has(trimmed.toLowerCase())) continue;
    add.push(trimmed);
    have.add(trimmed.toLowerCase());
  }
  if (!add.length) return text.endsWith("\n") || text === "" ? text : `${text}\n`;
  const base = text === "" || text.endsWith("\n") ? text : `${text}\n`;
  return `${base}${add.join("\n")}\n`;
}

export function adsTxtResponse(body, maxAge = ADS_TXT_CACHE_SECONDS) {
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": `public, max-age=${maxAge}`,
    },
  });
}

export function adsTxtCacheKey(sourceUrl) {
  return new Request(
    `https://ads-txt.cache.invalid/${ADS_TXT_CACHE_VERSION}/${encodeURIComponent(sourceUrl)}`,
  );
}

/**
 * @param {{
 *   sourceUrl: string,
 *   extraLines?: string[],
 *   fetchImpl?: typeof fetch,
 *   cache?: { match: Function, put: Function },
 * }} opts
 */
export async function serveAdsTxt({
  sourceUrl,
  extraLines = [],
  fetchImpl = fetch,
  cache = null,
}) {
  const cacheKey = adsTxtCacheKey(sourceUrl);
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }

  try {
    const upstream = await fetchImpl(sourceUrl, {
      headers: { accept: "text/plain,*/*" },
    });
    if (upstream.ok) {
      const body = withAdsTxtLines(await upstream.text(), extraLines);
      const res = adsTxtResponse(body);
      if (cache) await cache.put(cacheKey, res.clone());
      return res;
    }
  } catch {
    // fall through
  }

  if (cache) {
    const stale = await cache.match(cacheKey);
    if (stale) return stale;
  }

  return Response.redirect(sourceUrl, 302);
}
