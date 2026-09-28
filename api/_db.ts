import { neon } from "@neondatabase/serverless";
import { seed, type AppState } from "./_seed";

export interface StoredState {
  version: number;
  data: AppState;
}

function client() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

let schemaReady: Promise<void> | undefined;

function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    const sql = client();
    await sql`CREATE TABLE IF NOT EXISTS app_state (
      id TEXT PRIMARY KEY,
      version INTEGER NOT NULL DEFAULT 1,
      data JSONB NOT NULL
    )`;
    await sql`INSERT INTO app_state (id, data) VALUES ('main', ${JSON.stringify(seed())}::jsonb)
      ON CONFLICT (id) DO NOTHING`;
  })().catch(error => {
    schemaReady = undefined;
    throw error;
  });
  return schemaReady;
}

export async function readState(): Promise<StoredState> {
  await ensureSchema();
  const sql = client();
  const rows = await sql`SELECT version, data FROM app_state WHERE id = 'main'`;
  const row = rows[0] as unknown as StoredState | undefined;
  if (!row) throw new Error("App state could not be initialized");
  return row;
}

export async function writeState(previousVersion: number, data: AppState): Promise<boolean> {
  const sql = client();
  const rows = await sql`UPDATE app_state SET version = version + 1,
    data = ${JSON.stringify(data)}::jsonb
    WHERE id = 'main' AND version = ${previousVersion}
    RETURNING version`;
  return rows.length > 0;
}
