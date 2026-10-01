import { randomUUID } from "node:crypto";
import { del } from "@vercel/blob";
import { readSession } from "./_auth.js";
import { readState, writeState } from "./_db.js";
import { execute, HttpError } from "./_handler.js";

function imageUrls(value: unknown, found = new Set<string>()): Set<string> {
  if (typeof value === "string" && /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(value)) found.add(value);
  else if (Array.isArray(value)) value.forEach(item => imageUrls(item, found));
  else if (value && typeof value === "object") Object.values(value).forEach(item => imageUrls(item, found));
  return found;
}

async function removeImages(urls: Iterable<string>) {
  const list = [...urls];
  if (list.length) await del(list).catch(error => console.error("Blob cleanup failed", error));
}

async function handle(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const path = "/" + (url.searchParams.get("path") || url.pathname.replace(/^\/api\/?/, "")).replace(/^\/+/, "");
    url.searchParams.delete("path");
    const method = request.method.toUpperCase();
    if (!["GET", "POST", "PUT"].includes(method)) return Response.json({ message: "Method not allowed" }, { status: 405 });
    const type = request.headers.get("content-type") || "";
    const rawBody = method === "GET" ? undefined : type.includes("multipart/form-data") ? await request.formData() : type.includes("application/json") ? await request.json() : await request.text();
    const session = readSession(request);
    const uploads = new Map<string, string>();
    const input = { path, method, params: url.searchParams, body: rawBody, origin: url.origin, uploads };

    try {
      for (let attempt = 0; attempt < 4; attempt++) {
        const { version, data } = await readState();
        const oldImages = imageUrls(data);
        const result = await execute(input, data, session);
        if (result.dirty && !path.startsWith("/cards/")) {
          const actor = data.employees.find(e => e.id === session?.sub);
          data.audit ??= [];
          data.audit.push({ id: randomUUID(), createdAt: new Date().toISOString(), userName: actor ? `${actor.firstName} ${actor.lastName}` : "Admin SetClapp", userEmail: actor?.email || "superadmin@setclapp.example", action: method === "POST" ? "CREATE" : "UPDATE", entityType: path.includes("companies") || path.includes("company") ? "Company" : "User", entityId: path.split("/").pop() || "", oldValues: {}, newValues: {} });
        }
        if (result.dirty && !(await writeState(version, data))) continue;
        if (result.dirty) {
          const currentImages = imageUrls(data);
          await removeImages([...oldImages].filter(image => !currentImages.has(image)));
        }
        if (result.value instanceof Blob) return new Response(result.value, { headers: { "Cache-Control": "no-store", "Content-Type": result.value.type } });
        return Response.json(result.value, { headers: { "Cache-Control": "no-store" } });
      }
    } catch (error) {
      await removeImages(uploads.values());
      throw error;
    }
    await removeImages(uploads.values());
    return Response.json({ message: "Məlumat eyni vaxtda dəyişdirildi. Yenidən cəhd edin." }, { status: 409 });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error(error);
    return Response.json({ message: error instanceof HttpError ? error.message : "Server xətası" }, { status, headers: { "Cache-Control": "no-store" } });
  }
}

export default { fetch: handle };
