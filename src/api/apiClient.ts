import { API_BASE_URL, getDefaultHeaders } from "@/config/api.config";
import axios from "axios";
import { useAuthStore } from "@/store/auth";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    ...getDefaultHeaders(),
  },
});

/**
 * Logout user and clear all auth data
 * Called when token expires or auth fails
 */
function handleAuthFailure(errorMessage?: string) {
  console.error('[apiClient] Auth failure:', errorMessage || 'Token expired or invalid');

  // Get the auth store and reset it
  const authStore = useAuthStore.getState();
  authStore.reset();

  // Clear all auth-related data from localStorage
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('kumss_user');
  localStorage.removeItem('kumss_auth_token');
  localStorage.removeItem('auth-storage'); // Zustand persisted state

  console.log('[apiClient] All auth data cleared. Redirecting to login...');

  // Redirect to login page
  window.location.href = '/login';
}

// Add request interceptor to include auth token in every request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('access');

    console.log('[apiClient] Request interceptor - Token:', token);

    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[apiClient] Added Authorization header to request');
    } else {
      console.warn('[apiClient] No token found in localStorage');
    }

    console.log('[apiClient] Final request headers:', config.headers);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401 Unauthorized, 403 Forbidden)
    if (error.response?.status === 401) {
      handleAuthFailure('401 Unauthorized - Token expired or invalid');
    } else if (error.response?.status === 403) {
      // 403 might indicate an expired or revoked token in some APIs
      const errorMessage = error.response?.data?.detail || error.response?.data?.message;
      if (errorMessage?.toLowerCase().includes('token') ||
          errorMessage?.toLowerCase().includes('credential') ||
          errorMessage?.toLowerCase().includes('authentication')) {
        handleAuthFailure('403 Forbidden - Authentication required');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
