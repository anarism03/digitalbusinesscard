import { message } from "../utils/feedback";
import { showApiError } from "../utils/apiError";
import { useApiMutation } from "./useApi";
import { useAppDispatch } from "../store/hooks";
import { fetchAccountInfo } from "../store/authSlice";
import { userService } from "../services/user.service";
import { authService } from "../services/auth.service";
import { EMPLOYEES_QUERY_KEY } from "./useEmployees";
import type { ChangePasswordDto, UpdateUserProfileDto } from "../types";

interface UpdateProfileRequest {
  data: UpdateUserProfileDto;
}

export function useUpdateProfile(userId: string) {
  const dispatch = useAppDispatch();

  return useApiMutation(
    ({ data }: UpdateProfileRequest) => userService.updateProfile(data),
    {
      invalidates: [`${EMPLOYEES_QUERY_KEY}-${userId}`, EMPLOYEES_QUERY_KEY],
      onSuccess: () => {
        message.success("Profil yeniləndi");
        dispatch(fetchAccountInfo());
      },
      onError: showApiError,
    },
  );
}

export function useChangePassword() {
  return useApiMutation(
    (data: ChangePasswordDto) => authService.changePassword(data),
    {
      onSuccess: () => message.success("Şifrə uğurla dəyişdirildi"),
      onError: showApiError,
    },
  );
}
