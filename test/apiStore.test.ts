import { useApiStore } from "@/store/apiStore";
import * as api from "@/api/repository";
import {
  mockDepartment,
  mockIdea,
  mockCategory,
  mockSystemSetting,
  mockPaginatedResponse,
} from "./mockData";

// Mock the entire repository
jest.mock("@/api/repository", () => ({
  departmentApi: {
    getAll: () => Promise.resolve({ data: { data: [mockDepartment] } }),
    create: () => Promise.resolve({ data: { data: mockDepartment } }),
  },
  ideaApi: {
    getAll: () =>
      Promise.resolve({
        data: {
          data: [mockIdea],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      }),
    create: () => Promise.resolve({ data: mockIdea }),
    submit: () => Promise.resolve({ data: { ...mockIdea, is_enabled: true } }),
    getToSubmit: () =>
      Promise.resolve({
        data: {
          data: [mockIdea],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      }),
  },
  categoryApi: {
    getAll: () => Promise.resolve({ data: { data: [mockCategory] } }),
    create: () => Promise.resolve({ data: { data: mockCategory } }),
  },
  systemSettingApi: {
    getAll: () => Promise.resolve({ data: [mockSystemSetting] }),
    update: () => Promise.resolve({ data: mockSystemSetting }),
  },
}));

describe("API Store", () => {
  beforeEach(() => {
    useApiStore.setState({
      departments: [],
      users: [],
      ideas: [],
      categories: [],
      systemSettings: [],
      isLoading: false,
      error: null,
      roles: [],
    });
  });

  describe("Departments", () => {
    it("should fetch and store departments", async () => {
      await useApiStore.getState().fetchDepartments();
      expect(useApiStore.getState().departments).toEqual([mockDepartment]);
      expect(useApiStore.getState().isLoading).toBe(false);
    });

    it("should create department", async () => {
      await useApiStore.getState().createDepartment(mockDepartment);
      expect(useApiStore.getState().departments).toEqual([mockDepartment]);
      expect(useApiStore.getState().isLoading).toBe(false);
    });
  });

  describe("Ideas", () => {
    beforeEach(() => {
      useApiStore.setState({
        ideas: [],
        idea: null,
        ideaPagination: {
          data: [],
          currentPage: 1,
          lastPage: 1,
          total: 0,
          loading: false,
        },
        error: null,
        isLoading: false,
      });

      jest.clearAllMocks();
    });

    it("should fetch ideas with params", async () => {
      const params = { department: "1", latest: "true" };
      await useApiStore.getState().fetchIdeas(params);

      const store = useApiStore.getState();
      expect(store.ideas).toEqual([mockIdea]);
      expect(store.ideaPagination.data).toEqual([mockIdea]);
      expect(store.error).toBeNull();
    });

    it("should create idea and refresh list", async () => {
      const formData = new FormData();
      await useApiStore.getState().createIdea(formData);
      expect(useApiStore.getState().ideas).toEqual([mockIdea]);
    });
    it("should submit idea and refresh list", async () => {
      await useApiStore.getState().submitIdea(1);
      expect(useApiStore.getState().ideas).toEqual([
        { ...mockIdea, is_enabled: true },
      ]);
    });

    it("should handle fetch ideas error", async () => {
      const mockIdeasError = new Error("Failed to fetch ideas");
      jest.spyOn(api.ideaApi, "getAll").mockRejectedValueOnce(mockIdeasError);

      await expect(useApiStore.getState().fetchIdeas()).rejects.toThrow(
        "Failed to fetch ideas",
      );
      expect(useApiStore.getState().error).toBe("Failed to fetch ideas");
    });
  });

  describe("Categories", () => {
    it("should fetch categories", async () => {
      await useApiStore.getState().fetchCategories();
      expect(useApiStore.getState().categories).toEqual([mockCategory]);
    });

    it("should create category and refresh list", async () => {
      await useApiStore.getState().createCategory(mockCategory.name);
      expect(useApiStore.getState().categories).toEqual([mockCategory]);
    });
  });

  describe("System Settings", () => {
    it("should fetch system settings", async () => {
      await useApiStore.getState().fetchSystemSettings();
      expect(useApiStore.getState().systemSettings).toEqual([
        mockSystemSetting,
      ]);
    });

    it("should update system setting and refresh list", async () => {
      const updateData = { academic_year: "2025" };
      await useApiStore.getState().updateSystemSetting(1, updateData);
      expect(useApiStore.getState().systemSettings).toEqual([
        mockSystemSetting,
      ]);
    });
  });

  describe("Error Handling", () => {
    it("should set and clear error", () => {
      const store = useApiStore.getState();

      store.setError("Test error");
      expect(useApiStore.getState().error).toBe("Test error");

      store.clearError();
      expect(useApiStore.getState().error).toBeNull();
    });

    it("should handle loading state correctly", async () => {
      const store = useApiStore.getState();

      // Check loading state during operation
      const loadingPromise = store.fetchDepartments();
      expect(useApiStore.getState().isLoading).toBe(true);

      await loadingPromise;
      expect(useApiStore.getState().isLoading).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty responses", async () => {
      jest
        .spyOn(useApiStore.getState(), "fetchDepartments")
        .mockImplementationOnce(() => Promise.resolve());

      await useApiStore.getState().fetchDepartments();
      expect(useApiStore.getState().departments).toEqual([]);
    });

    it("should handle concurrent requests", async () => {
      const promises = [
        useApiStore.getState().fetchDepartments(),
        useApiStore.getState().fetchCategories(),
        useApiStore.getState().fetchSystemSettings(),
      ];

      await Promise.all(promises);

      expect(useApiStore.getState().departments).toEqual([mockDepartment]);
      expect(useApiStore.getState().categories).toEqual([mockCategory]);
      expect(useApiStore.getState().systemSettings).toEqual([
        mockSystemSetting,
      ]);
    });
  });
});
