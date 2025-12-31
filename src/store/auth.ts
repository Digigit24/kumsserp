import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  reset: () => void;
}

const initialState: Pick<AuthState, "user" | "token" | "isAuthenticated"> = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setUser: (user) =>
          set((state) => ({
            ...state,
            user,
          })),
        setToken: (token) => {
          // Store token in localStorage for backward compatibility with fetch API calls
          if (token) {
            localStorage.setItem('kumss_auth_token', token);
            console.log('[AuthStore] Token stored in localStorage:', token);
          } else {
            localStorage.removeItem('kumss_auth_token');
            console.log('[AuthStore] Token removed from localStorage');
          }

          return set((state) => ({
            ...state,
            token,
            isAuthenticated: Boolean(token),
          }));
        },
        reset: () => {
          // Clear all auth-related data from localStorage
          localStorage.removeItem('kumss_auth_token');
          localStorage.removeItem('kumss_user_id');
          localStorage.removeItem('kumss_college_id');
          localStorage.removeItem('kumss_user');
          localStorage.removeItem('auth-storage');
          console.log('[AuthStore] Reset - cleared all auth data from localStorage');
          return set(() => ({ ...initialState }));
        },
      }),
      {
        name: "auth-storage",
      }
    )
  )
);
