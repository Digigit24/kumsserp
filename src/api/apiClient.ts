import { API_BASE_URL, getDefaultHeaders } from "@/config/api.config";
import axios from "axios";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    ...getDefaultHeaders(),
  },
});

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
    if (error.response?.status === 401) {
      console.error('[apiClient] 401 Unauthorized - Token may be invalid or missing');
      // Optionally redirect to login or clear auth data
    }
    return Promise.reject(error);
  }
);

export default apiClient;
