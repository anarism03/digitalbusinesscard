import axios from "axios";
import { API_BASE_URL, unwrapResponseData } from "./axios/axiosInstance";

const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

publicClient.interceptors.response.use(unwrapResponseData);

export const publicService = {
  getCard: (id: string, source?: string) =>
    publicClient.get(`/cards/${id}`, {
      params: source ? { source } : undefined,
    }),
};
