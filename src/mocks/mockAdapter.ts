import type { AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { createFakeJwt } from "./fakeJwt";
import {
  DEMO_ACCOUNTS,
  MOCK_COMPANY_ID,
  addEmployee,
  findEmployee,
  findEmployeeByEmail,
  hydrateMockDb,
  mockAuditLog,
  mockCompany,
  mockEmployees,
  mockScanChart,
  mockScanLogs,
  mockSuperAdminUser,
  otherMockCompanies,
  snapshotMockDb,
  updateMockCompany,
  upsertEmployee,
} from "./mockDb";
import type { Employee } from "../types";
import { decodeJwt } from "../utils/jwt";

function currentUser(config: InternalAxiosRequestConfig) {
  const header = config.headers?.get
    ? config.headers.get("Authorization")
    : (config.headers as Record<string, unknown> | undefined)?.Authorization;
  const token = typeof header === "string" ? header.replace(/^Bearer\s+/i, "") : "";
  return token ? decodeJwt(token) : null;
}

interface MockResult {
  status: number;
  data: unknown;
}

async function persistPhotoIfNeeded(
  employeeId: string,
  photoUrl: unknown,
): Promise<string | undefined> {
  if (typeof photoUrl !== "string" || !photoUrl.startsWith("data:")) {
    return typeof photoUrl === "string" ? photoUrl : undefined;
  }

  try {
    const response = await fetch("/api/photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, dataUrl: photoUrl }),
    });
    if (!response.ok) return photoUrl;
    const { url } = (await response.json()) as { url: string };
    return url;
  } catch {
    return photoUrl;
  }
}

let hydratePromise: Promise<void> | null = null;

function ensureHydrated(): Promise<void> {
  if (!hydratePromise) {
    hydratePromise = fetch("/api/db", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && (data.employees || data.company)) hydrateMockDb(data);
      })
      .catch(() => {});
  }
  return hydratePromise;
}

async function persistState(): Promise<void> {
  try {
    await fetch("/api/db", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshotMockDb()),
    });
  } catch {
    // best effort — demo data, not worth surfacing a failure for
  }
}

function parseBody(config: InternalAxiosRequestConfig): Record<string, unknown> {
  const raw = config.data;
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as Record<string, unknown>;
  return {};
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    totalCount: items.length,
    page,
    pageSize,
  };
}

function loginResponse(user: {
  id: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";
  companyId?: string | null;
  canEdit?: boolean;
}): MockResult {
  return {
    status: 200,
    data: {
      accessToken: createFakeJwt(user),
      isFirstLogin: false,
    },
  };
}

function handleLogin(config: InternalAxiosRequestConfig): MockResult {
  const body = parseBody(config);
  const email = String(body.email ?? "").toLowerCase();
  const password = String(body.password ?? "");

  if (
    email === DEMO_ACCOUNTS.superAdmin.email &&
    password === DEMO_ACCOUNTS.superAdmin.password
  ) {
    return loginResponse({
      id: mockSuperAdminUser.id,
      email: mockSuperAdminUser.email,
      fullName: mockSuperAdminUser.fullName,
      role: "SUPER_ADMIN",
    });
  }

  if (
    email === DEMO_ACCOUNTS.companyAdmin.email &&
    password === DEMO_ACCOUNTS.companyAdmin.password
  ) {
    return loginResponse({
      id: "user-admin",
      email: DEMO_ACCOUNTS.companyAdmin.email,
      fullName: "Aygün Məmmədova",
      role: "COMPANY_ADMIN",
      companyId: MOCK_COMPANY_ID,
      canEdit: true,
    });
  }

  const employee = findEmployeeByEmail(email);
  if (employee && employee.role === 2 && password === DEMO_ACCOUNTS.employee.password) {
    return loginResponse({
      id: employee.id,
      email: employee.email,
      fullName: employee.fullName,
      role: "EMPLOYEE",
      companyId: MOCK_COMPANY_ID,
      canEdit: employee.canEdit,
    });
  }

  return {
    status: 401,
    data: { message: "E-poçt və ya şifrə yanlışdır" },
  };
}

function employeeFromBody(body: Record<string, unknown>, id: string): Employee {
  const firstName = String(body.firstName ?? "");
  const lastName = String(body.lastName ?? "");
  return {
    id,
    companyId: String(body.companyId ?? MOCK_COMPANY_ID),
    firstName,
    lastName,
    middleName: body.middleName as string | undefined,
    fullName: [firstName, lastName].filter(Boolean).join(" "),
    jobTitle: body.jobTitle as string | undefined,
    phone1: body.phone1 as string | undefined,
    phone2: body.phone2 as string | undefined,
    whatsappPhone: body.whatsappPhone as string | undefined,
    extensionNumber: body.extensionNumber as string | undefined,
    additionalInfo: body.additionalInfo as string | undefined,
    email: String(body.email ?? ""),
    role: 2,
    isActive: true,
    canEdit: Boolean(body.canEdit ?? false),
    photoUrl: body.photoUrl as string | undefined,
    linkedinUrl: body.linkedinUrl as string | undefined,
    facebookUrl: body.facebookUrl as string | undefined,
    instagramUrl: body.instagramUrl as string | undefined,
    googleMapsUrl: body.googleMapsUrl as string | undefined,
    address: body.address as string | undefined,
    birthday: body.birthday as string | undefined,
    cardBackgroundUrl: body.cardBackgroundUrl as string | undefined,
    socialAccounts: (body.socialAccounts as Employee["socialAccounts"]) ?? [],
    contactInfos: (body.contactInfos as Employee["contactInfos"]) ?? [],
    scanCount: 0,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  };
}

interface Route {
  method: string;
  pattern: RegExp;
  handle: (
    config: InternalAxiosRequestConfig,
    match: RegExpMatchArray,
  ) => MockResult | Promise<MockResult>;
}

const routes: Route[] = [
  {
    method: "post",
    pattern: /^\/Auth\/login$/,
    handle: (config) => handleLogin(config),
  },
  {
    method: "post",
    pattern: /^\/Auth\/change-password$/,
    handle: () => ({ status: 200, data: {} }),
  },
  {
    method: "get",
    pattern: /^\/Auth\/account-info$/,
    handle: (config) => {
      const user = currentUser(config);
      const employee = user ? findEmployee(user.id) : undefined;
      return {
        status: 200,
        data: {
          firstName: employee?.firstName ?? user?.firstName ?? "",
          lastName: employee?.lastName ?? user?.lastName ?? "",
          companyId: user?.companyId ?? null,
          canEdit: employee?.canEdit ?? user?.canEdit ?? true,
          isFirstLogin: false,
        },
      };
    },
  },
  {
    method: "get",
    pattern: /^\/CompanyAdmin\/company$/,
    handle: () => ({ status: 200, data: mockCompany }),
  },
  {
    method: "put",
    pattern: /^\/CompanyAdmin\/company$/,
    handle: (config) => ({
      status: 200,
      data: updateMockCompany(parseBody(config)),
    }),
  },
  {
    method: "get",
    pattern: /^\/CompanyAdmin\/users\/company\/([^/]+)$/,
    handle: (config) => {
      const page = Number(config.params?.page ?? 1);
      const pageSize = Number(config.params?.pageSize ?? 20);
      return { status: 200, data: paginate(mockEmployees, page, pageSize) };
    },
  },
  {
    method: "get",
    pattern: /^\/User\/([^/]+)$/,
    handle: (_config, match) => {
      const employee = findEmployee(match[1]);
      if (!employee) return { status: 404, data: { message: "Tapılmadı" } };
      return { status: 200, data: employee };
    },
  },
  {
    method: "post",
    pattern: /^\/CompanyAdmin\/users$/,
    handle: (config) => {
      const body = parseBody(config);
      const employee = employeeFromBody(body, `emp-${Date.now()}`);
      addEmployee(employee);
      return { status: 200, data: employee };
    },
  },
  {
    method: "put",
    pattern: /^\/CompanyAdmin\/users\/([^/]+)$/,
    handle: async (config, match) => {
      const body = parseBody(config);
      body.photoUrl = await persistPhotoIfNeeded(match[1], body.photoUrl);
      const updated = upsertEmployee(match[1], body);
      if (!updated) return { status: 404, data: { message: "Tapılmadı" } };
      return { status: 200, data: updated };
    },
  },
  {
    method: "put",
    pattern: /^\/CompanyAdmin\/users\/([^/]+)\/active$/,
    handle: (config, match) => {
      const isActive = String(config.params?.isActive) === "true";
      const updated = upsertEmployee(match[1], { isActive });
      return { status: 200, data: updated ?? {} };
    },
  },
  {
    method: "put",
    pattern: /^\/CompanyAdmin\/users\/([^/]+)\/canedit$/,
    handle: (config, match) => {
      const canEdit = String(config.params?.canEdit) === "true";
      const updated = upsertEmployee(match[1], { canEdit });
      return { status: 200, data: updated ?? {} };
    },
  },
  {
    method: "post",
    pattern: /^\/CompanyAdmin\/users\/([^/]+)\/reset-password$/,
    handle: () => ({ status: 200, data: {} }),
  },
  {
    method: "get",
    pattern: /^\/CompanyAdmin\/users\/([^/]+)\/nfc-link$/,
    handle: (_config, match) => ({
      status: 200,
      data: { url: `${mockCompany.nfcBaseUrl}/${match[1]}?src=nfc` },
    }),
  },
  {
    method: "put",
    pattern: /^\/User\/profile$/,
    handle: async (config) => {
      const body = parseBody(config);
      const user = currentUser(config);
      const id = String(body.id ?? user?.id ?? "user-admin");
      body.photoUrl = await persistPhotoIfNeeded(id, body.photoUrl);
      const updated = upsertEmployee(id, body) ?? mockEmployees[0];
      return { status: 200, data: updated };
    },
  },
  {
    method: "get",
    pattern: /^\/Analytics\/scans\/count$/,
    handle: () => ({
      status: 200,
      data: { count: mockScanLogs.length + 240 },
    }),
  },
  {
    method: "get",
    pattern: /^\/Analytics\/scans\/chart$/,
    handle: () => ({ status: 200, data: mockScanChart }),
  },
  {
    method: "get",
    pattern: /^\/Analytics\/employees\/ranking$/,
    handle: () => ({
      status: 200,
      data: [...mockEmployees]
        .filter((employee) => employee.role === 2)
        .sort((a, b) => (b.scanCount ?? 0) - (a.scanCount ?? 0))
        .map((employee) => ({
          employeeId: employee.id,
          fullName: employee.fullName,
          jobTitle: employee.jobTitle,
          photoUrl: employee.photoUrl,
          scanCount: employee.scanCount,
        })),
    }),
  },
  {
    method: "get",
    pattern: /^\/Analytics\/scans\/logs$/,
    handle: (config) => {
      const page = Number(config.params?.page ?? 1);
      const pageSize = Number(config.params?.pageSize ?? 20);
      return { status: 200, data: paginate(mockScanLogs, page, pageSize) };
    },
  },
  {
    method: "get",
    pattern: /^\/AuditLog$/,
    handle: (config) => {
      const page = Number(config.params?.page ?? 1);
      const pageSize = Number(config.params?.pageSize ?? 10);
      return { status: 200, data: paginate(mockAuditLog, page, pageSize) };
    },
  },
  {
    method: "get",
    pattern: /^\/SuperAdmin\/dashboard$/,
    handle: () => ({
      status: 200,
      data: {
        companiesCount: otherMockCompanies.length + 1,
        activeCompaniesCount:
          otherMockCompanies.filter((c) => c.isActive).length + 1,
        inactiveCompaniesCount: otherMockCompanies.filter((c) => !c.isActive)
          .length,
        recentCompanies: [mockCompany, ...otherMockCompanies],
        topCompaniesByScans: [mockCompany, ...otherMockCompanies].map(
          (company, index) => ({
            companyId: company.id,
            companyName: company.name,
            logoUrl: company.logoUrl,
            isActive: company.isActive,
            scanCount: 320 - index * 90,
          }),
        ),
      },
    }),
  },
  {
    method: "get",
    pattern: /^\/SuperAdmin\/companies$/,
    handle: (config) => {
      const page = Number(config.params?.page ?? 1);
      const pageSize = Number(config.params?.pageSize ?? 20);
      return {
        status: 200,
        data: paginate([mockCompany, ...otherMockCompanies], page, pageSize),
      };
    },
  },
  {
    method: "get",
    pattern: /^\/SuperAdmin\/companies\/([^/]+)$/,
    handle: (_config, match) => {
      const company = [mockCompany, ...otherMockCompanies].find(
        (c) => c.id === match[1],
      );
      if (!company) return { status: 404, data: { message: "Tapılmadı" } };
      return { status: 200, data: company };
    },
  },
  {
    method: "post",
    pattern: /^\/SuperAdmin\/companies$/,
    handle: (config) => {
      const body = parseBody(config);
      return {
        status: 200,
        data: {
          id: `demo-company-${Date.now()}`,
          ...body,
          isActive: true,
          adminEmail: body.email ?? "",
          defaultPassword: "demo1234",
        },
      };
    },
  },
  {
    method: "put",
    pattern: /^\/SuperAdmin\/companies\/([^/]+)$/,
    handle: (config, match) => {
      if (match[1] === MOCK_COMPANY_ID) {
        return { status: 200, data: updateMockCompany(parseBody(config)) };
      }
      return { status: 200, data: parseBody(config) };
    },
  },
  {
    method: "put",
    pattern: /^\/SuperAdmin\/companies\/([^/]+)\/active$/,
    handle: (config, match) => {
      const isActive = String(config.params?.isActive) === "true";
      if (match[1] === MOCK_COMPANY_ID) updateMockCompany({ isActive });
      return { status: 200, data: {} };
    },
  },
  {
    method: "put",
    pattern: /^\/SuperAdmin\/companies\/([^/]+)\/limit$/,
    handle: (config, match) => {
      const limit = Number(parseBody(config) ?? 0) || Number(config.data) || 0;
      if (match[1] === MOCK_COMPANY_ID) updateMockCompany({ userLimit: limit });
      return { status: 200, data: {} };
    },
  },
  {
    method: "get",
    pattern: /^\/cards\/([^/]+)$/,
    handle: (_config, match) => {
      const employee = findEmployee(match[1]);
      if (!employee) return { status: 404, data: { message: "Kart tapılmadı" } };
      return { status: 200, data: employee };
    },
  },
];

function findRoute(method: string, path: string) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = path.match(route.pattern);
    if (match) return { route, match };
  }
  return null;
}

export async function mockAdapter(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> {
  await ensureHydrated();

  const method = (config.method ?? "get").toLowerCase();
  const path = (config.url ?? "").split("?")[0];
  const found = findRoute(method, path);

  const result: MockResult = found
    ? await found.route.handle(config, found.match)
    : { status: 200, data: {} };

  if (method !== "get" && result.status < 400) {
    await persistState();
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response: AxiosResponse = {
        data: result.data,
        status: result.status,
        statusText: result.status < 400 ? "OK" : "Error",
        headers: {} as AxiosHeaders,
        config,
      };
      if (result.status >= 400) {
        reject({ response, config, isAxiosError: true, message: "Mock error" });
      } else {
        resolve(response);
      }
    }, 350);
  });
}
