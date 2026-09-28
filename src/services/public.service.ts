import axios from "axios";
import { API_BASE_URL, unwrapResponseData } from "./axios/axiosInstance";
import { demoAdapter } from "../mock/demo";

const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  adapter: demoAdapter,
});

publicClient.interceptors.response.use(unwrapResponseData);

export const publicService = {
  getCard: (id: string, source?: string) =>
    publicClient.get(`/cards/${id}`, {
      params: source ? { source } : undefined,
    }),
};
