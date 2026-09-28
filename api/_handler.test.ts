import assert from "node:assert/strict";
import { before, test } from "node:test";
import { seed } from "./_seed";
import { readSession } from "./_auth";
import { execute, HttpError } from "./_handler";

before(() => {
  process.env.AUTH_SECRET = "test-secret-with-at-least-thirty-two-characters";
  process.env.INITIAL_ADMIN_PASSWORD = "InitialPassword123!";
});

function input(path: string, method = "GET", body?: unknown) {
  return { path, method, body, params: new URLSearchParams(), origin: "https://example.test" };
}

test("login signs a server-verifiable session", async () => {
  const result = await execute(input("/Auth/login", "POST", { email: "admin@caspian.example", companyVoen: "1234567890", password: "InitialPassword123!" }), seed(), null);
  const token = (result.value as { accessToken: string }).accessToken;
  const session = readSession(new Request("https://example.test", { headers: { Authorization: `Bearer ${token}` } }));
  assert.equal(session?.sub, "u-admin");
  assert.equal(session?.role, "COMPANY_ADMIN");
});

test("a company admin cannot read another company's users", async () => {
  const session = { sub: "u-admin", role: "COMPANY_ADMIN" as const, companyId: "c-1", exp: Date.now() / 1000 + 60 };
  await assert.rejects(() => execute(input("/CompanyAdmin/users/company/c-2"), seed(), session), (error: unknown) => error instanceof HttpError && error.status === 403);
});

test("profile edits update shared state without accepting role changes", async () => {
  const state = seed();
  const session = { sub: "u-leyla", role: "EMPLOYEE" as const, companyId: "c-1", exp: Date.now() / 1000 + 60 };
  const result = await execute(input("/User/profile", "PUT", { jobTitle: "Yeni vəzifə", role: 1 }), state, session);
  assert.equal(result.dirty, true);
  assert.equal(state.employees.find(e => e.id === "u-leyla")?.jobTitle, "Yeni vəzifə");
  assert.equal(state.employees.find(e => e.id === "u-leyla")?.role, 2);
});

test("public card reads do not require a login", async () => {
  const state = seed();
  const result = await execute(input("/cards/u-leyla"), state, null);
  assert.equal((result.value as { id: string }).id, "u-leyla");
  assert.equal(state.scans?.length, 1);
  const session = { sub: "u-admin", role: "COMPANY_ADMIN" as const, companyId: "c-1", exp: Date.now() / 1000 + 60 };
  const count = await execute(input("/Analytics/scans/count"), state, session);
  assert.equal(count.value, 1);
});

test("Excel import stores employee records for other sessions", async () => {
  const { default: writeExcelFile } = await import("write-excel-file/node");
  const buffer = await writeExcelFile([["Ad", "Soyad", "Vəzifə", "E-poçt", "Telefon"], ["Yeni", "İşçi", "Mühəndis", "yeni@example.com", "+994 50 123 45 67"]]).toBuffer();
  const form = new FormData();
  form.set("file", new File([Uint8Array.from(buffer)], "users.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const state = seed();
  const session = { sub: "u-admin", role: "COMPANY_ADMIN" as const, companyId: "c-1", exp: Date.now() / 1000 + 60 };
  const result = await execute(input("/ExportImport/excel/import/c-1", "POST", form), state, session);
  assert.equal((result.value as { created: number }).created, 1);
  assert.equal(state.employees.find(e => e.email === "yeni@example.com")?.companyId, "c-1");
});
