import Login from "@/app/login/page";
import mockRouter from "next-router-mock";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));
jest.mock("@/util/sleep", () => ({
  sleep: jest.fn().mockResolvedValue(undefined),
}));

afterEach(() => jest.clearAllMocks());

describe("Login page", () => {
  beforeEach(() => {
    mockRouter.push("/login");
  });
  it("should stay on login page after failed authentication", async () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("example@gmail.com"), {
      target: { value: "test@idea.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "admin" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockRouter.pathname).toBe("/login");
    });
  });
});
