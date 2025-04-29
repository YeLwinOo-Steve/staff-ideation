import { create } from "zustand";
import {
  Department,
  User,
  Idea,
  Category,
  SystemSetting,
  Role,
  Comment,
  UserLog,
  ReportedIdea,
  ReportDetail,
  ReportedUser,
  HiddenIdea,
  BannedUser,
  ActiveUser,
  DepartmentReport,
  AnonymousIdea,
  AnonymousComment,
  LoginActivity,
} from "@/api/models";
import * as api from "@/api/repository";
import axios, { AxiosError } from "axios";

// Helper function to extract error message
const handleError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const e = error as AxiosError<{ message: string }>;
    console.log("error response", e.response?.data?.message);
    return e.response?.data?.message || defaultMessage;
  }

  if (error && typeof error === "object" && "message" in error) {
    return error.message as string;
  }

  return defaultMessage;
};

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
  allUsers: User[];
  isLoadingAllUsers: boolean;
  pendingIdeas: Idea[];
  pendingIdeaPagination: {
    data: Idea[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };
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
  userLogPagination: {
    data: UserLog[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };
  updateIdea: (id: number, data: FormData) => Promise<void>;
  updateIdeaCategory: (id: number, categories: string) => Promise<void>;
  fetchRoles: () => Promise<void>;
  // Departments
  fetchDepartments: (options?: { isCache?: boolean }) => Promise<void>;
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
  deleteIdea: (id: number) => Promise<void>;
  getToSubmit: (page?: number) => Promise<void>;

  // Comments
  getCommentsForIdea: (id: number) => Promise<void>;
  createComment: (data: FormData) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;

  // Categories
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  // Votes
  createVote: (ideaId: number, vote: number) => Promise<void>;

  // System Settings
  fetchSystemSettings: () => Promise<void>;
  createSystemSetting: (data: Partial<SystemSetting>) => Promise<void>;
  updateSystemSetting: (
    id: number,
    data: Partial<SystemSetting>
  ) => Promise<void>;
  deleteSystemSetting: (id: number) => Promise<void>;
  getCSV: (id: number) => Promise<Blob | undefined>;

  // User Logs
  fetchUserLogs: (id: number, page: number) => Promise<void>;
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchAllUsers: () => Promise<void>;

  // Report related state
  reportedIdeas: {
    data: ReportedIdea[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };
  reportDetails: ReportDetail[];
  reportedUsers: ReportedUser[];

  // Report related functions
  reportIdea: (data: FormData) => Promise<void>;
  fetchReportedIdeas: (page?: number) => Promise<void>;
  fetchReportDetails: (ideaId: number) => Promise<void>;
  fetchReportedUsers: () => Promise<void>;
  fetchUserReportedIdeas: (userId: number) => Promise<void>;

  // Hidden ideas state
  hiddenIdeas: HiddenIdea[];
  hiddenUsers: {
    data: HiddenIdea[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };

  // Banned users state
  bannedUsers: {
    data: BannedUser[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };

  // Active users state
  activeUsers: ActiveUser[];

  // Department report state
  departmentReport: DepartmentReport[];

  // Anonymous content state
  anonymousIdeas: {
    data: AnonymousIdea[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };
  anonymousComments: {
    data: AnonymousComment[];
    currentPage: number;
    lastPage: number;
    total: number;
    loading: boolean;
  };

  // Hide functions
  hideIdea: (id: number, hide: number) => Promise<void>;
  getHiddenIdeas: () => Promise<void>;
  hideUserIdeas: (userId: number, hide: number) => Promise<void>;
  getHiddenUsers: () => Promise<void>;

  // Permission functions
  removeIdeaPermissions: (userId: number) => Promise<void>;
  giveIdeaPermissions: (userId: number) => Promise<void>;
  getBannedUsers: () => Promise<void>;

  // Reporting functions
  getActiveUsers: () => Promise<void>;
  getDepartmentReport: () => Promise<void>;
  getAnonymousIdeas: () => Promise<void>;
  getAnonymousComments: () => Promise<void>;
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
  allUsers: [],
  activeUsers: [],
  isLoadingAllUsers: false,
  pendingIdeas: [],
  pendingIdeaPagination: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },
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
  userLogPagination: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },

  fetchDepartments: async (options?: { isCache?: boolean }) => {
    const isCache = options?.isCache ?? true;
    if (get().departments.length > 0 && isCache) return;

    try {
      set({ isLoading: true });
      const response = await api.departmentApi.getAll();
      set({ departments: response.data.data });
    } catch (error) {
      const message = handleError(error, "Failed to fetch departments");
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
      await get().fetchDepartments({ isCache: false });
    } catch (error) {
      const message = handleError(error, "Failed to create department");
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
      const message = handleError(error, "Failed to get department users");
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
      await get().fetchDepartments({ isCache: false });
    } catch (error) {
      const message = handleError(error, "Failed to update department");
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
      await get().fetchDepartments({ isCache: false });
    } catch (error) {
      const message = handleError(error, "Failed to delete department");
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
      const message = handleError(error, "Failed to fetch users");
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
      
      // If not the auth user or no auth user, fetch from API
      set({ isLoading: true });
      const response = await api.userApi.getOne(id);
      set({ user: response.data.data });
      return response.data.data;
    } catch (error) {
      const message = handleError(error, "Failed to get user details");
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
      const message = handleError(error, "Failed to create user");
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
      const message = handleError(error, "Failed to update user");
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
      const message = handleError(error, "Failed to fetch roles");
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
      const message = handleError(error, "Failed to fetch ideas");
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
  getToSubmit: async (page = 1) => {
    try {
      set((state) => ({
        ...state,
        pendingIdeaPagination: {
          ...state.pendingIdeaPagination,
          loading: true,
        },
      }));
      const response = await api.ideaApi.getToSubmit(page);
      const pendingIdeas = response.data.data.map((idea) => ({
        ...idea,
        isPending: true,
      }));

      set((state) => ({
        ...state,
        pendingIdeas,
        pendingIdeaPagination: {
          data: pendingIdeas,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = handleError(error, "Failed to get ideas to submit");
      set({ error: message });
      throw error;
    } finally {
      set((state) => ({
        ...state,
        pendingIdeaPagination: {
          ...state.pendingIdeaPagination,
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
      const message = handleError(error, "Failed to create idea");
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
      // Refresh both lists
      get().fetchIdeas();
      get().getToSubmit();
    } catch (error) {
      const message = handleError(error, "Failed to submit idea");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, data) => {
    try {
      set({ isLoading: true });
      await api.categoryApi.update(id, data);
      get().fetchCategories();
    } catch (error) {
      const message = handleError(error, "Failed to update category");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true });
      await api.categoryApi.delete(id);
      get().fetchCategories();
    } catch (error) {
      const message = handleError(error, "Failed to delete category");
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
      const message = handleError(error, "Failed to get idea");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteIdea: async (id) => {
    try {
      set({ isLoading: true });
      await api.ideaApi.delete(id);
      get().fetchIdeas();
    } catch (error) {
      const message = handleError(error, "Failed to delete idea");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getCommentsForIdea: async (id) => {
    try {
      const response = await api.commentApi.getCommentsForIdea(id);
      set({ comments: response.data.data.reverse() });
    } catch (error) {
      const message = handleError(error, "Failed to get comments for idea");
      set({ error: message });
      throw error;
    }
  },

  createComment: async (data) => {
    try {
      await api.commentApi.create(data);
      const ideaId = data.get("idea_id");
      get().getCommentsForIdea(Number(ideaId));
    } catch (error) {
      const message = handleError(error, "Failed to create comment");
      set({ error: message });
      throw error;
    }
  },

  deleteComment: async (id) => {
    try {
      await api.commentApi.delete(id);
    } catch (error) {
      const message = handleError(error, "Failed to delete comment");
      set({ error: message });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await api.categoryApi.getAll();
      set({ categories: response.data.data });
    } catch (error) {
      const message = handleError(error, "Failed to fetch categories");
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
      const message = handleError(error, "Failed to create category");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSystemSettings: async () => {
    try {
      set({ isLoading: true });
      const response = await api.systemSettingApi.getAll();
      set({ systemSettings: response.data.data });
    } catch (error) {
      const message = handleError(error, "Failed to fetch system settings");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createSystemSetting: async (data) => {
    try {
      set({ isLoading: true });
      await api.systemSettingApi.create(data);
      get().fetchSystemSettings();
    } catch (error) {
      const message = handleError(error, "Failed to create system setting");
      set({ error: message });
      throw error;
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
      const message = handleError(error, "Failed to update system setting");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSystemSetting: async (id) => {
    try {
      set({ isLoading: true });
      await api.systemSettingApi.delete(id);
      get().fetchSystemSettings();
    } catch (error) {
      const message = handleError(error, "Failed to delete system setting");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getCSV: async (id) => {
    try {
      const response = await api.systemSettingApi.getCSV(id);
      if (typeof response === "object" && "message" in response) {
        throw new Error(response.message as string);
      }

      return new Blob([response.data], { type: "text/csv" });
    } catch (error) {
      const message = handleError(error, "Failed to get CSV");
      set({ error: message });
      throw error;
    }
  },

  createVote: async (ideaId: number, vote: number) => {
    try {
      await api.voteApi.create({ idea_id: ideaId, vote_value: vote });
      get().getIdea(ideaId);
    } catch (error) {
      const message = handleError(error, "Failed to create vote");
      set({ error: message });
      throw error;
    }
  },

  fetchUserLogs: async (id: number, page = 1) => {
    try {
      set((state) => ({
        ...state,
        userLogPagination: {
          ...state.userLogPagination,
          loading: true,
        },
      }));

      const response = await api.userLogApi.getUserLogs(id, page);

      set((state) => ({
        ...state,
        userLogPagination: {
          data: response.data.data,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = handleError(error, "Failed to fetch user logs");
      set({ error: message });
      throw error;
    } finally {
      set((state) => ({
        ...state,
        userLogPagination: {
          ...state.userLogPagination,
          loading: false,
        },
      }));
    }
  },

  setError: (error) => {
    set({ error });
  },
  clearError: () => set({ error: null }),

  fetchAllUsers: async () => {
    if (get().allUsers.length > 0) return;

    try {
      set({ isLoadingAllUsers: true });
      let allUsers: User[] = [];
      let currentPage = 1;

      const response = await api.userApi.getAll(currentPage);
      allUsers = [...response.data.data];

      const lastPage = response.data.meta.last_page;

      const remainingPages = Array.from(
        { length: lastPage - 1 },
        (_, i) => i + 2
      );
      await Promise.all(
        remainingPages.map(async (page) => {
          const pageResponse = await api.userApi.getAll(page);
          allUsers = [...allUsers, ...pageResponse.data.data];
        })
      );

      set({ allUsers });
    } catch (error) {
      const message = handleError(error, "Failed to fetch all users");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoadingAllUsers: false });
    }
  },

  updateIdea: async (id, data) => {
    try {
      set({ isLoading: true });
      await api.ideaApi.update(id, data);
      await get().getIdea(id);
    } catch (error) {
      const message = handleError(error, "Failed to update idea");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateIdeaCategory: async (id, categories) => {
    try {
      set({ isLoading: true });
      await api.ideaApi.updateCategory(id, categories);
      await get().getIdea(id);
    } catch (error) {
      const message = handleError(error, "Failed to update idea categories");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  reportedIdeas: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },
  reportDetails: [],
  reportedUsers: [],

  reportIdea: async (data) => {
    try {
      set({ isLoading: true });
      await api.reportApi.reportIdea(data);
      // Optionally refresh reported ideas list
      await get().fetchReportedIdeas();
    } catch (error) {
      const message = handleError(error, "Failed to report idea");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReportedIdeas: async (page = 1) => {
    try {
      set((state) => ({
        ...state,
        reportedIdeas: {
          ...state.reportedIdeas,
          loading: true,
        },
      }));

      const response = await api.reportApi.getReportedIdeas(page);

      set((state) => ({
        ...state,
        reportedIdeas: {
          data: response.data.data,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = handleError(error, "Failed to fetch reported ideas");
      set({ error: message });
      throw error;
    } finally {
      set((state) => ({
        ...state,
        reportedIdeas: {
          ...state.reportedIdeas,
          loading: false,
        },
      }));
    }
  },

  fetchReportDetails: async (ideaId) => {
    try {
      set({ isLoading: true });
      const response = await api.reportApi.getReportDetails(ideaId);
      set({ reportDetails: response.data });
    } catch (error) {
      const message = handleError(error, "Failed to fetch report details");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReportedUsers: async () => {
    try {
      set({ isLoading: true });
      const response = await api.reportApi.getReportedUsers();
      set({ reportedUsers: response.data });
    } catch (error) {
      const message = handleError(error, "Failed to fetch reported users");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserReportedIdeas: async (userId) => {
    try {
      set({ isLoading: true });
      const response = await api.reportApi.getUserReportedIdeas(userId);
      set((state) => ({
        ...state,
        reportedIdeas: {
          ...state.reportedIdeas,
          data: response.data.data,
        },
      }));
    } catch (error) {
      const message = handleError(error, "Failed to fetch user reported ideas");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  hiddenIdeas: [],
  hiddenUsers: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },
  bannedUsers: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },
  departmentReport: [],
  anonymousIdeas: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },
  anonymousComments: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    loading: false,
  },

  // Hide functions
  hideIdea: async (id, hide) => {
    try {
      set({ isLoading: true });
      await api.hideApi.hideIdea(id, hide);
      await get().getHiddenIdeas();
    } catch (error) {
      const message = handleError(error, "Failed to hide idea");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getHiddenIdeas: async () => {
    try {
      set({ isLoading: true });
      const response = await api.hideApi.getHiddenIdeas();
      set({ hiddenIdeas: response.data.data });
    } catch (error) {
      const message = handleError(error, "Failed to fetch hidden ideas");
      set({ error: message });
      set({ hiddenIdeas: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  hideUserIdeas: async (userId, hide) => {
    try {
      set({ isLoading: true });
      await api.hideApi.hideUserIdeas(userId, hide);
      await get().getHiddenUsers();
    } catch (error) {
      const message = handleError(error, "Failed to hide user ideas");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getHiddenUsers: async () => {
    try {
      set((state) => ({
        ...state,
        hiddenUsers: { ...state.hiddenUsers, loading: true },
      }));
      const response = await api.hideApi.getHiddenUsers();
      set((state) => ({
        ...state,
        hiddenUsers: {
          data: response.data.data,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = handleError(error, "Failed to fetch hidden users");
      set({ error: message });
      throw error;
    }
  },

  // Permission functions
  removeIdeaPermissions: async (userId) => {
    try {
      set({ isLoading: true });
      await api.permissionApi.removeIdeaPermissions(userId);
      await get().getBannedUsers();
    } catch (error) {
      const message = handleError(error, "Failed to remove idea permissions");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  giveIdeaPermissions: async (userId) => {
    try {
      set({ isLoading: true });
      await api.permissionApi.giveIdeaPermissions(userId);
      await get().getBannedUsers();
    } catch (error) {
      const message = handleError(error, "Failed to give idea permissions");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getBannedUsers: async () => {
    try {
      set((state) => ({
        ...state,
        bannedUsers: { ...state.bannedUsers, loading: true },
      }));
      const response = await api.permissionApi.getBannedUsers();
      set((state) => ({
        ...state,
        bannedUsers: {
          data: response.data.data,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = handleError(error, "Failed to fetch banned users");
      set({ error: message });
      throw error;
    }
  },

  // Reporting functions
  getActiveUsers: async () => {
    try {
      set({ isLoading: true });
      const response = await api.reportingApi.getActiveUsers();
      set({ activeUsers: response.data });
    } catch (error) {
      const message = handleError(error, "Failed to fetch active users");
      set({ error: message });
      set({ activeUsers: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getDepartmentReport: async () => {
    try {
      set({ isLoading: true });
      const response = await api.reportingApi.getDepartmentReport();
      set({ departmentReport: response.data });
    } catch (error) {
      const message = handleError(error, "Failed to fetch department report");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAnonymousIdeas: async () => {
    try {
      set((state) => ({
        ...state,
        anonymousIdeas: { ...state.anonymousIdeas, loading: true },
      }));
      const response = await api.reportingApi.getAnonymousIdeas();
      set((state) => ({
        ...state,
        anonymousIdeas: {
          data: response.data.data,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = handleError(error, "Failed to fetch anonymous ideas");
      set({ error: message });
      throw error;
    }
  },

  getAnonymousComments: async () => {
    try {
      set((state) => ({
        ...state,
        anonymousComments: { ...state.anonymousComments, loading: true },
      }));
      const response = await api.reportingApi.getAnonymousComments();
      set((state) => ({
        ...state,
        anonymousComments: {
          data: response.data.data,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          total: response.data.meta.total,
          loading: false,
        },
      }));
    } catch (error) {
      const message = handleError(error, "Failed to fetch anonymous comments");
      set({ error: message });
      throw error;
    }
  },
}));

interface LoginActivityStore {
  loginActivities: LoginActivity[];
  getUserLoginActivities: (userId: number) => Promise<void>;
}

export const useLoginActivityStore = create<LoginActivityStore>((set) => ({
  loginActivities: [],
  getUserLoginActivities: async (userId: number) => {
    const response = await api.loginActivityApi.getUserLoginActivities(userId);
    set({ loginActivities: response.data });
  },
}));
