import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

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

async function renderPatientDetail(id = "1") {
  const { default: PatientDetail } = await import("../pages/patient-detail");
  return render(<PatientDetail params={{ id }} />);
}

describe("Patient Detail — header and overview", () => {
  it("patient detail page renders without crashing", async () => {
    const { container } = await renderPatientDetail();
    expect(container.firstChild).not.toBeNull();
  });

  it("Eleanor Voss name is displayed in the header", async () => {
    await renderPatientDetail("1");
    expect(screen.getByText("Eleanor Voss")).toBeInTheDocument();
  });

  it("Eleanor Voss MRN is displayed", async () => {
    await renderPatientDetail("1");
    expect(screen.getByText(/10042891/)).toBeInTheDocument();
  });

  it("Eleanor Voss age is displayed", async () => {
    await renderPatientDetail("1");
    expect(screen.getAllByText(/72/).length).toBeGreaterThan(0);
  });

  it("Eleanor Voss diagnosis Paroxysmal AF is shown", async () => {
    await renderPatientDetail("1");
    expect(screen.getAllByText(/Paroxysmal AF/i).length).toBeGreaterThan(0);
  });

  it("Marcus Tran detail renders correctly", async () => {
    const { useParams } = await import("react-router-dom");
    vi.mocked(useParams).mockReturnValue({ id: "2" });
    await renderPatientDetail("2");
    expect(screen.getByText("Marcus Tran")).toBeInTheDocument();
  });

  it("generate report button is present", async () => {
    await renderPatientDetail("1");
    expect(screen.getByTestId("button-generate-report")).toBeInTheDocument();
  });

  it("message team button is present", async () => {
    await renderPatientDetail("1");
    expect(screen.getByTestId("button-message-team")).toBeInTheDocument();
  });

  it("adjust thresholds button is present", async () => {
    await renderPatientDetail("1");
    expect(screen.getByTestId("button-adjust-thresholds")).toBeInTheDocument();
  });

  it("nonexistent patient ID shows not found message", async () => {
    await renderPatientDetail("999");
    expect(screen.getByText(/Patient not found/i)).toBeInTheDocument();
  });
});

describe("Patient Detail — tabs", () => {
  it("Events tab is present", async () => {
    await renderPatientDetail("1");
    expect(screen.getAllByText(/Events/i).length).toBeGreaterThan(0);
  });

  it("ECG Viewer tab is present", async () => {
    await renderPatientDetail("1");
    expect(screen.getAllByText(/ECG Viewer/i).length).toBeGreaterThan(0);
  });

  it("Trends tab is present", async () => {
    await renderPatientDetail("1");
    expect(screen.getAllByText(/Trends/i).length).toBeGreaterThan(0);
  });

  it("History tab is present", async () => {
    await renderPatientDetail("1");
    expect(screen.getAllByText(/History/i).length).toBeGreaterThan(0);
  });

  it("Settings tab is present", async () => {
    await renderPatientDetail("1");
    expect(screen.getAllByText(/Settings/i).length).toBeGreaterThan(0);
  });

  it("Events tab is active by default and shows event filter", async () => {
    await renderPatientDetail("1");
    await waitFor(() => {
      expect(screen.getByTestId("select-event-filter")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("clicking Trends tab shows trend charts", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    const trendsTab = screen.getByRole("tab", { name: /Trends/i });
    await user.click(trendsTab);
    await waitFor(() => {
      expect(screen.getByTestId("chart-af-burden")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("clicking ECG Viewer tab shows ecg waveform", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    const ecgTab = screen.getByRole("tab", { name: /ECG Viewer/i });
    await user.click(ecgTab);
    await waitFor(() => {
      expect(screen.getByTestId("ecg-waveform")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("clicking History tab shows history list", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    const historyTab = screen.getByRole("tab", { name: /History/i });
    await user.click(historyTab);
    await waitFor(() => {
      expect(screen.getByTestId("history-list")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("clicking Settings tab shows monitoring settings", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    const settingsTab = screen.getByRole("tab", { name: /Settings/i });
    await user.click(settingsTab);
    await waitFor(() => {
      expect(screen.getByTestId("toggle-monitoring-paused")).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});

describe("Patient Detail — report generation modal", () => {
  it("clicking generate report button opens the modal", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    await user.click(screen.getByTestId("button-generate-report"));
    await waitFor(() => {
      expect(screen.getByTestId("report-modal")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("report modal shows select-report-period dropdown", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    await user.click(screen.getByTestId("button-generate-report"));
    await waitFor(() => {
      expect(screen.getByTestId("select-report-period")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("report modal shows checkbox for summary", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    await user.click(screen.getByTestId("button-generate-report"));
    await waitFor(() => {
      expect(screen.getByTestId("checkbox-summary")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("report modal has generate button", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    await user.click(screen.getByTestId("button-generate-report"));
    await waitFor(() => {
      expect(screen.getByTestId("button-generate")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("report modal has cancel button", async () => {
    const user = userEvent.setup();
    await renderPatientDetail("1");
    await user.click(screen.getByTestId("button-generate-report"));
    await waitFor(() => {
      expect(screen.getByTestId("button-cancel-report")).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
