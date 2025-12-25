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
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api.config";

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

// Fetch user from /api/v1/auth/user/ (basic auth user)
export const fetchAuthUser = async (): Promise<AuthUser> => {
  const response = await apiClient.get<AuthUser>(API_ENDPOINTS.auth.user);
  return response.data;
};

// Fetch full user details from /api/v1/accounts/users/me/ (includes college)
// This call bypasses apiClient to avoid sending X-College-ID header (which we don't have yet)
export const fetchUserDetails = async (): Promise<any> => {
  const token = localStorage.getItem('kumss_auth_token');
  
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users.me}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Token ${token}` : '',
      // Intentionally NOT including X-College-ID header
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Failed to fetch user details');
  }

  return await response.json();
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