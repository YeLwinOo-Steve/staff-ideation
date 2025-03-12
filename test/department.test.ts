import { departmentApi } from "@/api/repository";
import { mockDepartment } from "../test/mockData";
import { mockApiClient } from "../test/mockApiClient";

jest.mock("@/api/repository", () => ({
  departmentApi: {
    getAll: () => mockApiClient.get("/departments"),
    create: (data: any) => mockApiClient.post("/departments", data),
  },
}));

describe("Department API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all departments successfully", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [mockDepartment] });

      const response = await departmentApi.getAll();

      expect(response.data).toEqual([mockDepartment]);
      expect(mockApiClient.get).toHaveBeenCalledWith("/departments");
    });

    it("should handle error when fetching departments fails", async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(departmentApi.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("create", () => {
    const newDepartment = {
      department_name: "New Department",
      QACoordinatorID: 2,
    };

    it("should create department successfully", async () => {
      mockApiClient.post.mockResolvedValueOnce({
        data: { ...newDepartment, id: 2 },
      });

      const response = await departmentApi.create(newDepartment);

      expect(response.data).toHaveProperty("id", 2);
      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/departments",
        newDepartment,
      );
    });
  });
});
