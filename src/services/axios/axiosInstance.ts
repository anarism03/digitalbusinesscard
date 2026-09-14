import axios, { type AxiosResponse } from "axios";
import { getStore } from "./storeAccessor";
import { installMockAdapter } from "../../mocks";

export function unwrapResponseData(response: AxiosResponse) {
  return response.data as unknown as AxiosResponse;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

installMockAdapter(apiClient);

apiClient.interceptors.request.use((config) => {
  const token = getStore()?.getState()?.auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(unwrapResponseData, (error) => {
  const store = getStore();
  if (error.response?.status === 401 && store?.getState()?.auth?.token) {
    store.dispatch({ type: "auth/logout" });
    window.location.href = "/login";
  }
  return Promise.reject(error);
});
