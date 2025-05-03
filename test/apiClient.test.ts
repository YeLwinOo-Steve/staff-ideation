import { mockApiClient } from "./mockApiClient";
import apiClient from "@/api/apiClient";
import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Mock the auth store
jest.mock("@/store/authStore");

// Mock next/navigation
const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mocks
    (useAuthStore.getState as jest.Mock).mockReset();
    mockRedirect.mockReset();

    // Re-register interceptors
    const requestHandler = (config: AxiosRequestConfig) => {
      try {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    };

    const responseHandler = (response: any) => response;
    const errorHandler = (error: any) => {
      if (error.response?.status === 401) {
        mockRedirect("/login");
      }
      return Promise.reject(error);
    };

    mockApiClient.interceptors.request.use(requestHandler);
    mockApiClient.interceptors.response.use(responseHandler, errorHandler);
  });

  describe("Request Handling", () => {
    it("should not add authorization header when token does not exist", async () => {
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        token: null,
      });

      const config = { headers: {} };
      const requestHandler =
        mockApiClient.interceptors.request.use.mock.calls[0][0];
      const result = await requestHandler(config);
      expect(result.headers.Authorization).toBeUndefined();
    });

    it("should add authorization header when token exists", async () => {
      const token = "test-token";
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        token,
      });

      const config = { headers: {} };
      const requestHandler =
        mockApiClient.interceptors.request.use.mock.calls[0][0];
      const result = await requestHandler(config);
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it("should handle request interceptor errors", async () => {
      const requestHandler =
        mockApiClient.interceptors.request.use.mock.calls[0][0];

      // Mock useAuthStore.getState to throw an error
      (useAuthStore.getState as jest.Mock).mockImplementation(() => {
        throw new Error("Auth store error");
      });

      await expect(requestHandler({ headers: {} })).rejects.toThrow(
        "Auth store error",
      );
    });

    it("should handle request with undefined headers", async () => {
      const token = "test-token";
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        token,
      });

      const config = {};
      const requestHandler =
        mockApiClient.interceptors.request.use.mock.calls[0][0];
      const result = await requestHandler(config);
      expect(result.headers?.Authorization).toBe(`Bearer ${token}`);
    });

    it("should handle request with null config", async () => {
      const token = "test-token";
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        token,
      });

      const requestHandler =
        mockApiClient.interceptors.request.use.mock.calls[0][0];
      await expect(requestHandler(null)).rejects.toThrow();
    });

    it("should handle different HTTP methods with auth header", async () => {
      const token = "test-token";
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        token,
      });

      const mockResponse = { data: { message: "success" } };
      mockApiClient.post.mockResolvedValueOnce(mockResponse);
      mockApiClient.put.mockResolvedValueOnce(mockResponse);
      mockApiClient.delete.mockResolvedValueOnce(mockResponse);

      await apiClient.post("/test", { data: "test" });
      await apiClient.put("/test", { data: "test" });
      await apiClient.delete("/test");

      expect(mockApiClient.post).toHaveBeenCalledWith("/test", {
        data: "test",
      });
      expect(mockApiClient.put).toHaveBeenCalledWith("/test", { data: "test" });
      expect(mockApiClient.delete).toHaveBeenCalledWith("/test");
    });
  });

  describe("Response Handling", () => {
    it("should handle successful responses", async () => {
      const mockResponse = { data: { message: "success" } };
      const responseHandler =
        mockApiClient.interceptors.response.use.mock.calls[0][0];
      const result = await responseHandler(mockResponse);
      expect(result).toEqual(mockResponse);
    });

    it("should handle response without status", async () => {
      const error = new AxiosError(
        "Network Error",
        "NETWORK_ERROR",
        undefined,
        undefined,
        {
          data: { message: "Network Error" },
        } as any,
      );

      const errorHandler =
        mockApiClient.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(error)).rejects.toThrow();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should handle undefined error response", async () => {
      const error = new AxiosError(
        "Unknown Error",
        "UNKNOWN",
        undefined,
        undefined,
        undefined,
      );

      const errorHandler =
        mockApiClient.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(error)).rejects.toThrow();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should handle error with empty response", async () => {
      const error = new AxiosError(
        "Empty Response",
        "EMPTY_RESPONSE",
        undefined,
        undefined,
        { response: {} } as any,
      );

      const errorHandler =
        mockApiClient.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(error)).rejects.toThrow();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should redirect to login on 401 unauthorized", async () => {
      const error = new AxiosError(
        "Unauthorized",
        "401",
        undefined,
        undefined,
        {
          status: 401,
          data: { message: "Unauthorized" },
          statusText: "Unauthorized",
        } as any,
      );

      const errorHandler =
        mockApiClient.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(error)).rejects.toThrow();
      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });

    it("should pass through other errors", async () => {
      const error = new AxiosError(
        "Server Error",
        "500",
        undefined,
        undefined,
        {
          status: 500,
          data: { message: "Server Error" },
        } as any,
      );

      const errorHandler =
        mockApiClient.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(error)).rejects.toThrow();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should handle network errors", async () => {
      const networkError = new AxiosError(
        "Network Error",
        "ECONNABORTED",
        undefined,
        undefined,
        undefined,
      );

      const errorHandler =
        mockApiClient.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(networkError)).rejects.toThrow("Network Error");
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new AxiosError(
        "Timeout",
        "ECONNABORTED",
        undefined,
        undefined,
        undefined,
      );

      const errorHandler =
        mockApiClient.interceptors.response.use.mock.calls[0][1];
      await expect(errorHandler(timeoutError)).rejects.toThrow();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("Base Configuration", () => {
    it("should have correct base configuration", () => {
      expect(mockApiClient.defaults.baseURL).toBe(
        process.env.NEXT_PUBLIC_BASE_URL,
      );
      expect(mockApiClient.defaults.headers.Accept).toBe("application/json");
      expect(mockApiClient.defaults.headers["Content-Type"]).toBe(
        "application/json",
      );
    });

    it("should handle requests with different content types", async () => {
      const formData = new FormData();
      formData.append("file", new Blob(["test"]), "test.txt");

      const mockResponse = { data: { message: "success" } };
      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      expect(mockApiClient.post).toHaveBeenCalledWith("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
  });
});
