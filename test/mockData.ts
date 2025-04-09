export const mockDepartment = {
  id: 1,
  department_name: "Computer Science",
  QACoordinatorID: 1,
};

export const mockUser = {
  id: 1,
  role_id: 2,
  permissions_id: "1,2,3",
  name: "John Doe",
  email: "john@example.com",
  department_id: 1,
  photo: "https://example.com/photo.jpg",
};

export const mockIdea = {
  id: 1,
  title: "Improve Campus WiFi",
  content: "We should upgrade our WiFi infrastructure",
  is_anonymous: false,
  is_enabled: true,
  user_id: 1,
  category: 1,
  document: [
    {
      file_name: "proposal.pdf",
      file_path: "/documents/proposal.pdf",
    },
  ],
};

export const mockPaginatedResponse = {
  data: {
    data: [mockIdea],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 1,
    },
  },
};

export const mockCategory = {
  id: 1,
  name: "Infrastructure",
};

export const mockSystemSetting = {
  id: 1,
  idea_closure_date: "2024-03-01",
  final_closure_date: "2024-03-15",
  academic_year: "2024",
  status: 1,
  total_ideas: 10,
};
