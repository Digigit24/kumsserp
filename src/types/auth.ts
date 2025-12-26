export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  key: string;
  user?: AuthUser;
}

export interface AuthUser {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  full_name?: string;
  gender?: string;
  gender_display?: string;
  date_of_birth?: string;
  avatar?: string;
  college?: number;
  college_name?: string;
  user_type?: string;
  user_type_display?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_verified?: boolean;
  last_login?: string;
  last_login_ip?: string;
  date_joined?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  detail: string;
}

export interface PasswordChangeRequest {
  new_password1: string;
  new_password2: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  new_password1: string;
  new_password2: string;
  uid: string;
  token: string;
}
