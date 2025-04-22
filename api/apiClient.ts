import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// request interceptor
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor to handle unauthorized requests
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const UNAUTHENTICATED = 401;
    if (error.response?.status === UNAUTHENTICATED) {
      useAuthStore.getState().logout();
      redirect("/login");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
