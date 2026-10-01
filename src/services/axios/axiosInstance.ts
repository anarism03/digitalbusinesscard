import axios, { type AxiosResponse } from "axios";
import { getStore } from "./storeAccessor";
import { isTrustedAssetUrl } from "../../utils/url";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export function unwrapResponseData(response: AxiosResponse) {
  return response.data as unknown as AxiosResponse;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = getStore()?.getState()?.auth?.token;
  if (token && isTrustedAssetUrl(apiClient.getUri(config))) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(unwrapResponseData, (error) => {
  const store = getStore();
  const token = store?.getState().auth.token;
  if (
    store &&
    token &&
    error.response?.status === 401 &&
    error.config?.headers?.Authorization === `Bearer ${token}`
  ) {
    store.dispatch({ type: "auth/logout" });
    window.location.href = "/login";
  }
  return Promise.reject(error);
});
