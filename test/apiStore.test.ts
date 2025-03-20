import { useApiStore } from "@/store/apiStore";
import {
  mockDepartment,
  mockIdea,
  mockCategory,
  mockSystemSetting,
} from "./mockData";

// Mock the entire repository
jest.mock("@/api/repository", () => ({
  departmentApi: {
    getAll: () => Promise.resolve({ data: [mockDepartment] }),
    create: () => Promise.resolve({ data: mockDepartment }),
  },
  ideaApi: {
    getAll: () => Promise.resolve({ data: [mockIdea] }),
    create: () => Promise.resolve({ data: mockIdea }),
    submit: () => Promise.resolve({ data: { ...mockIdea, is_enabled: true } }),
  },
  categoryApi: {
    getAll: () => Promise.resolve({ data: [mockCategory] }),
    create: () => Promise.resolve({ data: mockCategory }),
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

    it("should create department and refresh list", async () => {
      const newDepartment = { department_name: "New Dept", QACoordinatorID: 2 };
      await useApiStore.getState().createDepartment(newDepartment);
      expect(useApiStore.getState().departments).toEqual([mockDepartment]);
      expect(useApiStore.getState().isLoading).toBe(false);
    });
  });

  describe("Ideas", () => {
    it("should fetch ideas with params", async () => {
      const params = { department: "1", latest: "true" };
      await useApiStore.getState().fetchIdeas(params);
      expect(useApiStore.getState().ideas).toEqual([mockIdea]);
    });

    it("should create idea and refresh list", async () => {
      const formData = new FormData();
      await useApiStore.getState().createIdea(formData);
      expect(useApiStore.getState().ideas).toEqual([mockIdea]);
    });

    it("should submit idea and refresh list", async () => {
      await useApiStore.getState().submitIdea(1);
      expect(useApiStore.getState().ideas).toEqual([mockIdea]);
    });
  });

  describe("Categories", () => {
    it("should fetch categories", async () => {
      await useApiStore.getState().fetchCategories();
      expect(useApiStore.getState().categories).toEqual([mockCategory]);
    });

    it("should create category and refresh list", async () => {
      await useApiStore.getState().createCategory("New Category");
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
