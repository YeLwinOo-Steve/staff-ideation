import apiClient from "@/api/apiClient";

const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
      common: {
        Authorization: undefined,
      },
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

jest.mock("@/api/apiClient", () => mockApiClient);

export { mockApiClient };
