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

async function renderHeader() {
  const { Header } = await import("../components/layout/header");
  const { AuthProvider } = await import("../lib/auth-context");
  return render(<AuthProvider><Header /></AuthProvider>);
}

async function renderDrawerOpen() {
  const { NotificationDrawer } = await import("../components/layout/notification-drawer");
  const { notifications } = await import("../data/notifications");
  const setNotifications = vi.fn();
  return { result: render(
    <NotificationDrawer
      open={true}
      onOpenChange={vi.fn()}
      notifications={notifications}
      setNotifications={setNotifications}
    />
  ), setNotifications, notifications };
}

describe("Notification System — bell and badge in header", () => {
  it("notification bell renders with correct testid", async () => {
    await renderHeader();
    expect(screen.getByTestId("notification-bell")).toBeInTheDocument();
  });

  it("notification badge renders with correct testid", async () => {
    await renderHeader();
    expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
  });

  it("notification badge displays a positive integer count", async () => {
    await renderHeader();
    const badge = screen.getByTestId("notification-badge");
    const count = parseInt(badge.textContent || "0");
    expect(count).toBeGreaterThan(0);
  });

  it("notification badge count equals the number of unread notifications", async () => {
    await renderHeader();
    const { notifications } = await import("../data/notifications");
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = screen.getByTestId("notification-badge");
    expect(parseInt(badge.textContent || "0")).toBe(unreadCount);
  });

  it("clicking notification bell opens the notification drawer", async () => {
    const user = userEvent.setup();
    await renderHeader();
    await user.click(screen.getByTestId("notification-bell"));
    await waitFor(() => {
      expect(screen.getByTestId("notification-drawer")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("notification drawer shows Notifications heading after bell click", async () => {
    const user = userEvent.setup();
    await renderHeader();
    await user.click(screen.getByTestId("notification-bell"));
    await waitFor(() => {
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("notification drawer shows mark-all-read button after bell click", async () => {
    const user = userEvent.setup();
    await renderHeader();
    await user.click(screen.getByTestId("notification-bell"));
    await waitFor(() => {
      expect(screen.getByTestId("button-mark-all-read")).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});

describe("Notification System — drawer content", () => {
  it("notification drawer renders when open=true", async () => {
    await renderDrawerOpen();
    expect(screen.getByTestId("notification-drawer")).toBeInTheDocument();
  });

  it("drawer shows Notifications heading", async () => {
    await renderDrawerOpen();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("drawer shows Mark all read button", async () => {
    await renderDrawerOpen();
    expect(screen.getByTestId("button-mark-all-read")).toBeInTheDocument();
  });

  it("drawer shows the first notification message from data", async () => {
    const { notifications } = await renderDrawerOpen();
    expect(screen.getByText(notifications[0].message)).toBeInTheDocument();
  });

  it("drawer shows Eleanor Voss notification", async () => {
    await renderDrawerOpen();
    expect(screen.getByText(/Eleanor Voss/)).toBeInTheDocument();
  });

  it("drawer shows Patricia Huang battery notification", async () => {
    await renderDrawerOpen();
    const { notifications } = await import("../data/notifications");
    const batNotif = notifications.find(n => n.message.includes("Patricia Huang"));
    expect(batNotif).toBeDefined();
    expect(screen.getByText(batNotif!.message)).toBeInTheDocument();
  });

  it("drawer shows at least 6 notification messages", async () => {
    await renderDrawerOpen();
    const { notifications } = await import("../data/notifications");
    const displayed = notifications.filter(n => screen.queryByText(n.message));
    expect(displayed.length).toBeGreaterThanOrEqual(6);
  });

  it("critical notifications are rendered", async () => {
    await renderDrawerOpen();
    const { notifications } = await import("../data/notifications");
    const critical = notifications.filter(n => n.severity === "critical");
    expect(critical.length).toBeGreaterThan(0);
    expect(screen.getByText(critical[0].message)).toBeInTheDocument();
  });

  it("info notifications are rendered", async () => {
    await renderDrawerOpen();
    const { notifications } = await import("../data/notifications");
    const info = notifications.filter(n => n.severity === "info");
    expect(info.length).toBeGreaterThan(0);
    expect(screen.getByText(info[0].message)).toBeInTheDocument();
  });
});

describe("Notification System — mark all read", () => {
  it("clicking Mark all read calls setNotifications once", async () => {
    const user = userEvent.setup();
    const { setNotifications } = await renderDrawerOpen();
    await user.click(screen.getByTestId("button-mark-all-read"));
    expect(setNotifications).toHaveBeenCalledTimes(1);
  });

  it("mark all read sets every notification to read=true", async () => {
    const user = userEvent.setup();
    const { setNotifications } = await renderDrawerOpen();
    await user.click(screen.getByTestId("button-mark-all-read"));
    const updatedNotifications = setNotifications.mock.calls[0][0] as Array<{read: boolean}>;
    expect(updatedNotifications.every(n => n.read)).toBe(true);
  });

  it("after mark all read via header, notification badge disappears", async () => {
    const user = userEvent.setup();
    await renderHeader();
    expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
    await user.click(screen.getByTestId("notification-bell"));
    await waitFor(() => {
      expect(screen.getByTestId("button-mark-all-read")).toBeInTheDocument();
    }, { timeout: 2000 });
    await user.click(screen.getByTestId("button-mark-all-read"));
    await waitFor(() => {
      expect(screen.queryByTestId("notification-badge")).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
