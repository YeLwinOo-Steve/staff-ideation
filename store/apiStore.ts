import { create } from "zustand";
import {
  Department,
  User,
  Idea,
  Category,
  SystemSetting,
  Role,
  Comment,
} from "@/api/models";
import * as api from "@/api/repository";
import { PaginatedResponse } from "@/api/models";

interface ApiState {
  departments: Department[];
  departmentUsers: User[];
  users: User[];
  user: User | null;
  ideas: Idea[];
  idea: Idea | null;
  categories: Category[];
  systemSettings: SystemSetting[];
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  roles: Role[];
  ideaPagination: {
    data: Idea[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };
  userPagination: {
    data: User[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };

  // Roles
  fetchRoles: () => Promise<void>;
  // Departments
  fetchDepartments: () => Promise<void>;
  getDepartmentUsers: (id: number) => Promise<void>;
  createDepartment: (data: Partial<Department>) => Promise<void>;
  updateDepartment: (id: number, data: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;

  // Users
  fetchUsers: (page?: number) => Promise<void>;
  getUser: (id: number) => Promise<User | null>;
  createUser: (data: FormData) => Promise<void>;
  updateUser: (id: number, data: FormData) => Promise<void>;

  // Ideas
  fetchIdeas: (params?: Record<string, string>) => Promise<void>;
  createIdea: (data: FormData) => Promise<void>;
  submitIdea: (id: number) => Promise<void>;
  getIdea: (id: number) => Promise<void | null>;

  // Comments
  getCommentsForIdea: (id: number) => Promise<void>;

  // Categories
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;

  // System Settings
  fetchSystemSettings: () => Promise<void>;
  updateSystemSetting: (
    id: number,
    data: Partial<SystemSetting>
  ) => Promise<void>;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useApiStore = create<ApiState>((set, get) => ({
  departments: [],
  departmentUsers: [],
  users: [],
  user: null,
  ideas: [],
  idea: null,
  categories: [],
  comments: [],
  systemSettings: [],
  isLoading: false,
  error: null,
  roles: [],
  ideaPagination: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },
  userPagination: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },

  fetchDepartments: async () => {
    if (get().departments.length > 0) return;

    try {
      set({ isLoading: true });
      const response = await api.departmentApi.getAll();
      set({ departments: response.data.data });
    } catch (error) {
      const message = "Failed to fetch departments";
      set({ error: message });
      throw error;
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
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getDepartmentUsers: async (id: number) => {
    try {
      set({ isLoading: true });
      const response = await api.departmentApi.getDepartmentUsers(id);
      set({ departmentUsers: response.data.data });
    } catch (error) {
      const message = "Failed to get department users";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  updateDepartment: async (id, data) => {
    try {
      set({ isLoading: true });
      await api.departmentApi.update(id, data);
      get().fetchDepartments();
    } catch (error) {
      const message = "Failed to update department";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDepartment: async (id) => {
    try {
      set({ isLoading: true });
      await api.departmentApi.delete(id);
      get().fetchDepartments();
    } catch (error) {
      const message = "Failed to delete department";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsers: async (page = 1) => {
    try {
      set((state) => ({
        ...state,
        userPagination: {
          ...state.userPagination,
          loading: true,
        },
      }));

      const response = await api.userApi.getAll(page);

      set((state) => ({
        ...state,
        users: response.data.data,
        userPagination: {
          data: response.data.data,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = "Failed to fetch users";
      set({ error: message });
      throw error;
    } finally {
      set((state) => ({
        ...state,
        userPagination: {
          ...state.userPagination,
          loading: false,
        },
      }));
    }
  },

  getUser: async (id) => {
    try {
      set({ isLoading: true });
      const response = await api.userApi.getOne(id);
      set({ user: response.data.data });
      return response.data.data;
    } catch (error) {
      const message = "Failed to get user details";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createUser: async (data) => {
    try {
      set({ isLoading: true });
      await api.userApi.create(data);
      await get().fetchUsers();
    } catch (error) {
      const message = "Failed to create user";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (id, data) => {
    try {
      set({ isLoading: true });
      await api.userApi.update(id, data);
      await get().fetchUsers();
    } catch (error) {
      const message = "Failed to update user";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRoles: async () => {
    if (get().roles.length > 0) return;
    try {
      set({ isLoading: true });
      const response = await api.roleApi.getAll();
      set({ roles: response.data });
    } catch (error) {
      const message = "Failed to fetch roles";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchIdeas: async (params) => {
    try {
      set((state) => ({
        ...state,
        ideaPagination: {
          ...state.ideaPagination,
          loading: true,
        },
      }));
      const response = await api.ideaApi.getAll(params);

      set((state) => ({
        ...state,
        ideas: response.data.data,
        ideaPagination: {
          data: response.data.data,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = "Failed to fetch ideas";
      set({ error: message });
      throw error;
    } finally {
      set((state) => ({
        ...state,
        ideaPagination: {
          ...state.ideaPagination,
          loading: false,
        },
      }));
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
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getIdea: async (id) => {
    try {
      set({ isLoading: true });
      const response = await api.ideaApi.getOne(id);
      set({ idea: response.data.data });
    } catch (error) {
      const message = "Failed to get idea";
      set({ error: message });
      throw error;
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
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getCommentsForIdea: async (id) => {
    try {
      set({ isLoading: true });
      const response = await api.commentApi.getCommentsForIdea(id);
      set({ comments: response.data.data });
    } catch (error) {
      const message = "Failed to get comments for idea";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await api.categoryApi.getAll();
      set({ categories: response.data.data });
    } catch (error) {
      const message = "Failed to fetch categories";
      set({ error: message });
      throw error;
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
