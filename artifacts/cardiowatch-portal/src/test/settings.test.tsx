import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(() => ({ pathname: "/settings", search: "", hash: "", state: null })),
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(() => ({ id: "1" })),
  useMatch: vi.fn(() => null),
  Link: ({ children, to, href, onClick }: any) => (
    <a href={to || href} onClick={onClick}>{children}</a>
  ),
  Navigate: () => null,
  MemoryRouter: ({ children }: any) => <>{children}</>,
  Routes: ({ children }: any) => <>{children}</>,
  Route: ({ element }: any) => <>{element}</>,
  BrowserRouter: ({ children }: any) => <>{children}</>,
}));

vi.mock("../lib/auth-context", async (importActual) => {
  const actual = await importActual<typeof import("../lib/auth-context")>();
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      role: "Clinician" as "Clinician" | "Admin",
      setRole: vi.fn(),
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })),
  };
});

async function renderSettings() {
  const { default: Settings } = await import("../pages/settings");
  return render(<Settings />);
}

async function renderSettingsAsAdmin() {
  const authModule = await import("../lib/auth-context");
  vi.mocked(authModule.useAuth).mockReturnValue({
    role: "Admin",
    setRole: vi.fn(),
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  });
  const { default: Settings } = await import("../pages/settings");
  return render(<Settings />);
}

beforeEach(() => {
  vi.resetModules();
});

describe("Settings Page — rendering", () => {
  it("settings page renders without crashing", async () => {
    const { container } = await renderSettings();
    expect(container.firstChild).not.toBeNull();
  });

  it("Settings heading is present", async () => {
    await renderSettings();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("user-profile-section is present", async () => {
    await renderSettings();
    expect(screen.getByTestId("user-profile-section")).toBeInTheDocument();
  });

  it("My Profile section heading is shown", async () => {
    await renderSettings();
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
  });
});

describe("Settings Page — notification toggles", () => {
  it("in-app alerts toggle is present", async () => {
    await renderSettings();
    expect(screen.getByTestId("toggle-inapp-alerts")).toBeInTheDocument();
  });

  it("email alerts toggle is present", async () => {
    await renderSettings();
    expect(screen.getByTestId("toggle-email-alerts")).toBeInTheDocument();
  });

  it("SMS alerts toggle is present", async () => {
    await renderSettings();
    expect(screen.getByTestId("toggle-sms-alerts")).toBeInTheDocument();
  });

  it("in-app alerts toggle is checked by default", async () => {
    await renderSettings();
    const toggle = screen.getByTestId("toggle-inapp-alerts");
    expect(toggle.getAttribute("data-state")).toBe("checked");
  });

  it("SMS alerts toggle is unchecked by default", async () => {
    await renderSettings();
    const toggle = screen.getByTestId("toggle-sms-alerts");
    expect(toggle.getAttribute("data-state")).toBe("unchecked");
  });

  it("email alerts toggle is checked by default", async () => {
    await renderSettings();
    const toggle = screen.getByTestId("toggle-email-alerts");
    expect(toggle.getAttribute("data-state")).toBe("checked");
  });

  it("clicking in-app toggle changes its state", async () => {
    const user = userEvent.setup();
    await renderSettings();
    const toggle = screen.getByTestId("toggle-inapp-alerts");
    const stateBefore = toggle.getAttribute("data-state");
    await user.click(toggle);
    const stateAfter = toggle.getAttribute("data-state");
    expect(stateAfter).not.toBe(stateBefore);
  });
});

describe("Settings Page — clinician profile data", () => {
  it("clinician name Okonkwo appears in input fields", async () => {
    await renderSettings();
    const allInputs = document.querySelectorAll("input");
    const nameInput = Array.from(allInputs).find(i =>
      i.value.includes("Okonkwo") || i.value.includes("Sarah")
    );
    expect(nameInput).toBeTruthy();
  });

  it("clinician email address is shown as an input value", async () => {
    await renderSettings();
    expect(screen.getByDisplayValue(/s\.okonkwo@northgate\.edu/i)).toBeInTheDocument();
  });

  it("clinician role Attending Cardiologist appears", async () => {
    await renderSettings();
    const el = screen.queryByDisplayValue(/Attending Cardiologist/i) ||
               screen.queryByText(/Attending Cardiologist/i);
    expect(el).toBeTruthy();
  });
});

describe("Settings Page — practice administration (Admin role)", () => {
  it("practice-admin-section does NOT render for Clinician role", async () => {
    await renderSettings();
    expect(screen.queryByTestId("practice-admin-section")).not.toBeInTheDocument();
  });

  it("practice-admin-section DOES render for Admin role", async () => {
    await renderSettingsAsAdmin();
    expect(screen.getByTestId("practice-admin-section")).toBeInTheDocument();
  });

  it("Practice Administration heading appears for Admin role", async () => {
    await renderSettingsAsAdmin();
    expect(screen.getByText(/Practice Administration/i)).toBeInTheDocument();
  });

  it("invite user button is present for Admin role", async () => {
    await renderSettingsAsAdmin();
    expect(screen.getByTestId("button-invite-user")).toBeInTheDocument();
  });

  it("user table shows Dr. James Ritter for Admin role", async () => {
    await renderSettingsAsAdmin();
    expect(screen.getByText(/Dr\. James Ritter/i)).toBeInTheDocument();
  });

  it("user table shows Jennifer Calás for Admin role", async () => {
    await renderSettingsAsAdmin();
    const el = screen.queryByText(/Jennifer Cal/i);
    expect(el).toBeTruthy();
  });

  it("Northgate Cardiac Institute input appears in Admin view", async () => {
    await renderSettingsAsAdmin();
    expect(screen.getByDisplayValue(/Northgate Cardiac Institute/i)).toBeInTheDocument();
  });
});
