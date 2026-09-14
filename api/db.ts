import { head, put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const STATE_PATH = "mock-db/state.json";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method === "GET") {
    try {
      const blob = await head(STATE_PATH);
      const response = await fetch(`${blob.url}?v=${Date.now()}`, {
        cache: "no-store",
      });
      const json = await response.json();
      return res.status(200).json(json);
    } catch {
      return res.status(404).json({});
    }
  }

  if (req.method === "PUT") {
    try {
      await put(STATE_PATH, JSON.stringify(req.body ?? {}), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 0,
      });
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Save failed",
      });
    }
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).end();
}
