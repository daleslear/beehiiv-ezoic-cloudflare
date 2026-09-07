/**
 * One-site registry. Kill switch is ezoic.enabled.
 * Paste your Ads.txt Manager URL from Ezoic PubDash — do not guess an id.
 */

export const HOST_CODES = {
  "www.example.com": "SITE",
  "example.com": "SITE",
};

export const BRANDS = {
  SITE: { ezoic: { enabled: true } },
};

/** https://srv.adstxtmanager.com/{YOUR_ID}/{your-root-domain} */
export const ADS_TXT_SOURCE_BY_CODE = {
  SITE: "https://srv.adstxtmanager.com/YOUR_MANAGER_ID/example.com",
};

export function brandCodeForHost(host) {
  return HOST_CODES[(host || "").split(":")[0].toLowerCase()] || null;
}

export function shouldInjectEzoic(code) {
  return BRANDS[code]?.ezoic?.enabled === true;
}

export function adsTxtSourceFor(code) {
  return ADS_TXT_SOURCE_BY_CODE[code] || null;
}
