import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HTML_CACHE_SECONDS,
  HTML_CACHE_VERSION,
  normalizePath,
  shouldProxyEzoicPath,
} from "../src/paths.js";

describe("shouldProxyEzoicPath", () => {
  it("allows post, tag, and archive paths", () => {
    assert.equal(shouldProxyEzoicPath("/p/some-post"), true);
    assert.equal(shouldProxyEzoicPath("/p/foo/"), true);
    assert.equal(shouldProxyEzoicPath("/t/tag"), true);
    assert.equal(shouldProxyEzoicPath("/archive"), true);
    assert.equal(shouldProxyEzoicPath("/archive/page/2"), true);
  });

  it("blocks homepage, assets, and other paths", () => {
    assert.equal(shouldProxyEzoicPath("/"), false);
    assert.equal(shouldProxyEzoicPath("/privacy"), false);
    assert.equal(shouldProxyEzoicPath("/static/app.js"), false);
  });

  it("normalizes trailing slashes", () => {
    assert.equal(normalizePath("/p/foo/"), "/p/foo");
    assert.equal(normalizePath("/archive/"), "/archive");
  });

  it("uses 30 minute HTML cache TTL", () => {
    assert.equal(HTML_CACHE_SECONDS, 1800);
  });

  it("pins banner-clip-90 cache version", () => {
    assert.equal(HTML_CACHE_VERSION, "banner-clip-90");
  });
});
