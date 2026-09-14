import type { AxiosInstance } from "axios";
import { mockAdapter } from "./mockAdapter";

export const isMockMode = import.meta.env.VITE_MOCK_MODE === "true";

export function installMockAdapter(client: AxiosInstance): void {
  if (!isMockMode) return;
  client.defaults.adapter = mockAdapter;
}
