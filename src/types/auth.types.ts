/**
 * Authentication Types for KUMSS ERP
 */

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  isStaff?: boolean;
  isSuperuser?: boolean;
  isActive?: boolean;
  dateJoined?: string;
  lastLogin?: string;
  userType?: string; // super_admin, college_admin, teacher, student, etc.
  college?: number | null; // College ID for non-super_admin users
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  sessionId?: string;
}

/**
 * Auth state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth context interface
 */
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * API Error response
 */
export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}
