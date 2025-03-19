import apiClient from "@/api/apiClient";
import { User } from "@/api/models";

export interface AuthResponse {
  status: number;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<AuthResponse>("/login", data),

  signup: (data: SignupRequest) =>
    apiClient.post<AuthResponse>("/register", data),

  resetPassword: (id: number) =>
    apiClient.post<{ message: string }>(`/reset-password/${id}`),

  logout: () => apiClient.post<{ message: string }>("/logout"),

  getUser: (id: number) => apiClient.get<User>(`/users/${id}`),

  getAllUsers: () => apiClient.get<User[]>("/users"),

  updateUser: (id: number, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, data),
};
