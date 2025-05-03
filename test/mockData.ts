import {
  Department,
  User,
  Idea,
  Category,
  SystemSetting,
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

export const mockDepartment: Department = {
  id: 1,
  department_name: "Engineering",
  qa_coordinator_name: "John Doe",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  QACoordinatorID: 1,
};

export const mockUser: User = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  roles: ["staff"],
  permissions: ["create_idea", "view_idea"],
  department: "Engineering",
};

export const mockIdea: Idea = {
  id: 1,
  title: "Test Idea",
  content: "Test Content",
  is_anonymous: false,
  category: ["Innovation"],
  system_setting_id: 1,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

export const mockCategory: Category = {
  id: 1,
  name: "Innovation",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

export const mockSystemSetting: SystemSetting = {
  id: 1,
  idea_closure_date: "2024-12-31",
  final_closure_date: "2025-01-31",
  academic_year: "2024",
  status: 1,
};

export const mockComment: Comment = {
  id: 1,
  user_id: 1,
  idea_id: 1,
  comment: "Test Comment",
  is_anonymous: false,
  is_enabled: 1,
  system_setting_id: 1,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  user_name: "Test User",
  user_photo: "photo.jpg",
  department: "Engineering",
};

export const mockUserLog: UserLog = {
  user: "Test User",
  email: "test@example.com",
  photo: "photo.jpg",
  type: "idea",
  action: "create",
  activity: "Created a new idea",
  time: "2024-01-01",
};

export const mockReportedIdea: ReportedIdea = {
  id: 1,
  user_id: 1,
  title: "Reported Idea",
  content: "Reported Content",
  user_name: "Test User",
  photo: "photo.jpg",
  department: "Engineering",
  no_of_report: 1,
  hidden: 0,
};

export const mockReportDetail: ReportDetail = {
  reason: "Inappropriate content",
  user_name: "Reporter",
  user_photo: "photo.jpg",
  user_department: "Engineering",
};

export const mockReportedUser: ReportedUser = {
  name: "Reported User",
  photo: "photo.jpg",
  email: "reported@example.com",
  department: "Engineering",
  hidden: 0,
  no_of_reports: 1,
  banned: false,
};

export const mockHiddenIdea: HiddenIdea = {
  ...mockIdea,
  hidden: 1,
};

export const mockBannedUser: BannedUser = {
  ...mockUser,
  hidden: 1,
  email_verified_at: "2024-01-01",
  department_id: 1,
};

export const mockActiveUser: ActiveUser = {
  id: 1,
  name: "Active User",
  photo: "photo.jpg",
  email: "active@example.com",
  department_id: 1,
  email_verified_at: "2024-01-01",
  hidden: 0,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  ideas_count: 5,
  comments_count: 10,
  total_activity: 15,
};

export const mockDepartmentReport: DepartmentReport = {
  ...mockDepartment,
  qa_coordinator: "John Doe",
  total_ideas: 10,
  total_comments: 20,
  total_user: 5,
  ideas_percentage: 50,
  contributors: 3,
  total_activity: 30,
};

export const mockAnonymousIdea: AnonymousIdea = {
  id: 1,
  title: "Anonymous Idea",
  content: "Anonymous Content",
  created_at: "2024-01-01",
  department: "Engineering",
};

export const mockAnonymousComment: AnonymousComment = {
  id: 1,
  comment: "Anonymous Comment",
  created_at: "2024-01-01",
  idea_title: "Test Idea",
  department: "Engineering",
};

export const mockLoginActivity: LoginActivity = {
  id: 1,
  user_id: 1,
  browser: "Chrome",
  ip_address: "127.0.0.1",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

export const mockPaginatedResponse = {
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    total: 0,
  },
};
