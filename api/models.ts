export interface Department {
  id: number;
  department_name: string;
  qa_coordinator_name: string;
  created_at: string;
  updated_at: string;
  QACoordinatorID: number | null;
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

export interface Report {
  id: number;
  idea_id: string;
  reason: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ReportedIdea {
  id: number;
  user_id: number;
  title: string;
  content: string;
  user_name: string;
  photo: string;
  department: string;
  no_of_report: number;
  hidden: number;
}

export interface ReportDetail {
  reason: string;
  user_name: string;
  user_photo: string;
  user_department: string;
}

export interface ReportedUser {
  name: string;
  photo: string;
  email: string;
  department: string;
  hidden: number;
  no_of_reports: number;
  banned: boolean;
}

export interface HiddenIdea extends Idea {
  hidden: number;
}

export interface BannedUser extends User {
  hidden: number;
  email_verified_at: string;
  department_id: number | null;
}

export interface ActiveUser {
  id: number;
  name: string;
  photo: string;
  email: string;
  department_id: number | null;
  email_verified_at: string | null;
  hidden: number;
  created_at: string | null;
  updated_at: string;
  ideas_count: number;
  comments_count: number;
  total_activity: number;
}

export interface DepartmentReport {
  department_name: string;
  total_ideas: number;
  total_comments: number;
  total_users: number;
}

export interface AnonymousIdea {
  id: number;
  title: string;
  content: string;
  created_at: string;
  department: string | null;
}

export interface AnonymousComment {
  id: number;
  comment: string;
  created_at: string;
  idea_title: string;
  department: string | null;
}

export interface LoginActivity {
  id: number;
  user_id: number;
  browser: string;
  ip_address: string;
  created_at: string;
  updated_at: string;
}
