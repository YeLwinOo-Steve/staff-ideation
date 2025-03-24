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
} from "@/api/models";

export const departmentApi = {
  getAll: () => apiClient.get<{ data: Department[] }>("/departments"),
  getOne: (id: number) => apiClient.get<Department>(`/departments/${id}`),
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
  getToSubmit: () => apiClient.get<Idea[]>("/idea/to-submit"),
};

export const categoryApi = {
  getAll: () => apiClient.get<Category[]>("/categories"),
  getOne: (id: number) => apiClient.get<Category>(`/categories/${id}`),
  create: (data: { name: string }) =>
    apiClient.post<Category>("/categories", data),
  update: (id: number, data: { name: string }) =>
    apiClient.put<Category>(`/categories/${id}`, data),
  delete: (id: number) => apiClient.delete(`/categories/${id}`),
};

export const systemSettingApi = {
  getAll: () => apiClient.get<SystemSetting[]>("/system-setting"),
  create: (data: Partial<SystemSetting>) =>
    apiClient.post<SystemSetting>("/system-setting", data),
  update: (id: number, data: Partial<SystemSetting>) =>
    apiClient.put<SystemSetting>(`/system-setting/${id}`, data),
  delete: (id: number) => apiClient.delete(`/system-setting/${id}`),
};

export const commentApi = {
  getCommentsForIdea: (id: number) =>
    apiClient.get<{ data: Comment[] }>(`/idea/get-comment/${id}`),
  create: (data: Partial<Comment>) =>
    apiClient.post<Comment>("/comments", data),
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
