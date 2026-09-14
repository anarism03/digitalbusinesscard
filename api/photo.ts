import { head, put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

function pathnameFor(employeeId: string): string {
  return `employee-photos/${employeeId}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method === "GET") {
    const employeeId = String(req.query.employeeId ?? "");
    if (!employeeId) {
      return res.status(400).json({ message: "employeeId required" });
    }

    try {
      const blob = await head(pathnameFor(employeeId));
      return res.status(200).json({ url: blob.url });
    } catch {
      return res.status(404).json({ message: "Not found" });
    }
  }

  if (req.method === "POST") {
    const { employeeId, dataUrl } = req.body ?? {};
    if (typeof employeeId !== "string" || typeof dataUrl !== "string") {
      return res
        .status(400)
        .json({ message: "employeeId and dataUrl are required" });
    }

    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      return res.status(400).json({ message: "Invalid dataUrl" });
    }

    const [, contentType, base64] = match;
    const buffer = Buffer.from(base64, "base64");

    try {
      const blob = await put(pathnameFor(employeeId), buffer, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType,
      });
      return res.status(200).json({ url: blob.url });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end();
}
