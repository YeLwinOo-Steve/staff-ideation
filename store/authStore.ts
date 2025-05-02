import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/api/models";
import { authApi } from "@/api/auth";
import { AxiosError } from "axios";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
    ip: string,
    browser: string
  ) => Promise<void | null>;
  resetPassword: (id: number) => Promise<boolean>;
  changePassword: (old_password: string, new_password: string) => Promise<void>;
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

      login: async (email, password, ip, browser) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({
            email,
            password,
            ip_address: ip,
            browser,
          });
          set({
            user: response.data.data,
            token: response.data.token,
            isLoading: false,
          });
        } catch (error) {
          const e = error as AxiosError<{ message: string }>;
          const message = e.response?.data?.message || "Login failed";
          set({ user: null, error: message, isLoading: false });
          throw error;
        }
      },

      resetPassword: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.resetPassword(id);
          set({ isLoading: false });
          return true;
        } catch (error) {
          const e = error as AxiosError<{ message: string }>;
          const message = e.response?.data?.message || "Password reset failed";
          set({ error: message, isLoading: false });
          return false;
        }
      },

      changePassword: async (old_password: string, new_password: string) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.changePassword({ old_password, new_password });
          set({ isLoading: false });
        } catch (error) {
          const e = error as AxiosError<{ message: string }>;
          const message = e.response?.data?.message || "Password change failed";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (error) {
          const e = error as AxiosError<{ message: string }>;
          const message = e.response?.data?.message || "Logout failed";
          set({ error: message });
          throw error;
        } finally {
          set({ user: null, token: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
