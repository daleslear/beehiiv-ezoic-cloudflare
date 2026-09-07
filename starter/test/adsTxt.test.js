import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { serveAdsTxt, withAdsTxtLines } from "../src/adsTxt.js";

const SAMPLE_ADSENSE = "google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0";

describe("withAdsTxtLines", () => {
  it("appends a missing extra line", () => {
    const out = withAdsTxtLines("#Ads.txt\nezoic.ai, abc, DIRECT\n", [SAMPLE_ADSENSE]);
    assert.match(out, /ezoic\.ai, abc, DIRECT/);
    assert.match(out, /pub-0000000000000000/);
    assert.ok(out.endsWith("\n"));
  });

  it("does not duplicate an existing line", () => {
    const body = `${SAMPLE_ADSENSE}\nezoic.ai, abc, DIRECT\n`;
    const out = withAdsTxtLines(body, [SAMPLE_ADSENSE]);
    assert.equal(out.match(/pub-0000000000000000/g)?.length, 1);
  });
});

describe("serveAdsTxt", () => {
  it("returns 200 with manager body", async () => {
    const fetchImpl = async () => new Response("ezoic.ai, abc, DIRECT\n", { status: 200 });
    const res = await serveAdsTxt({
      sourceUrl: "https://srv.adstxtmanager.com/YOUR_MANAGER_ID/example.com",
      fetchImpl,
    });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/plain/);
    const text = await res.text();
    assert.match(text, /ezoic\.ai, abc, DIRECT/);
  });

  it("falls back to 302 when the manager is down and cache is empty", async () => {
    const fetchImpl = async () => new Response("nope", { status: 502 });
    const sourceUrl = "https://srv.adstxtmanager.com/YOUR_MANAGER_ID/example.com";
    const res = await serveAdsTxt({ sourceUrl, fetchImpl });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("location"), sourceUrl);
  });
});
