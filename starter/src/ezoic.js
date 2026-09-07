/**
 * Ezoic inject for Beehiiv www (HTMLRewriter).
 * Beehiiv hydration wipes static divs — boot script recreates mounts.
 * CLS: 90px clip shell + overflow:hidden + reservePlaceholderSpace.
 */

export const EZOIC_MARKER = "data-ezoic-overlay=\"www\"";

/**
 * Fixed banner slot height — reserves space before fill; clips taller creatives.
 */
export const BANNER_CLIP_HEIGHT_PX = 90;

export function ezoicHeadScriptsHtml() {
  return `<!-- EzoicAds www -->
<script data-cfasync="false" src="https://cmp.gatekeeperconsent.com/min.js"></script>
<script data-cfasync="false" src="https://the.gatekeeperconsent.com/cmp.min.js"></script>
<script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
<script>
  window.ezstandalone = window.ezstandalone || {};
  ezstandalone.cmd = ezstandalone.cmd || [];
  ezstandalone.cmd.push(function () {
    ezstandalone.config({
      disableInterstitial: true,
      disableVideo: true,
      disableRightSideRail: true,
      anchorAdPosition: "bottom",
      vignetteDesktop: false,
      vignetteMobile: false,
      vignetteTablet: false,
      anchorAdExpansion: false,
      reservePlaceholderSpace: true
    });
  });
</script>
<script src="//ezoicanalytics.com/analytics.js"></script>`;
}

/** Outer clip shell + inner placeholder (style the shell, not the Ezoic placeholder). */
export function ezoicPlaceholderHtml(position = "top") {
  const h = BANNER_CLIP_HEIGHT_PX;
  return `<div class="beehiiv-ezoic-clip" data-ad-slot="${position}" ${EZOIC_MARKER} style="box-sizing:border-box;width:100%;height:${h}px;max-height:${h}px;margin:1rem 0;overflow:hidden;display:flex;justify-content:center;align-items:center;clear:both;">
<div class="beehiiv-ezoic-ad" data-ad-slot="${position}" data-sizes="728x90" data-mobile_sizes="320x50" data-fluid="false" ${EZOIC_MARKER} style="width:100%;height:100%;max-height:${h}px;overflow:hidden;display:flex;justify-content:center;align-items:center;"></div>
</div>`;
}

/**
 * Beehiiv hydration wipes static edge divs. Recreate + place relative to chrome:
 * top ≈ before first h1. No in-page footer mount — sticky anchor covers bottom.
 */
export function ezoicBootScriptHtml() {
  return `<script ${EZOIC_MARKER}>
(function () {
  // Beehiiv www is an SPA. Ezoic is injected only on first HTML for /p|/t|/archive,
  // so client nav to /about (etc.) would otherwise leave sticky + 728x90 shells.
  function normalizePath(pathname) {
    return String(pathname || "/").replace(/\\/+$/, "") || "/";
  }
  function isMonetizedPath(pathname) {
    var path = normalizePath(pathname);
    if (path.indexOf("/p/") === 0) return true;
    if (path.indexOf("/t/") === 0) return true;
    if (path === "/archive" || path.indexOf("/archive/") === 0) return true;
    return false;
  }
  var CLIP_H = ${BANNER_CLIP_HEIGHT_PX};
  function applyClipStyles(clip, inner) {
    clip.style.cssText = "box-sizing:border-box;width:100%;height:" + CLIP_H + "px;max-height:" + CLIP_H + "px;margin:1rem 0;overflow:hidden;display:flex;justify-content:center;align-items:center;clear:both;";
    if (inner) {
      inner.style.cssText = "width:100%;height:100%;max-height:" + CLIP_H + "px;overflow:hidden;display:flex;justify-content:center;align-items:center;";
    }
  }
  function makeMount() {
    var clip = document.createElement("div");
    clip.className = "beehiiv-ezoic-clip";
    clip.setAttribute("data-ad-slot", "top");
    clip.setAttribute("data-ezoic-overlay", "www");
    var inner = document.createElement("div");
    inner.className = "beehiiv-ezoic-ad";
    inner.setAttribute("data-ad-slot", "top");
    inner.setAttribute("data-sizes", "728x90");
    inner.setAttribute("data-mobile_sizes", "320x50");
    inner.setAttribute("data-fluid", "false");
    inner.setAttribute("data-ezoic-overlay", "www");
    applyClipStyles(clip, inner);
    clip.appendChild(inner);
    return clip;
  }
  function placeTopMount(el) {
    var h1 = document.querySelector("h1");
    if (h1 && h1.parentElement) {
      h1.parentElement.insertBefore(el, h1);
      return;
    }
    document.body.insertBefore(el, document.body.firstChild);
  }
  function ensureMounts() {
    // Drop legacy in-page footer mounts (kept sticky anchor via setEzoicAnchorAd)
    document.querySelectorAll('.beehiiv-ezoic-ad[data-ad-slot="bottom"], .beehiiv-ezoic-clip[data-ad-slot="bottom"]').forEach(function (el) {
      el.remove();
    });
    var clip = document.querySelector('.beehiiv-ezoic-clip[data-ad-slot="top"]');
    var inner = document.querySelector('.beehiiv-ezoic-ad[data-ad-slot="top"]');
    if (!clip) {
      if (inner && !inner.closest(".beehiiv-ezoic-clip")) {
        clip = document.createElement("div");
        clip.className = "beehiiv-ezoic-clip";
        clip.setAttribute("data-ad-slot", "top");
        clip.setAttribute("data-ezoic-overlay", "www");
        if (inner.parentElement) {
          inner.parentElement.insertBefore(clip, inner);
        }
        clip.appendChild(inner);
      } else {
        clip = makeMount();
        inner = clip.querySelector(".beehiiv-ezoic-ad");
      }
    } else if (!inner) {
      inner = document.createElement("div");
      inner.className = "beehiiv-ezoic-ad";
      inner.setAttribute("data-ad-slot", "top");
      inner.setAttribute("data-sizes", "728x90");
      inner.setAttribute("data-mobile_sizes", "320x50");
      inner.setAttribute("data-fluid", "false");
      inner.setAttribute("data-ezoic-overlay", "www");
      clip.appendChild(inner);
    }
    applyClipStyles(clip, inner);
    placeTopMount(clip);
  }
  function removeNodes(selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.remove();
    });
  }
  function removeStickyChrome() {
    removeNodes('[data-anchor-status]');
    removeNodes('[id*="adhesion-bar"]');
    removeNodes("#ezmob-footer");
    removeNodes('[id*="ezmob-footer"]');
    removeNodes(".ezoic-floating-bottom");
    removeNodes('[class*="ezoic-anchor"]');
    removeNodes('[id*="ezoic-anchor"]');
    removeNodes(".ezsticky");
    removeNodes("#inhibads_top");
    Array.prototype.slice.call(document.body ? document.body.children : []).forEach(function (el) {
      if (!el || el.nodeType !== 1) return;
      var id = (el.id || "").toLowerCase();
      var cls = (typeof el.className === "string" ? el.className : "").toLowerCase();
      var attr = ((el.getAttribute("data-ez-name") || "") + " " + (el.getAttribute("data-anchor-status") || "")).toLowerCase();
      var looksEz =
        id.indexOf("ezoic") >= 0 ||
        id.indexOf("ezmob") >= 0 ||
        id.indexOf("adhesion") >= 0 ||
        cls.indexOf("ezoic") >= 0 ||
        cls.indexOf("ezmob") >= 0 ||
        cls.indexOf("adhesion") >= 0 ||
        attr.indexOf("displayed") >= 0 ||
        el.hasAttribute("data-anchor-status");
      if (!looksEz) return;
      var style = window.getComputedStyle ? window.getComputedStyle(el) : null;
      var pos = style ? style.position : "";
      if (pos === "fixed" || pos === "sticky") el.remove();
    });
  }
  function teardownAds() {
    if (window.ezstandalone && ezstandalone.cmd) {
      ezstandalone.cmd.push(function () {
        if (typeof ezstandalone.setEzoicAnchorAd === "function") {
          ezstandalone.setEzoicAnchorAd(false);
        }
        if (typeof ezstandalone.destroyAll === "function") {
          try { ezstandalone.destroyAll(); } catch (e) {}
        } else if (typeof ezstandalone.destroyPlaceholders === "function") {
          try { ezstandalone.destroyPlaceholders(); } catch (e) {}
        }
      });
    }
    if (typeof window.__ez_close_anchor === "function") {
      try { window.__ez_close_anchor(); } catch (e) {}
    }
    removeNodes(".beehiiv-ezoic-clip");
    removeNodes(".beehiiv-ezoic-ad");
    removeNodes('[data-ezoic-overlay="www"]');
    removeNodes('[id^="ezoic-pub-ad-placeholder"]');
    removeNodes(".ezoic-ad");
    removeNodes(".ez-sidebar-wall");
    removeNodes("#ez-sidebar-wall-container");
    removeStickyChrome();
  }
  function show() {
    if (!window.ezstandalone || !ezstandalone.cmd) return;
    ezstandalone.cmd.push(function () {
      ensureMounts();
      if (typeof ezstandalone.setEzoicAnchorAd === "function") {
        ezstandalone.setEzoicAnchorAd(true);
      }
      ezstandalone.showAds(".beehiiv-ezoic-ad");
    });
  }
  var stickySweepTimer = null;
  function stopStickySweep() {
    if (stickySweepTimer) {
      clearInterval(stickySweepTimer);
      stickySweepTimer = null;
    }
  }
  function startStickySweep() {
    stopStickySweep();
    var ticks = 0;
    stickySweepTimer = setInterval(function () {
      removeStickyChrome();
      if (typeof window.__ez_close_anchor === "function") {
        try { window.__ez_close_anchor(); } catch (e) {}
      }
      ticks += 1;
      if (ticks >= 10) stopStickySweep();
    }, 300);
  }
  function syncForPath(pathname) {
    if (isMonetizedPath(pathname)) {
      stopStickySweep();
      ensureMounts();
      show();
      return;
    }
    teardownAds();
    startStickySweep();
  }
  var lastPath = normalizePath(location.pathname);
  function onRouteMaybeChanged() {
    var next = normalizePath(location.pathname);
    if (next === lastPath) return;
    lastPath = next;
    setTimeout(function () {
      syncForPath(next);
    }, 50);
    setTimeout(function () {
      syncForPath(next);
    }, 800);
  }
  function patchHistory(methodName) {
    var orig = history[methodName];
    if (typeof orig !== "function") return;
    history[methodName] = function () {
      var ret = orig.apply(this, arguments);
      onRouteMaybeChanged();
      return ret;
    };
  }
  function boot() {
    syncForPath(location.pathname);
    setTimeout(function () {
      syncForPath(location.pathname);
    }, 1200);
    patchHistory("pushState");
    patchHistory("replaceState");
    window.addEventListener("popstate", onRouteMaybeChanged);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
</script>`;
}

export function ezoicBodyMountHtml() {
  return ezoicPlaceholderHtml("top") + ezoicBootScriptHtml();
}

export function shouldRewriteHtml(htmlSnippet, contentType) {
  if (!contentType || !contentType.toLowerCase().includes("text/html")) return false;
  const s = htmlSnippet || "";
  if (/ezojs\.com\/ezoic\/sa\.min\.js/i.test(s)) return false;
  if (/gatekeeperconsent\.com/i.test(s)) return false;
  if (/data-ezoic-overlay=["']www["']/i.test(s)) return false;
  if (/Just a moment\.\.\./i.test(s)) return false;
  if (/cf-mitigated/i.test(s)) return false;
  if (/challenge-platform/i.test(s)) return false;
  return true;
}

export async function peekHtml(response, maxBytes = 8192) {
  const buf = await response.arrayBuffer();
  const slice = buf.byteLength > maxBytes ? buf.slice(0, maxBytes) : buf;
  const text = new TextDecoder("utf-8", { fatal: false }).decode(slice);
  return { buf, text };
}
