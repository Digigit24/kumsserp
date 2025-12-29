import { login } from "@/api/auth";
import { LoginRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { extractEnabledPermissions } from "@/utils/permissions";
import type { User } from "@/types/auth.types";

export const useLogin = () => {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      console.log("✅ Login response received:", response);

      // Store token
      if (response?.key) {
        setToken(response.key);
        localStorage.setItem("kumss_auth_token", response.key);
        localStorage.setItem("kumss_user_id", response.user?.id || "");
      }

      // Process and store complete user data
      if (response?.user) {
        // Extract flattened permissions from nested structure
        const flatPermissions = extractEnabledPermissions(response.user_permissions);

        // Build comprehensive user object with all data
        const fullUser: User = {
          ...response.user,
          // Add permissions
          user_permissions: response.user_permissions,
          permissions: flatPermissions,
          // Add roles
          user_roles: response.user_roles,
          // Add college info
          accessible_colleges: response.accessible_colleges,
          tenant_ids: response.tenant_ids,
          college_id: response.college_id,
        };

        // Store in auth context
        setUser(fullUser);

        // CRITICAL: Store complete data in localStorage for API config and permissions
        localStorage.setItem("kumss_user", JSON.stringify(fullUser));

        console.log("✅ User stored with permissions:", {
          user_type: fullUser.user_type,
          college: fullUser.college,
          permissions: flatPermissions.length,
          roles: response.user_roles?.length || 0,
        });
      }

      navigate("/dashboard", { replace: true });
    },
  });
};
