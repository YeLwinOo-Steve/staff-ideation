import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/api/models";
import { authApi } from "@/api/auth";
import { showToast } from "@/util/toast";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<number | null>;
  resetPassword: (id: number) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<number | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          set({
            // user: response.data.user,
            token: response.data.token,
            isLoading: false,
          });
          showToast("Login successful", "success");
          // return response.data.user;
          return response.data.status;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({ error: errorMessage, isLoading: false });
          showToast(errorMessage, "error");
          return null;
        }
      },

      resetPassword: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.resetPassword(id);
          set({ isLoading: false });
          showToast("Password reset email sent successfully", "info");
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Password reset failed";
          set({ error: errorMessage, isLoading: false });
          showToast(errorMessage, "error");
          return false;
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.signup({ name, email, password });
          set({
            // user: response.data.user,
            token: response.data.token,
            isLoading: false,
          });
          showToast("Registration successful", "success");
          // return response.data.user;
          return response.data.status;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Registration failed";
          set({ error: errorMessage, isLoading: false });
          showToast(errorMessage, "error");
          return null;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
          showToast("Logged out successfully", "success");
        } catch (error) {
          // Even if logout API fails, we still clear the user
          showToast("Something went wrong", "error");
        } finally {
          set({ user: null, token: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
