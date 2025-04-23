import apiClient from "@/api/apiClient";
import {
  Department,
  User,
  Idea,
  Category,
  SystemSetting,
  Comment,
  Vote,
  PaginatedResponse,
  Role,
  UserLog,
  Report,
  ReportedIdea,
  ReportDetail,
  ReportedUser,
  HiddenIdea,
  BannedUser,
  ActiveUser,
  DepartmentReport,
  AnonymousIdea,
  AnonymousComment,
} from "@/api/models";

export const departmentApi = {
  getAll: () => apiClient.get<{ data: Department[] }>("/departments"),
  getOne: (id: number) => apiClient.get<Department>(`/departments/${id}`),
  getDepartmentUsers: (id: number) =>
    apiClient.get<{ data: User[] }>(`/departments/users/${id}`),
  create: (data: Partial<Department>) =>
    apiClient.post<Department>("/departments", data),
  update: (id: number, data: Partial<Department>) =>
    apiClient.put<Department>(`/departments/${id}`, data),
  delete: (id: number) => apiClient.delete(`/departments/${id}`),
};

export const roleApi = {
  getAll: () => apiClient.get<Role[]>("/roles"),
};

export const userApi = {
  getAll: (page: number = 1) =>
    apiClient.get<PaginatedResponse<User>>(`/users?page=${page}`),
  getOne: (id: number) => apiClient.get<{ data: User }>(`/users/${id}`),
  create: (data: FormData) => apiClient.post<User>("/users", data),
  update: (id: number, data: FormData) =>
    apiClient.put<User>(`/users/${id}`, data),
};

export const ideaApi = {
  getAll: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<Idea>>("/idea", { params }),
  getOne: (id: number) => apiClient.get<{ data: Idea }>(`/idea/${id}`),
  create: (data: FormData) => apiClient.post<Idea>("/idea", data),
  update: (id: number, data: FormData) =>
    apiClient.put<Idea>(`/idea/${id}`, data),
  delete: (id: number) => apiClient.delete(`/idea/${id}`),
  submit: (id: number) =>
    apiClient.put<Idea>(`/idea/submit/${id}`, { is_enabled: 1 }),
  updateCategory: (id: number, categories: string) =>
    apiClient.put(`/update-idea-category/${id}`, { category: categories }),
  getToSubmit: (page = 1) =>
    apiClient.get<PaginatedResponse<Idea>>("/idea/to-submit", {
      params: { page },
    }),
};

export const categoryApi = {
  getAll: () => apiClient.get<{ data: Category[] }>("/categories"),
  getOne: (id: number) => apiClient.get<Category>(`/categories/${id}`),
  create: (data: { name: string }) =>
    apiClient.post<Category>("/categories", data),
  update: (id: number, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, data),
  delete: (id: number) => apiClient.delete(`/categories/${id}`),
};

export const systemSettingApi = {
  getAll: () => apiClient.get<{ data: SystemSetting[] }>("/system-setting"),
  create: (data: Partial<SystemSetting>) =>
    apiClient.post<SystemSetting>("/system-setting", data),
  update: (id: number, data: Partial<SystemSetting>) =>
    apiClient.put<SystemSetting>(`/system-setting/${id}`, data),
  delete: (id: number) => apiClient.delete(`/system-setting/${id}`),
  getCSV: (id: number) => apiClient.get<string>(`/system-setting/getCSV/${id}`),
};

export const commentApi = {
  getCommentsForIdea: (id: number) =>
    apiClient.get<{ data: Comment[] }>(`/idea/get-comment/${id}`),
  create: (data: FormData) => apiClient.post<Comment>("/comments", data),
  update: (id: number, data: Partial<Comment>) =>
    apiClient.put<Comment>(`/comments/${id}`, data),
  delete: (id: number) => apiClient.delete(`/comments/${id}`),
};

export const voteApi = {
  getAll: () => apiClient.get<Vote[]>("/votes"),
  create: (data: Partial<Vote>) => apiClient.post<Vote>("/votes", data),
  update: (id: number, data: Partial<Vote>) =>
    apiClient.put<Vote>(`/votes/${id}`, data),
  delete: (id: number) => apiClient.delete(`/votes/${id}`),
};

export const userLogApi = {
  getUserLogs: (id: number, page: number = 1) =>
    apiClient.get<PaginatedResponse<UserLog>>(`/user-log/${id}`, {
      params: { page },
    }),
};

export const reportApi = {
  reportIdea: (data: FormData) =>
    apiClient.post<{ message: string; data: Report }>("/report", data),

  getReportedIdeas: (page: number = 1) =>
    apiClient.get<PaginatedResponse<ReportedIdea>>("/report/ideas", {
      params: { page },
    }),

  getReportDetails: (ideaId: number) =>
    apiClient.get<ReportDetail[]>(`/report/ideas/${ideaId}`),

  getReportedUsers: () => apiClient.get<ReportedUser[]>("/report/user"),

  getUserReportedIdeas: (userId: number) =>
    apiClient.get<{ data: ReportedIdea[] }>(`/report/user/${userId}`),
};

export const hideApi = {
  hideIdea: (id: number, hide: number) =>
    apiClient.put<{ message: string }>(`/hide/${id}`, { hide }),

  getHiddenIdeas: () =>
    apiClient.get<PaginatedResponse<HiddenIdea>>("/get-hide-ideas"),

  hideUserIdeas: (userId: number, hide: number) =>
    apiClient.put<{ message: string }>(`/user/hide/${userId}`, { hide }),

  getHiddenUsers: () =>
    apiClient.get<PaginatedResponse<HiddenIdea>>("/get-hide-ideas-user"),
};

export const permissionApi = {
  removeIdeaPermissions: (userId: number) =>
    apiClient.put<{ message: string }>(`/remove-idea-permissions/${userId}`),

  giveIdeaPermissions: (userId: number) =>
    apiClient.put<{ message: string }>(`/give-idea-permissions/${userId}`),

  getBannedUsers: () =>
    apiClient.get<PaginatedResponse<BannedUser>>("/banUser"),
};

export const reportingApi = {
  getActiveUsers: () =>
    apiClient.get<PaginatedResponse<ActiveUser>>("/active-users"),

  getDepartmentReport: () =>
    apiClient.get<DepartmentReport[]>("/department-report"),

  getAnonymousIdeas: () =>
    apiClient.get<PaginatedResponse<AnonymousIdea>>("/anonymous-ideas"),

  getAnonymousComments: () =>
    apiClient.get<PaginatedResponse<AnonymousComment>>("/anonymous-comments"),
};
