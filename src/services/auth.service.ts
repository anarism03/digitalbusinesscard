import { apiClient } from "./axios/axiosInstance";
import type { ChangePasswordDto, LoginRequest, LoginResponse } from "../types";

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>("/Auth/login", data),

  changePassword: (data: ChangePasswordDto) =>
    apiClient.post("/Auth/change-password", data),

  getAccountInfo: () => apiClient.get("/Auth/account-info"),
};
