import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/api/models";
import { authApi } from "@/api/auth";

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

          // return response.data.user;
          return response.data.status;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({ error: errorMessage, isLoading: false });
          return null;
        }
      },

      resetPassword: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.resetPassword(id);
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Password reset failed";
          set({ error: errorMessage, isLoading: false });
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
          // return response.data.user;
          return response.data.status;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Registration failed";
          set({ error: errorMessage, isLoading: false });
          return null;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (error) {
          console.log(error);
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
