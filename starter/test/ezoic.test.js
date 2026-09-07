import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shouldInjectEzoic, brandCodeForHost, adsTxtSourceFor } from "../src/brands.js";
import {
  BANNER_CLIP_HEIGHT_PX,
  ezoicBodyMountHtml,
  ezoicHeadScriptsHtml,
  shouldRewriteHtml,
} from "../src/ezoic.js";

describe("brand gate", () => {
  it("maps example hosts", () => {
    assert.equal(brandCodeForHost("www.example.com"), "SITE");
    assert.equal(brandCodeForHost("example.com"), "SITE");
  });

  it("ezoic on by default", () => {
    assert.equal(shouldInjectEzoic("SITE"), true);
  });

  it("ads.txt source is a manager URL placeholder", () => {
    assert.match(adsTxtSourceFor("SITE"), /adstxtmanager\.com/);
    assert.match(adsTxtSourceFor("SITE"), /YOUR_MANAGER_ID/);
  });
});

describe("shouldRewriteHtml", () => {
  it("allows normal Beehiiv-like HTML", () => {
    assert.equal(
      shouldRewriteHtml("<!doctype html><html><head><title>Post</title></head><body>", "text/html"),
      true,
    );
  });

  it("skips non-html", () => {
    assert.equal(shouldRewriteHtml("<html>", "application/json"), false);
  });

  it("skips challenge and already-injected pages", () => {
    assert.equal(shouldRewriteHtml("<title>Just a moment...</title>", "text/html"), false);
    assert.equal(
      shouldRewriteHtml('<script src="//www.ezojs.com/ezoic/sa.min.js"></script>', "text/html"),
      false,
    );
    assert.equal(
      shouldRewriteHtml('<script src="https://cmp.gatekeeperconsent.com/min.js"></script>', "text/html"),
      false,
    );
  });
});

describe("snippets", () => {
  it("includes Gatekeeper, sa.min, 90px clip, sticky anchor on", () => {
    const head = ezoicHeadScriptsHtml();
    const body = ezoicBodyMountHtml();
    assert.match(head, /gatekeeperconsent\.com/);
    assert.match(head, /ezojs\.com\/ezoic\/sa\.min\.js/);
    assert.match(head, /anchorAdPosition:\s*"bottom"/);
    assert.match(head, /reservePlaceholderSpace:\s*true/);
    assert.match(body, /beehiiv-ezoic-clip/);
    assert.match(body, /beehiiv-ezoic-ad/);
    assert.equal((body.match(/class="beehiiv-ezoic-ad"/g) || []).length, 1);
    assert.match(body, new RegExp(`height:${BANNER_CLIP_HEIGHT_PX}px`));
    assert.match(body, /overflow:hidden/);
    assert.match(body, /data-ad-slot="top"/);
    assert.doesNotMatch(body, /<div class="beehiiv-ezoic-ad"[^>]*data-ad-slot="bottom"/);
    assert.match(body, /ensureMounts/);
    assert.match(body, /setEzoicAnchorAd\(true\)/);
    assert.match(body, /showAds\("\.beehiiv-ezoic-ad"\)/);
  });

  it("tears down Ezoic on SPA navigations off monetized paths", () => {
    const body = ezoicBodyMountHtml();
    assert.match(body, /isMonetizedPath/);
    assert.match(body, /teardownAds/);
    assert.match(body, /setEzoicAnchorAd\(false\)/);
    assert.match(body, /destroyAll/);
    assert.match(body, /__ez_close_anchor/);
    assert.match(body, /removeStickyChrome/);
    assert.match(body, /patchHistory\("pushState"\)/);
    assert.match(body, /patchHistory\("replaceState"\)/);
    assert.match(body, /popstate/);
  });
});
