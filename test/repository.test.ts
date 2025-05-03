import { mockApiClient } from "./mockApiClient";
import {
  departmentApi,
  roleApi,
  userApi,
  ideaApi,
  categoryApi,
  systemSettingApi,
  commentApi,
  voteApi,
  userLogApi,
  reportApi,
  hideApi,
  permissionApi,
  reportingApi,
  loginActivityApi,
} from "@/api/repository";
import {
  mockDepartment,
  mockUser,
  mockIdea,
  mockCategory,
  mockSystemSetting,
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

describe("Repository APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Department API", () => {
    it("should get all departments", async () => {
      mockApiClient.get.mockResolvedValueOnce({
        data: { data: [mockDepartment] },
      });
      const response = await departmentApi.getAll();
      expect(mockApiClient.get).toHaveBeenCalledWith("/departments");
      expect(response.data.data).toEqual([mockDepartment]);
    });

    it("should get one department", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockDepartment });
      const response = await departmentApi.getOne(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/departments/1");
      expect(response.data).toEqual(mockDepartment);
    });

    it("should get department users", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: { data: [mockUser] } });
      const response = await departmentApi.getDepartmentUsers(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/departments/users/1");
      expect(response.data.data).toEqual([mockUser]);
    });

    it("should create department", async () => {
      mockApiClient.post.mockResolvedValueOnce({ data: mockDepartment });
      const response = await departmentApi.create({
        department_name: "Test Department",
      });
      expect(mockApiClient.post).toHaveBeenCalledWith("/departments", {
        department_name: "Test Department",
      });
      expect(response.data).toEqual(mockDepartment);
    });

    it("should update department", async () => {
      mockApiClient.put.mockResolvedValueOnce({ data: mockDepartment });
      const response = await departmentApi.update(1, {
        department_name: "Updated Department",
      });
      expect(mockApiClient.put).toHaveBeenCalledWith("/departments/1", {
        department_name: "Updated Department",
      });
      expect(response.data).toEqual(mockDepartment);
    });

    it("should delete department", async () => {
      mockApiClient.delete.mockResolvedValueOnce({
        data: { message: "Deleted" },
      });
      await departmentApi.delete(1);
      expect(mockApiClient.delete).toHaveBeenCalledWith("/departments/1");
    });
  });

  describe("User API", () => {
    it("should get all users with pagination", async () => {
      const mockResponse = {
        data: {
          data: [mockUser],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      };
      mockApiClient.get.mockResolvedValueOnce(mockResponse);
      const response = await userApi.getAll(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/users?page=1");
      expect(response.data).toEqual(mockResponse.data);
    });

    it("should get one user", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: { data: mockUser } });
      const response = await userApi.getOne(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/users/1");
      expect(response.data.data).toEqual(mockUser);
    });

    it("should create user", async () => {
      const formData = new FormData();
      mockApiClient.post.mockResolvedValueOnce({ data: mockUser });
      const response = await userApi.create(formData);
      expect(mockApiClient.post).toHaveBeenCalledWith("/users", formData);
      expect(response.data).toEqual(mockUser);
    });

    it("should update user", async () => {
      const formData = new FormData();
      mockApiClient.put.mockResolvedValueOnce({ data: mockUser });
      const response = await userApi.update(1, formData);
      expect(mockApiClient.put).toHaveBeenCalledWith("/users/1", formData);
      expect(response.data).toEqual(mockUser);
    });
  });

  describe("Idea API", () => {
    it("should get all ideas with pagination", async () => {
      const mockResponse = {
        data: {
          data: [mockIdea],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      };
      mockApiClient.get.mockResolvedValueOnce(mockResponse);
      const response = await ideaApi.getAll({ page: "1" });
      expect(mockApiClient.get).toHaveBeenCalledWith("/idea", {
        params: { page: "1" },
      });
      expect(response.data).toEqual(mockResponse.data);
    });

    it("should get ideas to submit", async () => {
      const mockResponse = {
        data: {
          data: [mockIdea],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      };
      mockApiClient.get.mockResolvedValueOnce(mockResponse);
      const response = await ideaApi.getToSubmit(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/idea/to-submit", {
        params: { page: 1 },
      });
      expect(response.data).toEqual(mockResponse.data);
    });

    it("should submit idea", async () => {
      mockApiClient.put.mockResolvedValueOnce({ data: mockIdea });
      const response = await ideaApi.submit(1);
      expect(mockApiClient.put).toHaveBeenCalledWith("/idea/submit/1", {
        is_enabled: 1,
      });
      expect(response.data).toEqual(mockIdea);
    });
  });

  describe("Report API", () => {
    it("should get reported ideas", async () => {
      const mockResponse = {
        data: {
          data: [mockReportedIdea],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      };
      mockApiClient.get.mockResolvedValueOnce(mockResponse);
      const response = await reportApi.getReportedIdeas(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/report/ideas", {
        params: { page: 1 },
      });
      expect(response.data).toEqual(mockResponse.data);
    });

    it("should get report details", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [mockReportDetail] });
      const response = await reportApi.getReportDetails(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/report/ideas/1");
      expect(response.data).toEqual([mockReportDetail]);
    });
  });

  describe("Hide API", () => {
    it("should hide idea", async () => {
      mockApiClient.put.mockResolvedValueOnce({
        data: { message: "Idea hidden" },
      });
      const response = await hideApi.hideIdea(1, 1);
      expect(mockApiClient.put).toHaveBeenCalledWith("/hide/1", { hide: 1 });
      expect(response.data).toEqual({ message: "Idea hidden" });
    });

    it("should get hidden ideas", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [mockHiddenIdea] });
      const response = await hideApi.getHiddenIdeas();
      expect(mockApiClient.get).toHaveBeenCalledWith("/get-hide-ideas");
      expect(response.data).toEqual([mockHiddenIdea]);
    });
  });

  describe("Permission API", () => {
    it("should get banned users", async () => {
      const mockResponse = {
        data: {
          data: [mockBannedUser],
          meta: { current_page: 1, last_page: 1, total: 1 },
        },
      };
      mockApiClient.get.mockResolvedValueOnce(mockResponse);
      const response = await permissionApi.getBannedUsers();
      expect(mockApiClient.get).toHaveBeenCalledWith("/banUser");
      expect(response.data).toEqual(mockResponse.data);
    });
  });

  describe("Reporting API", () => {
    it("should get active users", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [mockActiveUser] });
      const response = await reportingApi.getActiveUsers();
      expect(mockApiClient.get).toHaveBeenCalledWith("/active-users");
      expect(response.data).toEqual([mockActiveUser]);
    });

    it("should get department report", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [mockDepartmentReport] });
      const response = await reportingApi.getDepartmentReport();
      expect(mockApiClient.get).toHaveBeenCalledWith("/department-report");
      expect(response.data).toEqual([mockDepartmentReport]);
    });
  });

  describe("Login Activity API", () => {
    it("should get user login activities", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [mockLoginActivity] });
      const response = await loginActivityApi.getUserLoginActivities(1);
      expect(mockApiClient.get).toHaveBeenCalledWith("/log-in-activities/1");
      expect(response.data).toEqual([mockLoginActivity]);
    });
  });
});
