/** Cache injected monetized HTML at the edge (seconds). */
export const HTML_CACHE_SECONDS = 1800;

/** Bump to invalidate Worker caches.default after inject/boot changes. */
export const HTML_CACHE_VERSION = "banner-clip-90";

export function normalizePath(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

/** Beehiiv www paths that receive Ezoic proxy + inject. */
export function shouldProxyEzoicPath(pathname) {
  const path = normalizePath(pathname);
  if (path.startsWith("/p/")) return true;
  if (path.startsWith("/t/")) return true;
  if (path === "/archive" || path.startsWith("/archive/")) return true;
  return false;
}
