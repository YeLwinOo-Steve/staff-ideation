import apiClient from "@/api/apiClient";

const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock("@/api/apiClient", () => mockApiClient);

export { mockApiClient };
