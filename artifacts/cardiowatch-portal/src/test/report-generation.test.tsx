import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(() => ({ pathname: "/patients/1", search: "", hash: "", state: null })),
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

async function renderReportModal(patientId = "1", isOpen = true) {
  const { ReportModal } = await import("../components/ReportModal");
  const onClose = vi.fn();
  const result = render(<ReportModal isOpen={isOpen} onClose={onClose} patientId={patientId} />);
  return { ...result, onClose };
}

async function renderPatientDetail(id = "1") {
  const { default: PatientDetail } = await import("../pages/patient-detail");
  return render(<PatientDetail params={{ id }} />);
}

async function openReportModalFromPatientDetail(id = "1") {
  const user = userEvent.setup();
  await renderPatientDetail(id);
  await user.click(screen.getByTestId("button-generate-report"));
  await waitFor(() => {
    expect(screen.getByTestId("report-modal")).toBeInTheDocument();
  }, { timeout: 2000 });
  return user;
}

describe("Report Generation — modal component (direct render)", () => {
  it("report modal renders when isOpen=true", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("report-modal")).toBeInTheDocument();
  });

  it("report modal shows Generate Clinical Report heading", async () => {
    await renderReportModal("1", true);
    expect(screen.getByText(/Generate Clinical Report/i)).toBeInTheDocument();
  });

  it("report-modal shows patient name Eleanor Voss", async () => {
    await renderReportModal("1", true);
    expect(screen.getByText(/Eleanor Voss/)).toBeInTheDocument();
  });

  it("report modal shows reporting period select trigger", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("select-report-period")).toBeInTheDocument();
  });

  it("report modal shows recipient select trigger", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("select-recipient")).toBeInTheDocument();
  });

  it("report modal shows summary checkbox", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("checkbox-summary")).toBeInTheDocument();
  });

  it("report modal shows event log checkbox", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("checkbox-event-log")).toBeInTheDocument();
  });

  it("report modal shows ECG excerpts checkbox", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("checkbox-ecg-excerpts")).toBeInTheDocument();
  });

  it("report modal shows trend charts checkbox", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("checkbox-trend-charts")).toBeInTheDocument();
  });

  it("report modal shows generate button", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("button-generate")).toBeInTheDocument();
  });

  it("report modal shows cancel button", async () => {
    await renderReportModal("1", true);
    expect(screen.getByTestId("button-cancel-report")).toBeInTheDocument();
  });
});

describe("Report Generation — checkbox defaults", () => {
  it("summary checkbox is checked by default", async () => {
    await renderReportModal("1", true);
    const checkbox = screen.getByTestId("checkbox-summary");
    expect(checkbox.getAttribute("data-state")).toBe("checked");
  });

  it("event log checkbox is checked by default", async () => {
    await renderReportModal("1", true);
    const checkbox = screen.getByTestId("checkbox-event-log");
    expect(checkbox.getAttribute("data-state")).toBe("checked");
  });

  it("trend charts checkbox is checked by default", async () => {
    await renderReportModal("1", true);
    const checkbox = screen.getByTestId("checkbox-trend-charts");
    expect(checkbox.getAttribute("data-state")).toBe("checked");
  });

  it("summary checkbox can be unchecked", async () => {
    const user = userEvent.setup();
    await renderReportModal("1", true);
    const checkbox = screen.getByTestId("checkbox-summary");
    expect(checkbox.getAttribute("data-state")).toBe("checked");
    await user.click(checkbox);
    await waitFor(() => {
      expect(checkbox.getAttribute("data-state")).toBe("unchecked");
    }, { timeout: 1000 });
  });
});

describe("Report Generation — cancel behavior", () => {
  it("clicking cancel calls onClose", async () => {
    const user = userEvent.setup();
    const { onClose } = await renderReportModal("1", true);
    await user.click(screen.getByTestId("button-cancel-report"));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("Report Generation — submit and success", () => {
  it("clicking Generate button triggers generating state", async () => {
    const user = userEvent.setup();
    await renderReportModal("1", true);
    await user.click(screen.getByTestId("button-generate"));
    await waitFor(() => {
      const btn = screen.queryByTestId("button-generate");
      const isDisabled = btn?.hasAttribute("disabled");
      const showingSuccess = screen.queryByTestId("report-success");
      expect(isDisabled || showingSuccess).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("clicking Generate button eventually shows report-success state", async () => {
    const user = userEvent.setup();
    await renderReportModal("1", true);
    await user.click(screen.getByTestId("button-generate"));
    await waitFor(() => {
      expect(screen.getByTestId("report-success")).toBeInTheDocument();
    }, { timeout: 3500 });
  });

  it("report-success message contains success language", async () => {
    const user = userEvent.setup();
    await renderReportModal("1", true);
    await user.click(screen.getByTestId("button-generate"));
    await waitFor(() => {
      const el = screen.getByTestId("report-success");
      expect(el.textContent).toMatch(/Report generated|success|Download/i);
    }, { timeout: 3500 });
  });

  it("can generate report for patient 2 (Marcus Tran)", async () => {
    const user = userEvent.setup();
    await renderReportModal("2", true);
    expect(screen.getByText(/Marcus Tran/)).toBeInTheDocument();
    await user.click(screen.getByTestId("button-generate"));
    await waitFor(() => {
      expect(screen.getByTestId("report-success")).toBeInTheDocument();
    }, { timeout: 3500 });
  });

  it("can generate report for patient 3 (Rosario Delgado)", async () => {
    const user = userEvent.setup();
    await renderReportModal("3", true);
    await user.click(screen.getByTestId("button-generate"));
    await waitFor(() => {
      expect(screen.getByTestId("report-success")).toBeInTheDocument();
    }, { timeout: 3500 });
  });
});

describe("Report Generation — patient detail page integration", () => {
  it("generate-report button is present on patient 1 detail page", async () => {
    await renderPatientDetail("1");
    expect(screen.getByTestId("button-generate-report")).toBeInTheDocument();
  });

  it("clicking button-generate-report opens the report modal", async () => {
    await openReportModalFromPatientDetail("1");
    expect(screen.getByTestId("report-modal")).toBeInTheDocument();
  });

  it("report modal opened from detail has checkboxes", async () => {
    await openReportModalFromPatientDetail("1");
    expect(screen.getByTestId("checkbox-summary")).toBeInTheDocument();
  });
});
