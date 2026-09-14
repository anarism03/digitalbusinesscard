import axios from "axios";
import { unwrapResponseData } from "./axios/axiosInstance";
import { installMockAdapter } from "../mocks";

const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

publicClient.interceptors.response.use(unwrapResponseData);
installMockAdapter(publicClient);

export const publicService = {
  getCard: (id: string, source?: string) =>
    publicClient.get(`/cards/${id}`, {
      params: source ? { source } : undefined,
    }),
};
