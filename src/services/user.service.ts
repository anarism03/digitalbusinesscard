import { apiClient } from "./axios/axiosInstance";
import type { UpdateUserProfileDto } from "../types";

export const userService = {
  updateProfile: (data: UpdateUserProfileDto) =>
    apiClient.put("/User/profile", data),
};
