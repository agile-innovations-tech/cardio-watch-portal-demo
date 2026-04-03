import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(() => ({ pathname: "/login", search: "", hash: "", state: null })),
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(() => ({ id: "1" })),
  useMatch: vi.fn(() => null),
  Link: ({ children, to, href, onClick }: { children: React.ReactNode; to?: string; href?: string; onClick?: () => void }) => (
    <a href={to ?? href} onClick={onClick}>{children}</a>
  ),
  Navigate: () => null,
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Route: ({ element }: { element: React.ReactNode }) => <>{element}</>,
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

async function renderLoginPage() {
  const { default: LoginPage } = await import("../pages/login");
  const { AuthProvider } = await import("../lib/auth-context");
  return render(<AuthProvider><LoginPage /></AuthProvider>);
}

describe("Authentication — Login Screen", () => {
  it("login screen renders without crashing", async () => {
    const { container } = await renderLoginPage();
    expect(container.firstChild).not.toBeNull();
  });

  it("CardioWatch AI logo is rendered", async () => {
    await renderLoginPage();
    const logo = screen.getByTestId("logo-cardiowatch");
    expect(logo).toBeInTheDocument();
  });

  it("email field is present with testid", async () => {
    await renderLoginPage();
    const emailInput = screen.getByTestId("input-email");
    expect(emailInput).toBeInTheDocument();
  });

  it("email field has type email or text", async () => {
    await renderLoginPage();
    const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
    expect(["email", "text"]).toContain(emailInput.type);
  });

  it("email field accepts typed input", async () => {
    const user = userEvent.setup();
    await renderLoginPage();
    const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
    await user.type(emailInput, "doctor@hospital.org");
    expect(emailInput.value).toBe("doctor@hospital.org");
  });

  it("password field is present with testid", async () => {
    await renderLoginPage();
    const passwordInput = screen.getByTestId("input-password");
    expect(passwordInput).toBeInTheDocument();
  });

  it("password field has type password (masks characters)", async () => {
    await renderLoginPage();
    const passwordInput = screen.getByTestId("input-password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");
  });

  it("password field accepts typed input", async () => {
    const user = userEvent.setup();
    await renderLoginPage();
    const passwordInput = screen.getByTestId("input-password") as HTMLInputElement;
    await user.type(passwordInput, "secretpass123");
    expect(passwordInput.value).toBe("secretpass123");
  });

  it("submit button is present", async () => {
    await renderLoginPage();
    const submitBtn = screen.getByTestId("button-sign-in");
    expect(submitBtn).toBeInTheDocument();
  });

  it("submit button is labeled Sign In", async () => {
    await renderLoginPage();
    const submitBtn = screen.getByTestId("button-sign-in");
    expect(submitBtn.textContent).toMatch(/sign in/i);
  });

  it("forgot password link is present", async () => {
    await renderLoginPage();
    const forgotLink = screen.getByTestId("link-forgot-password");
    expect(forgotLink).toBeInTheDocument();
  });

  it("authorized-use disclaimer text is present", async () => {
    await renderLoginPage();
    const disclaimer = screen.getByTestId("text-disclaimer");
    expect(disclaimer).toBeInTheDocument();
    expect(disclaimer.textContent).toMatch(/authorized clinical users only/i);
  });

  it("submitting with empty fields does not navigate to dashboard", async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    const { useNavigate } = await import("react-router-dom");
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    await renderLoginPage();
    const submitBtn = screen.getByTestId("button-sign-in");
    await user.click(submitBtn);
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    }, { timeout: 1000 });
  });

  it("submitting with valid credentials calls navigate to /dashboard", async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    const { useNavigate } = await import("react-router-dom");
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    await renderLoginPage();
    const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
    const passwordInput = screen.getByTestId("input-password") as HTMLInputElement;
    await user.type(emailInput, "doctor@hospital.org");
    await user.type(passwordInput, "password123");
    const submitBtn = screen.getByTestId("button-sign-in");
    await user.click(submitBtn);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    }, { timeout: 2000 });
  });

  it("empty email field prevents navigation even with password filled", async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    const { useNavigate } = await import("react-router-dom");
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    await renderLoginPage();
    const passwordInput = screen.getByTestId("input-password") as HTMLInputElement;
    await user.type(passwordInput, "password123");
    const submitBtn = screen.getByTestId("button-sign-in");
    await user.click(submitBtn);
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    }, { timeout: 1000 });
  });

  it("empty password field prevents navigation even with email filled", async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    const { useNavigate } = await import("react-router-dom");
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    await renderLoginPage();
    const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
    await user.type(emailInput, "doctor@hospital.org");
    const submitBtn = screen.getByTestId("button-sign-in");
    await user.click(submitBtn);
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    }, { timeout: 1000 });
  });

  it("page contains CardioWatch AI branding text", async () => {
    await renderLoginPage();
    const brandingText = screen.getAllByText(/CardioWatch AI/i);
    expect(brandingText.length).toBeGreaterThan(0);
  });

  it("page contains Clinician Portal subtitle", async () => {
    await renderLoginPage();
    const subtitle = screen.getByText(/Clinician Portal/i);
    expect(subtitle).toBeInTheDocument();
  });
});
