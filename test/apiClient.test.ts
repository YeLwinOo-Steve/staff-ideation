import { mockApiClient } from "./mockApiClient";
import apiClient from "@/api/apiClient";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

// Mock the auth store
jest.mock("@/store/authStore", () => ({
  useAuthStore: {
    getState: jest.fn(() => ({
      token: "test-token",
    })),
  },
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Register interceptors
    const requestHandler = (config: any) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };
    const responseHandler = (response: any) => response;
    const errorHandler = (error: any) => {
      if (error.response?.status === 401) {
        const { redirect } = require("next/navigation");
        redirect("/login");
      }
      return Promise.reject(error);
    };

    mockApiClient.interceptors.request.use(requestHandler);
    mockApiClient.interceptors.response.use(responseHandler, errorHandler);
  });

  describe("Request Handling", () => {
    it("should not add authorization header when token does not exist", async () => {
      // Mock auth store to return no token
      (useAuthStore.getState as jest.Mock).mockReturnValueOnce({
        token: null,
      });

      const mockResponse = { data: { message: "success" } };
      mockApiClient.get.mockResolvedValueOnce(mockResponse);

      await apiClient.get("/test");

      expect(mockApiClient.get).toHaveBeenCalledWith("/test");
      expect(mockApiClient.defaults.headers.common?.Authorization).toBeUndefined();
    });
  });

  describe("Response Handling", () => {
    it("should handle successful responses", async () => {
      const mockResponse = { data: { message: "success" } };
      mockApiClient.get.mockResolvedValueOnce(mockResponse);

      const response = await apiClient.get("/test");

      expect(response).toEqual(mockResponse);
    });

    it("should pass through other errors", async () => {
      const error = new axios.AxiosError(
        "Server Error",
        "500",
        undefined,
        undefined,
        {
          status: 500,
          data: { message: "Server Error" }
        } as any
      );

      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(apiClient.get("/test")).rejects.toThrow();

      const { redirect } = require("next/navigation");
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("Base Configuration", () => {
    it("should have correct base configuration", () => {
      expect(mockApiClient.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_BASE_URL);
      expect(mockApiClient.defaults.headers.Accept).toBe("application/json");
      expect(mockApiClient.defaults.headers["Content-Type"]).toBe("application/json");
    });
  });
});
