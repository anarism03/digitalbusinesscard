export interface LoginRequest {
  email: string;
  password: string;
  companyVoen?: string;
}

export interface LoginResponse {
  accessToken: string;
  isFirstLogin?: boolean;
}

export interface ChangePasswordDto {
  oldPassword?: string;
  newPassword: string;
}
