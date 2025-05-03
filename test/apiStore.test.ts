import { useApiStore } from "@/store/apiStore";
import * as api from "@/api/repository";
import {
  mockDepartment,
  mockIdea,
  mockCategory,
  mockSystemSetting,
  mockPaginatedResponse,
  mockUser,
  mockComment,
  mockUserLog,
  mockReportedIdea,
  mockReportDetail,
  mockReportedUser,
  mockHiddenIdea,
  mockBannedUser,
  mockActiveUser,
  mockDepartmentReport,
  mockAnonymousIdea,
  mockAnonymousComment,
  mockLoginActivity,
} from "./mockData";

// Mock the entire repository module
jest.mock("@/api/repository", () => ({
  departmentApi: {
    getAll: () => Promise.resolve({ data: { data: [mockDepartment] } }),
    create: () => Promise.resolve({ data: mockDepartment }),
    getUsers: () => Promise.resolve({ data: { data: [mockUser] } }),
    update: () => Promise.resolve({ data: mockDepartment }),
    delete: () => Promise.resolve({ data: { message: "Deleted" } }),
  },
  ideaApi: {
    getAll: () =>
      Promise.resolve({
        data: {
          data: [{ ...mockIdea, is_enabled: true }],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      }),
    create: () => Promise.resolve({ data: mockIdea }),
    submit: () => Promise.resolve({ data: { ...mockIdea, is_enabled: true } }),
    getToSubmit: () =>
      Promise.resolve({
        data: {
          data: [mockIdea],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      }),
    getOne: () => Promise.resolve({ data: { data: mockIdea } }),
    update: () => Promise.resolve({ data: mockIdea }),
    delete: () => Promise.resolve({ data: { message: "Deleted" } }),
    updateCategory: () => Promise.resolve({ data: mockIdea }),
  },
  categoryApi: {
    getAll: () => Promise.resolve({ data: { data: [mockCategory] } }),
    create: () => Promise.resolve({ data: mockCategory }),
    update: () => Promise.resolve({ data: mockCategory }),
    delete: () => Promise.resolve({ data: { message: "Deleted" } }),
  },
  systemSettingApi: {
    getAll: () => Promise.resolve({ data: { data: [mockSystemSetting] } }),
    update: () => Promise.resolve({ data: mockSystemSetting }),
    create: () => Promise.resolve({ data: mockSystemSetting }),
    delete: () => Promise.resolve({ data: { message: "Deleted" } }),
    getCSV: () => Promise.resolve(new Blob()),
  },
  commentApi: {
    getCommentsForIdea: () => Promise.resolve({ data: { data: [mockComment] } }),
    create: () => Promise.resolve({ data: mockComment }),
    update: () => Promise.resolve({ data: mockComment }),
    delete: () => Promise.resolve({ data: { message: "Deleted" } }),
  },
  voteApi: {
    create: () => Promise.resolve({ data: { message: "Vote created" } }),
  },
  userApi: {
    getAll: () => Promise.resolve({ 
      data: { 
        data: [mockUser],
        meta: { current_page: 1, last_page: 1, total: 1 }
      }
    }),
    getOne: () => Promise.resolve({ data: { data: mockUser } }),
    create: () => Promise.resolve({ data: mockUser }),
    update: () => Promise.resolve({ data: mockUser }),
  },
  roleApi: {
    getAll: () => Promise.resolve({ data: { data: [{ id: 1, name: "Admin" }] } }),
  },
  reportApi: {
    create: () => Promise.resolve({ data: { message: "Report created" } }),
    reportIdea: () => Promise.resolve({ data: { message: "Report created" } }),
    getReportedIdeas: () => Promise.resolve({ 
      data: { 
        data: [mockReportedIdea],
        meta: { current_page: 1, last_page: 1, total: 1 }
      }
    }),
    getReportDetails: () => Promise.resolve({ data: [mockReportDetail] }),
    getReportedUsers: () => Promise.resolve({ data: [mockReportedUser] }),
    getUserReportedIdeas: () => Promise.resolve({ data: { data: [mockReportedIdea] } }),
  },
  hideApi: {
    hideIdea: () => Promise.resolve({ data: { message: "Idea hidden" } }),
    getHiddenIdeas: () => Promise.resolve({ data: [mockHiddenIdea] }),
    hideUserIdeas: () => Promise.resolve({ data: { message: "Ideas hidden" } }),
    getHiddenUsers: () => Promise.resolve({ 
      data: { 
        data: [mockHiddenIdea],
        meta: { current_page: 1, last_page: 1, total: 1 }
      }
    }),
  },
  permissionApi: {
    removeIdeaPermissions: () => Promise.resolve({ data: { message: "Permissions removed" } }),
    giveIdeaPermissions: () => Promise.resolve({ data: { message: "Permissions given" } }),
    getBannedUsers: () => Promise.resolve({ 
      data: { 
        data: [mockBannedUser],
        meta: { current_page: 1, last_page: 1, total: 1 }
      }
    }),
  },
  reportingApi: {
    getActiveUsers: () => Promise.resolve({ data: [mockActiveUser] }),
    getDepartmentReport: () => Promise.resolve({ data: [mockDepartmentReport] }),
    getAnonymousIdeas: () => Promise.resolve({ 
      data: { 
        data: [mockAnonymousIdea],
        meta: { current_page: 1, last_page: 1, total: 1 }
      }
    }),
    getAnonymousComments: () => Promise.resolve({ 
      data: { 
        data: [mockAnonymousComment],
        meta: { current_page: 1, last_page: 1, total: 1 }
      }
    }),
  },
  loginActivityApi: {
    getAll: () => Promise.resolve({ 
      data: { 
        data: [mockLoginActivity],
        meta: { current_page: 1, last_page: 1, total: 1 }
      }
    }),
  },
}));

describe("API Store", () => {
  beforeEach(() => {
    useApiStore.setState({
      departments: [],
      users: [],
      ideas: [],
      categories: [],
      systemSettings: [],
      isLoading: false,
      error: null,
      roles: [],
    });
  });

  describe("Departments", () => {
    it("should fetch and store departments", async () => {
      await useApiStore.getState().fetchDepartments();
      expect(useApiStore.getState().departments).toEqual([mockDepartment]);
      expect(useApiStore.getState().isLoading).toBe(false);
    });

    it("should create department", async () => {
      await useApiStore.getState().createDepartment(mockDepartment);
      expect(useApiStore.getState().departments).toEqual([mockDepartment]);
      expect(useApiStore.getState().isLoading).toBe(false);
    });
  });

  describe("Ideas", () => {
    beforeEach(() => {
      useApiStore.setState({
        ideas: [],
        idea: null,
        ideaPagination: {
          data: [],
          currentPage: 1,
          lastPage: 1,
          total: 0,
          loading: false,
        },
        error: null,
        isLoading: false,
      });

      jest.clearAllMocks();
    });

    it("should fetch ideas with params", async () => {
      const params = { page: "1" };
      await useApiStore.getState().fetchIdeas(params);

      const store = useApiStore.getState();
      expect(store.ideas).toEqual([{ ...mockIdea, is_enabled: true }]);
      expect(store.ideaPagination.data).toEqual([{ ...mockIdea, is_enabled: true }]);
      expect(store.error).toBeNull();
    });

    it("should create idea and refresh list", async () => {
      const formData = new FormData();
      await useApiStore.getState().createIdea(formData);
      expect(useApiStore.getState().ideas).toEqual([{ ...mockIdea, is_enabled: true }]);
    });
    it("should submit idea and refresh list", async () => {
      await useApiStore.getState().submitIdea(1);
      expect(useApiStore.getState().ideas).toEqual([
        { ...mockIdea, is_enabled: true },
      ]);
    });

    it("should handle fetch ideas error", async () => {
      const mockIdeasError = new Error("Failed to fetch ideas");
      jest.spyOn(api.ideaApi, "getAll").mockRejectedValueOnce(mockIdeasError);

      await expect(useApiStore.getState().fetchIdeas()).rejects.toThrow(
        "Failed to fetch ideas",
      );
      expect(useApiStore.getState().error).toBe("Failed to fetch ideas");
    });
  });

  describe("Categories", () => {
    it("should fetch categories", async () => {
      await useApiStore.getState().fetchCategories();
      expect(useApiStore.getState().categories).toEqual([mockCategory]);
    });

    it("should create category and refresh list", async () => {
      await useApiStore.getState().createCategory(mockCategory.name);
      expect(useApiStore.getState().categories).toEqual([mockCategory]);
    });
  });

  describe("System Settings", () => {
    it("should fetch system settings", async () => {
      await useApiStore.getState().fetchSystemSettings();
      expect(useApiStore.getState().systemSettings).toEqual([
        mockSystemSetting,
      ]);
    });

    it("should update system setting and refresh list", async () => {
      const updateData = { academic_year: "2025" };
      await useApiStore.getState().updateSystemSetting(1, updateData);
      expect(useApiStore.getState().systemSettings).toEqual([
        mockSystemSetting,
      ]);
    });
  });

  describe("Error Handling", () => {
    it("should set and clear error", () => {
      const store = useApiStore.getState();

      store.setError("Test error");
      expect(useApiStore.getState().error).toBe("Test error");

      store.clearError();
      expect(useApiStore.getState().error).toBeNull();
    });

    it("should handle loading state correctly", async () => {
      const store = useApiStore.getState();

      // Check loading state during operation
      const loadingPromise = store.fetchDepartments();
      expect(useApiStore.getState().isLoading).toBe(true);

      await loadingPromise;
      expect(useApiStore.getState().isLoading).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty responses", async () => {
      jest
        .spyOn(useApiStore.getState(), "fetchDepartments")
        .mockImplementationOnce(() => Promise.resolve());

      await useApiStore.getState().fetchDepartments();
      expect(useApiStore.getState().departments).toEqual([]);
    });

    it("should handle concurrent requests", async () => {
      const promises = [
        useApiStore.getState().fetchDepartments(),
        useApiStore.getState().fetchCategories(),
        useApiStore.getState().fetchSystemSettings(),
      ];

      await Promise.all(promises);

      expect(useApiStore.getState().departments).toEqual([mockDepartment]);
      expect(useApiStore.getState().categories).toEqual([mockCategory]);
      expect(useApiStore.getState().systemSettings).toEqual([
        mockSystemSetting,
      ]);
    });
  });
});

describe("User Management", () => {
  beforeEach(() => {
    useApiStore.setState({
      users: [],
      user: null,
      userPagination: {
        data: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        loading: false,
      },
    });
  });

  it("should fetch users with pagination", async () => {
    await useApiStore.getState().fetchUsers(1);
    const store = useApiStore.getState();
    expect(store.userPagination.data).toEqual([mockUser]);
    expect(store.userPagination.currentPage).toBe(1);
    expect(store.userPagination.lastPage).toBe(1);
    expect(store.userPagination.total).toBe(1);
  });

  it("should get single user", async () => {
    const user = await useApiStore.getState().getUser(1);
    expect(user).toEqual(mockUser);
    expect(useApiStore.getState().user).toEqual(mockUser);
  });

  it("should create user", async () => {
    const formData = new FormData();
    await useApiStore.getState().createUser(formData);
    const store = useApiStore.getState();
    expect(store.userPagination.data).toEqual([mockUser]);
  });

  it("should update user", async () => {
    const formData = new FormData();
    await useApiStore.getState().updateUser(1, formData);
    const store = useApiStore.getState();
    expect(store.userPagination.data).toEqual([mockUser]);
    expect(store.error).toBeNull();
  });
});

describe("Comments", () => {
  beforeEach(() => {
    useApiStore.setState({ comments: [] });
  });

  it("should get comments for idea", async () => {
    await useApiStore.getState().getCommentsForIdea(1);
    expect(useApiStore.getState().comments).toEqual([mockComment]);
  });

  it("should create comment", async () => {
    const formData = new FormData();
    await useApiStore.getState().createComment(formData);
    expect(useApiStore.getState().comments).toEqual([mockComment]);
  });

  it("should update comment", async () => {
    const formData = new FormData();
    await useApiStore.getState().updateComment(1, formData);
    expect(useApiStore.getState().comments).toEqual([mockComment]);
  });

  it("should delete comment", async () => {
    await useApiStore.getState().deleteComment(1);
    expect(useApiStore.getState().comments).toEqual([]);
  });
});

describe("Voting", () => {
  it("should create vote", async () => {
    await useApiStore.getState().createVote(1, 1);
    expect(useApiStore.getState().error).toBeNull();
  });
});

describe("Reporting System", () => {
  beforeEach(() => {
    useApiStore.setState({
      reportedIdeas: {
        data: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        loading: false,
      },
      reportDetails: [],
      reportedUsers: [],
    });
  });

  it("should report idea", async () => {
    const formData = new FormData();
    await useApiStore.getState().reportIdea(formData);
    expect(useApiStore.getState().error).toBeNull();
  });

  it("should fetch reported ideas", async () => {
    await useApiStore.getState().fetchReportedIdeas(1);
    expect(useApiStore.getState().reportedIdeas.data).toEqual([mockReportedIdea]);
  });

  it("should fetch report details", async () => {
    await useApiStore.getState().fetchReportDetails(1);
    expect(useApiStore.getState().reportDetails).toEqual([mockReportDetail]);
  });

  it("should fetch reported users", async () => {
    await useApiStore.getState().fetchReportedUsers();
    expect(useApiStore.getState().reportedUsers).toEqual([mockReportedUser]);
  });

  it("should fetch user reported ideas", async () => {
    await useApiStore.getState().fetchUserReportedIdeas(1);
    expect(useApiStore.getState().reportedIdeas.data).toEqual([mockReportedIdea]);
  });
});

describe("Content Moderation", () => {
  beforeEach(() => {
    useApiStore.setState({
      hiddenIdeas: [],
      hiddenUsers: {
        data: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        loading: false,
      },
    });
  });

  it("should get hidden ideas", async () => {
    await useApiStore.getState().getHiddenIdeas();
    expect(useApiStore.getState().hiddenIdeas).toEqual([mockHiddenIdea]);
  });

  it("should hide user ideas", async () => {
    await useApiStore.getState().hideUserIdeas(1, 1);
    expect(useApiStore.getState().error).toBeNull();
  });

  it("should get hidden users", async () => {
    await useApiStore.getState().getHiddenUsers();
    expect(useApiStore.getState().hiddenUsers.data).toEqual([]);
  });

  it("should manage user permissions", async () => {
    await useApiStore.getState().removeIdeaPermissions(1);
    expect(useApiStore.getState().error).toBeNull();

    await useApiStore.getState().giveIdeaPermissions(1);
    expect(useApiStore.getState().error).toBeNull();
  });

  it("should get banned users", async () => {
    await useApiStore.getState().getBannedUsers();
    expect(useApiStore.getState().bannedUsers.data).toEqual([mockBannedUser]);
  });
});

describe("Analytics and Reporting", () => {
  beforeEach(() => {
    useApiStore.setState({
      activeUsers: [],
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
    });
  });

  it("should get active users", async () => {
    await useApiStore.getState().getActiveUsers();
    expect(useApiStore.getState().activeUsers).toEqual([mockActiveUser]);
  });

  it("should get department report", async () => {
    await useApiStore.getState().getDepartmentReport();
    expect(useApiStore.getState().departmentReport).toEqual([mockDepartmentReport]);
  });

  it("should get anonymous ideas", async () => {
    await useApiStore.getState().getAnonymousIdeas();
    expect(useApiStore.getState().anonymousIdeas.data).toEqual([mockAnonymousIdea]);
  });

  it("should get anonymous comments", async () => {
    await useApiStore.getState().getAnonymousComments();
    expect(useApiStore.getState().anonymousComments.data).toEqual([mockAnonymousComment]);
  });
});

// describe("Login Activity", () => {
//   it("should get user login activities", async () => {
//     await useApiStore.getState().getUserLoginActivities(1);
//     expect(useApiStore.getState().loginActivities).toEqual([mockLoginActivity]);
//   });
// });
