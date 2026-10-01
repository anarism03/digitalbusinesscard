import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { BlobNotFoundError, BlobPreconditionFailedError, head, put } from "@vercel/blob";
import { seed, type AppState } from "./_seed.js";

const statePath = "mock-db/state.enc";

export interface StoredState {
  version: string;
  data: AppState;
}

function key(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters");
  return createHash("sha256").update("setclapp-blob-state-v1:").update(secret).digest();
}

export function encryptState(data: AppState): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]);
}

export function decryptState(value: Buffer): AppState {
  if (value.length < 29) throw new Error("Stored state is invalid");
  const decipher = createDecipheriv("aes-256-gcm", key(), value.subarray(0, 12));
  decipher.setAuthTag(value.subarray(12, 28));
  const data = JSON.parse(Buffer.concat([decipher.update(value.subarray(28)), decipher.final()]).toString("utf8")) as AppState;
  if (!Array.isArray(data.companies) || !Array.isArray(data.employees) || !data.passwords) throw new Error("Stored state is invalid");
  return data;
}

async function currentState() {
  try {
    return await head(statePath);
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

export async function readState(): Promise<StoredState> {
  const current = await currentState();
  if (!current) {
    try {
      await put(statePath, encryptState(seed()), {
        access: "public", contentType: "application/octet-stream", addRandomSuffix: false,
      });
    } catch (error) {
      if (await currentState() === null) throw error;
    }
    return readState();
  }

  const response = await fetch(`${current.url}?v=${encodeURIComponent(current.etag)}`, { cache: "no-store" });
  if (!response.ok) throw new Error("App state could not be read");
  const data = decryptState(Buffer.from(await response.arrayBuffer()));
  return { version: current.etag, data };
}

export async function writeState(previousVersion: string, data: AppState): Promise<boolean> {
  try {
    await put(statePath, encryptState(data), {
      access: "public",
      contentType: "application/octet-stream",
      allowOverwrite: true,
      ifMatch: previousVersion,
    });
    return true;
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) return false;
    throw error;
  }
}
