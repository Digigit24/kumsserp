/**
 * Authentication Service for KUMSS ERP
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS, buildApiUrl, getDefaultHeaders } from '../config/api.config';
import type { LoginCredentials, LoginResponse, User, ApiError } from '../types/auth.types';

/**
 * Local storage keys
 */
const STORAGE_KEYS = {
  USER: 'kumss_user',
  IS_AUTHENTICATED: 'kumss_is_authenticated',
  AUTH_TOKEN: 'kumss_auth_token',
} as const;

/**
 * Get stored auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Login user with credentials
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Build headers properly
    const headers = new Headers();
    const defaultHeaders = getDefaultHeaders();
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
      method: 'POST',
      headers,
      credentials: 'include', // Important for session cookies
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.detail || errorData.message || 'Login failed',
        status: response.status,
        detail: errorData.detail,
        errors: errorData,
      } as ApiError;
    }

    // Get response data (could be token auth or session auth)
    const data = await response.json().catch(() => ({}));

    console.log('[loginUser] Login response:', data);

    // Store auth token if present (DRF Token Authentication)
    if (data.key) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.key);
      console.log('[loginUser] Token stored in localStorage:', data.key);
    } else {
      console.warn('[loginUser] No token (key) in response! Using session auth?');
    }

    // Extract user info from response
    const user: User = data.user || {
      id: data.id || 0,
      username: credentials.username,
      email: data.email || '',
      firstName: data.first_name || data.firstName,
      lastName: data.last_name || data.lastName,
      fullName: data.full_name || data.fullName,
      isStaff: data.is_staff || data.isStaff,
      isSuperuser: data.is_superuser || data.isSuperuser,
      isActive: data.is_active !== undefined ? data.is_active : true,
    };

    // Store auth state in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');

    return {
      success: true,
      user,
      message: 'Login successful',
    };
  } catch (error) {
    // Clear any stored auth data on error
    clearAuthData();

    if ((error as ApiError).message) {
      throw error;
    }

    throw {
      message: 'Network error. Please check your connection.',
      status: 0,
    } as ApiError;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Build headers properly
    const headers = new Headers();
    const defaultHeaders = getDefaultHeaders();
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    await fetch(buildApiUrl(API_ENDPOINTS.auth.logout), {
      method: 'POST',
      headers,
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local auth data
    clearAuthData();
  }
};

/**
 * Check if user is authenticated (verify session)
 */
export const checkAuthentication = async (): Promise<User | null> => {
  try {
    // First check localStorage
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);

    if (!storedUser || isAuthenticated !== 'true') {
      return null;
    }

    // Verify session with backend (optional - depends on your API)
    // You might have a /api/auth/me or /api/auth/verify endpoint
    // For now, we'll trust the localStorage if cookies are present

    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error('Auth check error:', error);
    clearAuthData();
    return null;
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);

    if (!storedUser || isAuthenticated !== 'true') {
      return null;
    }

    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Check if user is authenticated (synchronous check)
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
};
