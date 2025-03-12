export interface Department {
  id: number;
  department_name: string;
  QACoordinatorID: number;
}

export interface User {
  id: number;
  role_id: number;
  permissions_id: string;
  name: string;
  email: string;
  department_id: number;
  photo?: string;
}

export interface Idea {
  id: number;
  title: string;
  content: string;
  is_anonymous: boolean;
  category: number;
  document?: Document[];
  is_enabled?: boolean;
}

export interface Document {
  file_name: string;
  file_path: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface SystemSetting {
  id: number;
  idea_closure_date: string;
  final_closure_date: string;
  academic_year: string;
  status: boolean;
}

export interface Comment {
  id: number;
  user_id: number;
  idea_id: number;
  comment: string;
  is_anonymous: boolean;
}

export interface Vote {
  id: number;
  user_id: number;
  idea_id: number;
  vote_value: number;
}
