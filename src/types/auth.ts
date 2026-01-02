export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  key: string;
  user?: AuthUser;
}

export interface AuthUser {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  student_id?: number;
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
