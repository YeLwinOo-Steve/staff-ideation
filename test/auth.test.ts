import { useAuthStore } from "@/store/authStore";

import { mockUser } from "./mockData";
import { authApi } from "@/api/auth";

jest.mock("@/api/repository", () => ({
  authApi: {
    login: jest.fn(() => Promise.resolve({ token: "a", status: 200 })),
  },
}));

jest.mock("@/api/auth", () => ({
  authApi: {
    login: jest.fn(() => Promise.resolve({ data: { data: mockUser, token: "test-token" } })),
    resetPassword: jest.fn(() => Promise.resolve({ data: { message: "Password reset successful" } })),
    changePassword: jest.fn(() => Promise.resolve({ data: { message: "Password changed successfully" } })),
  },
}));

describe("Auth Store", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  test("initial user should be null", () => {
    expect(useAuthStore.getState().user).toBe(null);
  });

  test("Should show error when login fails", async () => {
    const mockLoginError = new Error("Login failed");
    jest.spyOn(authApi, "login").mockRejectedValueOnce(mockLoginError);

    await expect(
      useAuthStore
        .getState()
        .login("admin@idea.com", "admin", "127.0.0.1", "Chrome"),
    ).rejects.toThrow("Login failed");

    const error = useAuthStore.getState().error;
    expect(error).toBe("Login failed");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  test("Should successfully login user", async () => {
    await useAuthStore.getState().login("admin@idea.com", "admin", "127.0.0.1", "Chrome");
    
    expect(authApi.login).toHaveBeenCalledWith({
      email: "admin@idea.com",
      password: "admin",
      ip_address: "127.0.0.1",
      browser: "Chrome",
    });
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().token).toBe("test-token");
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  test("Should successfully reset password", async () => {
    const result = await useAuthStore.getState().resetPassword(1);
    
    expect(authApi.resetPassword).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  test("Should handle password reset failure", async () => {
    const mockError = new Error("Password reset failed");
    jest.spyOn(authApi, "resetPassword").mockRejectedValueOnce(mockError);

    const result = await useAuthStore.getState().resetPassword(1);
    
    expect(result).toBe(false);
    expect(useAuthStore.getState().error).toBe("Password reset failed");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  test("Should successfully change password", async () => {
    await useAuthStore.getState().changePassword("oldpass", "newpass");
    
    expect(authApi.changePassword).toHaveBeenCalledWith({
      old_password: "oldpass",
      new_password: "newpass",
    });
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  test("Should handle password change failure", async () => {
    const mockError = new Error("Password change failed");
    jest.spyOn(authApi, "changePassword").mockRejectedValueOnce(mockError);

    await expect(
      useAuthStore.getState().changePassword("oldpass", "newpass")
    ).rejects.toThrow("Password change failed");
    
    expect(useAuthStore.getState().error).toBe("Password change failed");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  test("Should clear error", () => {
    useAuthStore.setState({ error: "Some error" });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
