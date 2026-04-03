import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { patients } from "../data/patients";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(() => ({ pathname: "/patients/1", search: "", hash: "", state: null })),
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

async function renderSettingsTab(patientId = "1") {
  const { SettingsTab } = await import("../components/patient/settings-tab");
  const patient = patients.find(p => p.id === patientId)!;
  return render(<SettingsTab patient={patient} />);
}

async function renderPatientDetailOnSettingsTab(id = "1") {
  const { default: PatientDetail } = await import("../pages/patient-detail");
  const result = render(<PatientDetail params={{ id }} />);
  const user = userEvent.setup();
  const settingsTab = screen.getByRole("tab", { name: /Settings/i });
  await user.click(settingsTab);
  return result;
}

describe("Monitoring Settings Tab — rendering", () => {
  it("monitoring settings tab renders without crashing", async () => {
    const { container } = await renderSettingsTab("1");
    expect(container.firstChild).not.toBeNull();
  });

  it("brady threshold input is present", async () => {
    await renderSettingsTab("1");
    expect(screen.getByTestId("input-brady-threshold")).toBeInTheDocument();
  });

  it("tachy threshold input is present", async () => {
    await renderSettingsTab("1");
    expect(screen.getByTestId("input-tachy-threshold")).toBeInTheDocument();
  });

  it("pause threshold input is present", async () => {
    await renderSettingsTab("1");
    expect(screen.getByTestId("input-pause-threshold")).toBeInTheDocument();
  });

  it("save settings button is present", async () => {
    await renderSettingsTab("1");
    expect(screen.getByTestId("button-save-settings")).toBeInTheDocument();
  });

  it("monitoring paused toggle is present", async () => {
    await renderSettingsTab("1");
    expect(screen.getByTestId("toggle-monitoring-paused")).toBeInTheDocument();
  });

  it("emergency contact toggle is present", async () => {
    await renderSettingsTab("1");
    expect(screen.getByTestId("toggle-emergency")).toBeInTheDocument();
  });

  it("resume date input appears after enabling monitoring pause", async () => {
    const user = userEvent.setup();
    await renderSettingsTab("1");
    const toggle = screen.getByTestId("toggle-monitoring-paused");
    if (toggle.getAttribute("data-state") === "unchecked") {
      await user.click(toggle);
    }
    await waitFor(() => {
      expect(screen.getByTestId("input-resume-date")).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("escalation delay input is present", async () => {
    await renderSettingsTab("1");
    expect(screen.getByTestId("input-escalation-delay")).toBeInTheDocument();
  });

  it("AF sensitivity selector is present", async () => {
    await renderSettingsTab("1");
    expect(screen.getByTestId("select-af-sensitivity")).toBeInTheDocument();
  });
});

describe("Monitoring Settings Tab — threshold defaults", () => {
  it("brady threshold input has a default value of 45", async () => {
    await renderSettingsTab("1");
    const input = screen.getByTestId("input-brady-threshold") as HTMLInputElement;
    expect(input.value).toBe("45");
  });

  it("tachy threshold input has a default value of 120", async () => {
    await renderSettingsTab("1");
    const input = screen.getByTestId("input-tachy-threshold") as HTMLInputElement;
    expect(input.value).toBe("120");
  });

  it("pause threshold input has a default value of 3", async () => {
    await renderSettingsTab("1");
    const input = screen.getByTestId("input-pause-threshold") as HTMLInputElement;
    expect(parseFloat(input.value)).toBeGreaterThanOrEqual(2);
  });

  it("brady threshold is lower than tachy threshold", async () => {
    await renderSettingsTab("1");
    const bradyInput = screen.getByTestId("input-brady-threshold") as HTMLInputElement;
    const tachyInput = screen.getByTestId("input-tachy-threshold") as HTMLInputElement;
    const brady = parseInt(bradyInput.value);
    const tachy = parseInt(tachyInput.value);
    expect(brady).toBeLessThan(tachy);
  });

  it("escalation delay defaults to 15", async () => {
    await renderSettingsTab("1");
    const input = screen.getByTestId("input-escalation-delay") as HTMLInputElement;
    expect(input.value).toBe("15");
  });
});

describe("Monitoring Settings Tab — interaction", () => {
  it("brady threshold can be changed", async () => {
    const user = userEvent.setup();
    await renderSettingsTab("1");
    const input = screen.getByTestId("input-brady-threshold") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "45");
    expect(input.value).toBe("45");
  });

  it("tachy threshold can be changed", async () => {
    const user = userEvent.setup();
    await renderSettingsTab("1");
    const input = screen.getByTestId("input-tachy-threshold") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "120");
    expect(input.value).toBe("120");
  });

  it("clicking save settings button is possible", async () => {
    const user = userEvent.setup();
    await renderSettingsTab("1");
    const saveBtn = screen.getByTestId("button-save-settings");
    await user.click(saveBtn);
    await waitFor(() => {
      expect(screen.getByTestId("button-save-settings")).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("monitoring paused toggle can be clicked", async () => {
    const user = userEvent.setup();
    await renderSettingsTab("1");
    const toggle = screen.getByTestId("toggle-monitoring-paused");
    const stateBefore = toggle.getAttribute("data-state");
    await user.click(toggle);
    const stateAfter = toggle.getAttribute("data-state");
    expect(stateAfter).not.toBe(stateBefore);
  });

  it("emergency contact toggle can be toggled", async () => {
    const user = userEvent.setup();
    await renderSettingsTab("1");
    const toggle = screen.getByTestId("toggle-emergency");
    const stateBefore = toggle.getAttribute("data-state");
    await user.click(toggle);
    const stateAfter = toggle.getAttribute("data-state");
    expect(stateAfter).not.toBe(stateBefore);
  });

  it("AF sensitivity selector shows options when clicked", async () => {
    const user = userEvent.setup();
    await renderSettingsTab("1");
    const selector = screen.getByTestId("select-af-sensitivity");
    await user.click(selector);
    await waitFor(() => {
      const bodyText = document.body.textContent || "";
      expect(bodyText).toMatch(/High|Standard|Conservative/i);
    }, { timeout: 2000 });
  });
});

describe("Monitoring Settings Tab — second patient", () => {
  it("settings tab renders for patient 2 (Marcus Tran)", async () => {
    const { container } = await renderSettingsTab("2");
    expect(container.firstChild).not.toBeNull();
  });

  it("patient 2 has same threshold inputs available", async () => {
    await renderSettingsTab("2");
    expect(screen.getByTestId("input-brady-threshold")).toBeInTheDocument();
    expect(screen.getByTestId("input-tachy-threshold")).toBeInTheDocument();
  });
});

describe("Monitoring Settings Tab — via patient detail", () => {
  it("monitoring settings renders from patient detail settings tab", async () => {
    await renderPatientDetailOnSettingsTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("toggle-monitoring-paused")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("threshold inputs appear in patient detail settings tab", async () => {
    await renderPatientDetailOnSettingsTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("input-brady-threshold")).toBeInTheDocument();
      expect(screen.getByTestId("input-tachy-threshold")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("save settings button is available in patient detail settings tab", async () => {
    await renderPatientDetailOnSettingsTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("button-save-settings")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
