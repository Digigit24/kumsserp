import apiClient from "./apiClient";
import {
  AuthResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
} from "../types";
import { API_ENDPOINTS } from "@/config/api.config";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    API_ENDPOINTS.auth.login,
    data
  );
  return response.data;
};

export const logout = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.auth.logout,
    {}
  );
  return response.data;
};

export const passwordChange = async (
  data: PasswordChangeRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.auth.passwordChange,
    data
  );
  return response.data;
};

export const passwordReset = async (
  data: PasswordResetRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.auth.passwordReset,
    data
  );
  return response.data;
};

export const passwordResetConfirm = async (
  data: PasswordResetConfirmRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.auth.passwordResetConfirm,
    data
  );
  return response.data;
};

export const fetchAuthUser = async (): Promise<AuthUser> => {
  const response = await apiClient.get<AuthUser>(API_ENDPOINTS.auth.user);
  return response.data;
};

export const updateAuthUser = async (data: AuthUser): Promise<AuthUser> => {
  const response = await apiClient.put<AuthUser>(
    API_ENDPOINTS.auth.user,
    data
  );
  return response.data;
};

export const patchAuthUser = async (data: Partial<AuthUser>): Promise<AuthUser> => {
  const response = await apiClient.patch<AuthUser>(
    API_ENDPOINTS.auth.user,
    data
  );
  return response.data;
};
