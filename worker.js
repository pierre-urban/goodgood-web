import settings from "./src/_data/settings.json";

// Static files from _site are served by Cloudflare before this worker runs;
// the worker only handles paths that are not a file, e.g. /api/subscribe.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/subscribe") return subscribe(request, url);
    return env.ASSETS.fetch(request);
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function subscribe(request, url) {
  if (request.method !== "POST") return json(405, { ok: false, error: "method" });

  // Only accept submissions from the site's own pages.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== url.host) return json(403, { ok: false, error: "origin" });

  const base = (settings.substack_url || "").trim().replace(/\/+$/, "");
  if (!base) return json(503, { ok: false, error: "not_configured" });

  let email = "";
  try {
    email = String((await request.json()).email || "").trim();
  } catch {}
  if (!EMAIL_RE.test(email) || email.length > 254) return json(400, { ok: false, error: "email" });

  // Substack's own signup endpoint (the one its embed form uses):
  // adds the address as a free subscriber of the publication.
  const page = request.headers.get("referer") || url.origin + "/";
  const res = await fetch(base + "/api/v1/free", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email,
      first_url: page,
      first_referrer: "",
      current_url: page,
      current_referrer: "",
      referral_code: "",
      source: "embed",
    }),
  });

  if (!res.ok) return json(502, { ok: false, error: "substack", status: res.status });
  return json(200, { ok: true });
}
