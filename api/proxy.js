// api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).json({ ok: false, error: "Falta el parámetro ?url=" });
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FUEGO_PROXY/1.0)",
        "Accept": "application/json, text/plain, */*",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    // Si devuelve JSON, parsear directamente
    if (contentType.includes("application/json")) {
      return res.status(200).json(JSON.parse(text));
    }

    // Si devuelve HTML u otro formato
    return res.status(200).json({ ok: true, html: text });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Error interno del proxy",
      detalle: err.message,
    });
  }
}
