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
  login: (email: string, password: string) => Promise<void | null>;
  resetPassword: (id: number) => Promise<boolean>;
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
    },
  ),
);
