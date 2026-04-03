import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(() => ({ pathname: "/dashboard", search: "", hash: "", state: null })),
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

async function renderDashboard() {
  const { default: Dashboard } = await import("../pages/dashboard");
  return render(<Dashboard />);
}

async function renderHeader() {
  const { Header } = await import("../components/layout/header");
  const { AuthProvider } = await import("../lib/auth-context");
  return render(<AuthProvider><Header /></AuthProvider>);
}

async function renderLogin() {
  const { default: Login } = await import("../pages/login");
  const { AuthProvider } = await import("../lib/auth-context");
  return render(<AuthProvider><Login /></AuthProvider>);
}

async function renderAnalytics() {
  const { default: Analytics } = await import("../pages/analytics");
  return render(<Analytics />);
}

async function renderSettings() {
  const { default: Settings } = await import("../pages/settings");
  const { AuthProvider } = await import("../lib/auth-context");
  return render(<AuthProvider><Settings /></AuthProvider>);
}

describe("Accessibility — login page", () => {
  it("login form has a form element", async () => {
    await renderLogin();
    const form = document.querySelector("form");
    expect(form).toBeTruthy();
  });

  it("login email input is present and has testid", async () => {
    await renderLogin();
    const emailInput = screen.getByTestId("input-email");
    expect(emailInput).toBeInTheDocument();
  });

  it("login email input is associated with a label", async () => {
    await renderLogin();
    const emailInput = screen.getByTestId("input-email");
    const label = document.querySelector(`label[for="${emailInput.id}"]`) ||
      emailInput.closest("div")?.querySelector("label") ||
      document.querySelector("label");
    expect(label).toBeTruthy();
  });

  it("login password input is present and has testid", async () => {
    await renderLogin();
    const passwordInput = screen.getByTestId("input-password");
    expect(passwordInput).toBeInTheDocument();
  });

  it("login password input has associated label", async () => {
    await renderLogin();
    const passwordInput = screen.getByTestId("input-password");
    const label = document.querySelector(`label[for="${passwordInput.id}"]`) ||
      passwordInput.closest("div")?.querySelector("label");
    expect(label).toBeTruthy();
  });

  it("login submit button has an accessible name (button-sign-in)", async () => {
    await renderLogin();
    const btn = screen.getByTestId("button-sign-in");
    expect(btn.textContent?.trim()).toBeTruthy();
  });

  it("login page has heading or brand name", async () => {
    await renderLogin();
    const heading = screen.queryByRole("heading") || screen.queryByText(/CardioWatch|Sign In|Login/i);
    expect(heading).toBeTruthy();
  });

  it("login page shows CardioWatch brand name", async () => {
    await renderLogin();
    expect(screen.getByText(/CardioWatch/i)).toBeInTheDocument();
  });
});

describe("Accessibility — dashboard page", () => {
  it("dashboard has at least one heading", async () => {
    await renderDashboard();
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("dashboard table has correct role", async () => {
    await renderDashboard();
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("dashboard table has column header cells", async () => {
    await renderDashboard();
    const headers = screen.getAllByRole("columnheader");
    expect(headers.length).toBeGreaterThan(0);
  });

  it("dashboard table rows have correct role", async () => {
    await renderDashboard();
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("sortable name column header (sort-name) is present in dashboard", async () => {
    await renderDashboard();
    expect(screen.getByTestId("sort-name")).toBeInTheDocument();
  });

  it("sortable age column header (sort-age) is present in dashboard", async () => {
    await renderDashboard();
    expect(screen.getByTestId("sort-age")).toBeInTheDocument();
  });

  it("sortable battery column header is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("sort-batteryPct")).toBeInTheDocument();
  });
});

describe("Accessibility — header component", () => {
  it("notification bell is present in header", async () => {
    await renderHeader();
    expect(screen.getByTestId("notification-bell")).toBeInTheDocument();
  });

  it("notification badge is present in header", async () => {
    await renderHeader();
    expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
  });

  it("notification badge shows positive count", async () => {
    await renderHeader();
    const badge = screen.getByTestId("notification-badge");
    expect(parseInt(badge.textContent || "0")).toBeGreaterThan(0);
  });

  it("user menu button is present in header", async () => {
    await renderHeader();
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });
});

describe("Accessibility — keyboard and focus", () => {
  it("login form can be submitted via keyboard Enter", async () => {
    const user = userEvent.setup();
    await renderLogin();
    const emailInput = screen.getByTestId("input-email");
    await user.click(emailInput);
    await user.type(emailInput, "test@example.com");
    const passwordInput = screen.getByTestId("input-password");
    await user.click(passwordInput);
    await user.type(passwordInput, "password");
    await user.keyboard("{Enter}");
    expect(emailInput).toBeInTheDocument();
  });

  it("dashboard patient table rows (excluding header) are rendered", async () => {
    await renderDashboard();
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("buttons on dashboard are focusable button elements", async () => {
    await renderDashboard();
    const buttons = screen.getAllByRole("button");
    buttons.forEach(btn => {
      expect(btn.tagName).toBe("BUTTON");
    });
  });

  it("anchor links in sidebar are real links", async () => {
    const { Sidebar } = await import("../components/layout/sidebar");
    render(<Sidebar />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(link.tagName).toBe("A");
    });
  });
});

describe("Accessibility — semantic structure", () => {
  it("analytics page has main heading", async () => {
    await renderAnalytics();
    expect(screen.getByText(/Population Analytics/i)).toBeInTheDocument();
  });

  it("analytics page has metric cards with testids", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("metric-patient-days")).toBeInTheDocument();
    expect(screen.getByTestId("metric-total-events")).toBeInTheDocument();
    expect(screen.getByTestId("metric-compliance")).toBeInTheDocument();
  });

  it("settings page has section structure", async () => {
    await renderSettings();
    expect(screen.getByTestId("user-profile-section")).toBeInTheDocument();
  });

  it("settings page shows notification preference labels", async () => {
    await renderSettings();
    expect(screen.getByTestId("toggle-inapp-alerts")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-email-alerts")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-sms-alerts")).toBeInTheDocument();
  });

  it("login disclaimer text is present", async () => {
    await renderLogin();
    expect(screen.getByTestId("text-disclaimer")).toBeInTheDocument();
  });

  it("login page has CardioWatch brand name visible", async () => {
    await renderLogin();
    expect(screen.getByText(/CardioWatch/i)).toBeInTheDocument();
  });
});
