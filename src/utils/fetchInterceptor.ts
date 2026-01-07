/**
 * Global Fetch Interceptor
 * Handles 401 errors and automatic logout
 */

let isRedirecting = false;

/**
 * Handle authentication failure
 */
const handleAuthFailure = () => {
  if (isRedirecting) return;

  // If we are already on the login page, don't trigger a redirect loop
  if (window.location.pathname.includes("/login")) return;

  isRedirecting = true;

  console.error(
    "[fetchInterceptor] 401 Unauthorized - Token expired or invalid"
  );

  // Clear all auth data
  localStorage.removeItem("kumss_user");
  localStorage.removeItem("kumss_auth_token");
  localStorage.removeItem("kumss_user_id");
  localStorage.removeItem("kumss_college_id");
  localStorage.removeItem("kumss_is_authenticated");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("auth-storage");

  // Redirect to login
  window.location.href = "/login";
};

/**
 * Setup global fetch interceptor
 */
export const setupFetchInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);

      // Check for 401 Unauthorized
      if (response.status === 401) {
        const url = typeof args[0] === "string" ? args[0] : args[0].url;

        // Don't logout on login endpoint failures
        if (!url.includes("/auth/login/")) {
          handleAuthFailure();
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  console.log("[fetchInterceptor] Global fetch interceptor initialized");
};
