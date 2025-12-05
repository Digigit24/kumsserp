import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { LoginRequest } from "@/types";

export const useLogin = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      if (response?.key) {
        setToken(response.key);
      }
      navigate("/dashboard", { replace: true });
    },
  });
};
