import Login from "@/app/login/page";
import mockRouter from "next-router-mock";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ToastProvider } from "@/components/toast";
import { publicIpv4 } from "public-ip";
import { detect } from "detect-browser";
import { useAuthStore } from "@/store/authStore";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));
jest.mock("@/util/sleep", () => ({
  sleep: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("public-ip", () => ({
  publicIpv4: jest.fn().mockResolvedValue("192.168.1.1"),
}));
jest.mock("detect-browser", () => ({
  detect: jest.fn().mockReturnValue({ name: "chrome" }),
}));
jest.mock("@/store/authStore", () => ({
  useAuthStore: jest.fn().mockReturnValue({
    login: jest.fn().mockImplementation((email) => {
      if (email === "admin@idea.com") {
        return Promise.resolve();
      }
      return Promise.reject("Invalid credentials");
    }),
    clearError: jest.fn(),
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
  (publicIpv4 as jest.Mock).mockClear();
  (detect as jest.Mock).mockClear();
});

describe("Login page", () => {
  beforeEach(() => {
    mockRouter.push("/login");
  });

  it("should stay on login page after failed authentication", async () => {
    render(
      <ToastProvider>
        <Login />
      </ToastProvider>,
    );

    // Mock the IP and browser detection
    (publicIpv4 as jest.Mock).mockResolvedValue("192.168.1.1");
    (detect as jest.Mock).mockReturnValue({ name: "chrome" });

    fireEvent.change(screen.getByPlaceholderText("example@gmail.com"), {
      target: { value: "admin@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockRouter.pathname).toBe("/login");
      expect(publicIpv4).toHaveBeenCalled();
      expect(detect).toHaveBeenCalled();
    });
  });

  it("should navigate to dashboard after successful authentication", async () => {
    render(
      <ToastProvider>
        <Login />
      </ToastProvider>,
    );

    // Mock the IP and browser detection
    (publicIpv4 as jest.Mock).mockResolvedValue("192.168.1.1");
    (detect as jest.Mock).mockReturnValue({ name: "chrome" });

    fireEvent.change(screen.getByPlaceholderText("example@gmail.com"), {
      target: { value: "admin@idea.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "admin" },
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockRouter.pathname).toBe("/dashboard");
      expect(publicIpv4).toHaveBeenCalled();
      expect(detect).toHaveBeenCalled();
    });
  });
});
