import { create } from "zustand";
import { Department, User, Idea, Category, SystemSetting } from "@/api/models";
import * as api from "@/api/repository";

interface ApiState {
  departments: Department[];
  users: User[];
  ideas: Idea[];
  categories: Category[];
  systemSettings: SystemSetting[];
  isLoading: boolean;
  error: string | null;

  // Departments
  fetchDepartments: () => Promise<void>;
  createDepartment: (data: Partial<Department>) => Promise<void>;

  // Ideas
  fetchIdeas: (params?: Record<string, string>) => Promise<void>;
  createIdea: (data: FormData) => Promise<void>;
  submitIdea: (id: number) => Promise<void>;

  // Categories
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;

  // System Settings
  fetchSystemSettings: () => Promise<void>;
  updateSystemSetting: (
    id: number,
    data: Partial<SystemSetting>,
  ) => Promise<void>;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useApiStore = create<ApiState>((set, get) => ({
  departments: [],
  users: [],
  ideas: [],
  categories: [],
  systemSettings: [],
  isLoading: false,
  error: null,

  fetchDepartments: async () => {
    try {
      set({ isLoading: true });
      const response = await api.departmentApi.getAll();
      set({ departments: response.data });
    } catch (error) {
      const message = "Failed to fetch departments";
      set({ error: message });
      
    } finally {
      set({ isLoading: false });
    }
  },

  createDepartment: async (data) => {
    try {
      set({ isLoading: true });
      await api.departmentApi.create(data);
      get().fetchDepartments();
    } catch (error) {
      const message = "Failed to create department";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchIdeas: async (params) => {
    try {
      set({ isLoading: true });
      const response = await api.ideaApi.getAll(params);
      set({ ideas: response.data });
    } catch (error) {
      set({ error: "Failed to fetch ideas" });
    } finally {
      set({ isLoading: false });
    }
  },

  createIdea: async (data) => {
    try {
      set({ isLoading: true });
      await api.ideaApi.create(data);
      get().fetchIdeas();
    } catch (error) {
      const message = "Failed to create idea";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  submitIdea: async (id) => {
    try {
      set({ isLoading: true });
      await api.ideaApi.submit(id);
      get().fetchIdeas();
    } catch (error) {
      const message = "Failed to submit idea";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await api.categoryApi.getAll();
      set({ categories: response.data });
    } catch (error) {
      set({ error: "Failed to fetch categories" });
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (name) => {
    try {
      set({ isLoading: true });
      await api.categoryApi.create({ name });
      get().fetchCategories();
    } catch (error) {
      const message = "Failed to create category";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSystemSettings: async () => {
    try {
      set({ isLoading: true });
      const response = await api.systemSettingApi.getAll();
      set({ systemSettings: response.data });
    } catch (error) {
      const message = "Failed to fetch system settings";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSystemSetting: async (id, data) => {
    try {
      set({ isLoading: true });
      await api.systemSettingApi.update(id, data);
      get().fetchSystemSettings();
    } catch (error) {
      const message = "Failed to update system setting";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error) => {
    set({ error });
  },
  clearError: () => set({ error: null }),
}));
