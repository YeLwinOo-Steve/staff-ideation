export interface Department {
  id: number;
  department_name: string;
  qa_coordinator_name: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  permission: string;
}

export interface Role {
  id: number;
  role: string;
  permissions: Permission[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  photo?: string;
  department: string | null;
  roles: string[];
  permissions: string[];
}

export interface Idea {
  id: number;
  title: string;
  content: string;
  is_anonymous: boolean;
  category: string[];
  document?: string[];
  is_enabled?: boolean;
  isPending?: boolean;
  user_name?: string;
  user_email?: string;
  user_photo?: string;
  department?: string[] | null;
  files?: Document[];
  comments?: number;
  total_vote_value?: number;
  user_vote_value?: number;
  time?: string;
  system_setting_id: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id?: number;
  idea_id?: number;
  file_name: string;
  file_path: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: number;
  idea_closure_date: string;
  final_closure_date: string;
  academic_year: string;
  status: number;
  total_ideas?: number;
}

export interface Comment {
  id: number;
  user_id: number;
  idea_id: number;
  comment: string;
  is_anonymous: boolean;
  is_enabled: number;
  system_setting_id: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_photo: string;
  department: string | null;
}

export interface Vote {
  id: number;
  user_id: number;
  idea_id: number;
  vote_value: number;
}

export interface UserLog {
  user: string;
  email: string;
  photo: string | null;
  type: "system_setting" | "idea" | "category" | "department" | "user";
  action: "create" | "update" | "delete" | "submit";
  activity: string;
  time: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}
