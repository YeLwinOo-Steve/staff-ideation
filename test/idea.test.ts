import { ideaApi } from "@/api/repository";
import { mockIdea } from "../test/mockData";
import { mockApiClient } from "../test/mockApiClient";

jest.mock("@/api/repository", () => ({
  ideaApi: {
    getAll: (params?: any) => mockApiClient.get("/idea", { params }),
    submit: (id: number) =>
      mockApiClient.put(`/idea/submit/${id}`, { is_enabled: 1 }),
  },
}));

describe("Idea API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all ideas successfully", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [mockIdea] });

      const response = await ideaApi.getAll();

      expect(response.data).toEqual([mockIdea]);
    });

    it("should fetch ideas with filters", async () => {
      const params = { department: "1", latest: "true" };
      mockApiClient.get.mockResolvedValueOnce({ data: [mockIdea] });

      await ideaApi.getAll(params);

      expect(mockApiClient.get).toHaveBeenCalledWith("/idea", { params });
    });
  });

  describe("submit", () => {
    it("should submit idea successfully", async () => {
      mockApiClient.put.mockResolvedValueOnce({
        data: { ...mockIdea, is_enabled: true },
      });

      const response = await ideaApi.submit(1);

      expect(response.data.is_enabled).toBe(true);
      expect(mockApiClient.put).toHaveBeenCalledWith("/idea/submit/1", {
        is_enabled: 1,
      });
    });
  });
});
