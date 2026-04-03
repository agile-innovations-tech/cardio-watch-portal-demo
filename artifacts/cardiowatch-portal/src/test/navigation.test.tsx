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

async function renderSidebar() {
  const { Sidebar } = await import("../components/layout/sidebar");
  return render(<Sidebar />);
}

async function renderHeader() {
  const { Header } = await import("../components/layout/header");
  const { AuthProvider } = await import("../lib/auth-context");
  return render(<AuthProvider><Header /></AuthProvider>);
}

describe("Navigation — sidebar", () => {
  it("sidebar renders without crashing", async () => {
    const { container } = await renderSidebar();
    expect(container.firstChild).not.toBeNull();
  });

  it("sidebar has data-testid='sidebar'", async () => {
    await renderSidebar();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("Dashboard nav link is present with testid", async () => {
    await renderSidebar();
    expect(screen.getByTestId("nav-dashboard")).toBeInTheDocument();
  });

  it("Analytics nav link is present with testid", async () => {
    await renderSidebar();
    expect(screen.getByTestId("nav-analytics")).toBeInTheDocument();
  });

  it("Settings nav link is present with testid", async () => {
    await renderSidebar();
    expect(screen.getByTestId("nav-settings")).toBeInTheDocument();
  });

  it("Dashboard nav link anchor points to /dashboard", async () => {
    await renderSidebar();
    const dashLink = screen.getByTestId("nav-dashboard").closest("a");
    expect(dashLink).not.toBeNull();
    expect(dashLink?.getAttribute("href")).toBe("/dashboard");
  });

  it("Analytics nav link anchor points to /analytics", async () => {
    await renderSidebar();
    const analyticsLink = screen.getByTestId("nav-analytics").closest("a");
    expect(analyticsLink).not.toBeNull();
    expect(analyticsLink?.getAttribute("href")).toBe("/analytics");
  });

  it("Settings nav link anchor points to /settings", async () => {
    await renderSidebar();
    const settingsLink = screen.getByTestId("nav-settings").closest("a");
    expect(settingsLink).not.toBeNull();
    expect(settingsLink?.getAttribute("href")).toBe("/settings");
  });

  it("CardioWatch AI branding text appears in sidebar", async () => {
    await renderSidebar();
    expect(screen.getByText("CardioWatch AI")).toBeInTheDocument();
  });

  it("collapse button is present", async () => {
    await renderSidebar();
    expect(screen.getByTestId("button-collapse-sidebar")).toBeInTheDocument();
  });

  it("clicking collapse hides Dashboard text label", async () => {
    const user = userEvent.setup();
    await renderSidebar();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    await user.click(screen.getByTestId("button-collapse-sidebar"));
    await waitFor(() => {
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("clicking collapse then expand restores Dashboard label", async () => {
    const user = userEvent.setup();
    await renderSidebar();
    const btn = screen.getByTestId("button-collapse-sidebar");
    await user.click(btn);
    await waitFor(() => {
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });
    await user.click(btn);
    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("Dashboard nav item has active styling when pathname is /dashboard", async () => {
    await renderSidebar();
    const dashItem = screen.getByTestId("nav-dashboard");
    expect(dashItem.className).toMatch(/font-medium/);
  });

  it("Analytics nav item does NOT have active styling when pathname is /dashboard", async () => {
    await renderSidebar();
    const analyticsItem = screen.getByTestId("nav-analytics");
    expect(analyticsItem.className).not.toMatch(/font-medium/);
  });

  it("sidebar contains a nav element", async () => {
    await renderSidebar();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("sidebar nav shows three navigation items", async () => {
    await renderSidebar();
    const navItems = [
      screen.getByTestId("nav-dashboard"),
      screen.getByTestId("nav-analytics"),
      screen.getByTestId("nav-settings"),
    ];
    expect(navItems).toHaveLength(3);
  });
});

describe("Navigation — header", () => {
  it("header renders without crashing", async () => {
    const { container } = await renderHeader();
    expect(container.firstChild).not.toBeNull();
  });

  it("header has data-testid='header'", async () => {
    await renderHeader();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("Northgate Cardiac Institute practice name is shown", async () => {
    await renderHeader();
    expect(screen.getByText("Northgate Cardiac Institute")).toBeInTheDocument();
  });

  it("clinician name Dr. Sarah Okonkwo is shown", async () => {
    await renderHeader();
    expect(screen.getByText("Dr. Sarah Okonkwo, MD")).toBeInTheDocument();
  });

  it("notification bell has testid", async () => {
    await renderHeader();
    expect(screen.getByTestId("notification-bell")).toBeInTheDocument();
  });

  it("notification badge shows unread count", async () => {
    await renderHeader();
    const badge = screen.getByTestId("notification-badge");
    expect(badge).toBeInTheDocument();
    const count = parseInt(badge.textContent || "0");
    expect(count).toBeGreaterThan(0);
  });

  it("user menu trigger has testid", async () => {
    await renderHeader();
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });

  it("clicking notification bell opens the notification drawer", async () => {
    const user = userEvent.setup();
    await renderHeader();
    await user.click(screen.getByTestId("notification-bell"));
    await waitFor(() => {
      expect(screen.getByTestId("notification-drawer")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("notification drawer shows Notifications heading when open", async () => {
    const user = userEvent.setup();
    await renderHeader();
    await user.click(screen.getByTestId("notification-bell"));
    await waitFor(() => {
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("notification drawer has Mark all read button", async () => {
    const user = userEvent.setup();
    await renderHeader();
    await user.click(screen.getByTestId("notification-bell"));
    await waitFor(() => {
      expect(screen.getByTestId("button-mark-all-read")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("role-switcher menu item is present in user dropdown", async () => {
    const user = userEvent.setup();
    await renderHeader();
    await user.click(screen.getByTestId("user-menu"));
    await waitFor(() => {
      expect(screen.getByTestId("role-switcher")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("role-switcher menu item shows current role toggle", async () => {
    const user = userEvent.setup();
    await renderHeader();
    await user.click(screen.getByTestId("user-menu"));
    await waitFor(() => {
      const switcher = screen.getByTestId("role-switcher");
      expect(switcher.textContent).toMatch(/Admin|Clinician/i);
    }, { timeout: 2000 });
  });
});
