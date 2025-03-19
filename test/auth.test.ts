import { useAuthStore } from "@/store/authStore";

import { mockUser } from "./mockData";

jest.mock("@/api/repository", () => ({
  authApi: {
    login: jest.fn(() => Promise.resolve({ token: "a", status: 200 })),
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
  });

  test("initial user should be null", () => {
    expect(useAuthStore.getState().user).toBe(null);
  });

  test("Should show error when login fails", async () => {
    await useAuthStore.getState().login("admin@idea.com", "admin");

    const error = useAuthStore.getState().error;
    expect(error).toBe("Login failed");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  test("logout should reset user to null", () => {
    const { logout } = useAuthStore.getState();
    logout();
    expect(useAuthStore.getState().user).toBe(null);
  });
});
