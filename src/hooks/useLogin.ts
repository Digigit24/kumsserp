import { login } from "@/api/auth";
import { LoginRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useLogin = () => {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      // Store token
      if (response?.key) {
        setToken(response.key);
      }

      // Store user data (including college!)
      if (response?.user) {
        setUser(response.user);

        // CRITICAL: Store in localStorage for API config
        localStorage.setItem("kumss_user", JSON.stringify(response.user));
        // console.log("✅ User stored, college:", response.user.college);
      }

      navigate("/dashboard", { replace: true });
    },
  });
};
