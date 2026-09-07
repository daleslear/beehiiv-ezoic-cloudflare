/**
 * Privacy / Terms ASSETS, ads.txt 200, Beehiiv proxy + Ezoic inject.
 * No Beehiiv API / publish paths — edge HTML only.
 */

import { adsTxtSourceFor, brandCodeForHost, shouldInjectEzoic } from "./brands.js";
import { serveAdsTxt } from "./adsTxt.js";
import {
  ezoicBodyMountHtml,
  ezoicHeadScriptsHtml,
  peekHtml,
  shouldRewriteHtml,
} from "./ezoic.js";
import { HTML_CACHE_SECONDS, HTML_CACHE_VERSION, shouldProxyEzoicPath } from "./paths.js";

async function asset(env, request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  let res = await env.ASSETS.fetch(new Request(url.toString(), request));
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("Location");
    if (loc) {
      const next = new URL(loc, url);
      res = await env.ASSETS.fetch(new Request(next.toString(), request));
    }
  }
  const type = res.headers.get("content-type") || "text/html; charset=utf-8";
  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: {
      "content-type": type,
      "cache-control": "public, max-age=300",
    },
  });
}

function withHtmlCache(response, maxAge = HTML_CACHE_SECONDS) {
  const headers = new Headers(response.headers);
  headers.set("cache-control", `public, max-age=${maxAge}, s-maxage=${maxAge}`);
  headers.delete("etag");
  headers.delete("age");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function bufferResponse(response) {
  const body = await response.arrayBuffer();
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

function injectEzoic(response) {
  const head = ezoicHeadScriptsHtml();
  const body = ezoicBodyMountHtml();
  return new HTMLRewriter()
    .on("head", {
      element(el) {
        el.append(head, { html: true });
      },
    })
    .on("body", {
      element(el) {
        el.append(body, { html: true });
      },
    })
    .transform(response);
}

function injectedHtmlCacheKey(request) {
  const u = new URL(request.url);
  u.searchParams.set("ezoic_overlay_cache", HTML_CACHE_VERSION);
  return new Request(u.toString(), request);
}

async function proxyBeehiiv(request, inject) {
  const cache = caches.default;
  const cacheKey = injectedHtmlCacheKey(request);
  const useCache = inject && request.method === "GET";

  if (useCache) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }

  const originRes = await fetch(request);

  if (!inject) return originRes;
  if (originRes.status !== 200) return originRes;

  const contentType = originRes.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("text/html")) return originRes;

  const { buf, text } = await peekHtml(originRes);
  const rebuilt = new Response(buf, {
    status: originRes.status,
    statusText: originRes.statusText,
    headers: originRes.headers,
  });

  if (!shouldRewriteHtml(text, contentType)) return rebuilt;

  const injected = withHtmlCache(await bufferResponse(injectEzoic(rebuilt)));
  if (useCache) {
    await cache.put(cacheKey, injected.clone());
  }
  return injected;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = (request.headers.get("host") || url.host || "").split(":")[0].toLowerCase();
    const code = brandCodeForHost(host);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (!code) {
      return new Response("Not Found\n", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    if (path === "/ads.txt") {
      const sourceUrl = adsTxtSourceFor(code);
      if (!sourceUrl) {
        return new Response("Not Found\n", {
          status: 404,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
      return serveAdsTxt({
        sourceUrl,
        fetchImpl: fetch,
        cache: caches.default,
      });
    }

    if (path === "/privacy" || path === "/privacy.html") {
      return asset(env, request, "/privacy.html");
    }
    if (path === "/terms" || path === "/terms.html") {
      return asset(env, request, "/terms.html");
    }

    if (!shouldProxyEzoicPath(url.pathname)) {
      return new Response("Not Found\n", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    return proxyBeehiiv(request, shouldInjectEzoic(code));
  },
};
