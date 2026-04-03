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

async function renderHistoryTab(patientId = "1") {
  const { HistoryTab } = await import("../components/patient/history-tab");
  return render(<HistoryTab patientId={patientId} />);
}

async function renderPatientDetailOnHistoryTab(id = "1") {
  const { default: PatientDetail } = await import("../pages/patient-detail");
  const result = render(<PatientDetail params={{ id }} />);
  const user = userEvent.setup();
  const historyTab = screen.getByRole("tab", { name: /History/i });
  await user.click(historyTab);
  return result;
}

describe("History Tab — rendering", () => {
  it("history tab renders without crashing", async () => {
    const { container } = await renderHistoryTab("1");
    expect(container.firstChild).not.toBeNull();
  });

  it("history list container is present", async () => {
    await renderHistoryTab("1");
    expect(screen.getByTestId("history-list")).toBeInTheDocument();
  });

  it("history filter is present", async () => {
    await renderHistoryTab("1");
    expect(screen.getByTestId("history-filter")).toBeInTheDocument();
  });

  it("history count is displayed", async () => {
    await renderHistoryTab("1");
    expect(screen.getByTestId("history-count")).toBeInTheDocument();
  });

  it("history count is a positive number", async () => {
    await renderHistoryTab("1");
    const count = screen.getByTestId("history-count");
    const n = parseInt(count.textContent?.replace(/\D/g, "") || "0");
    expect(n).toBeGreaterThan(0);
  });
});

describe("History Tab — content", () => {
  it("history list shows entries from data", async () => {
    await renderHistoryTab("1");
    const { getPatientHistory } = await import("../data/history");
    const history = getPatientHistory("1");
    expect(history.length).toBeGreaterThan(0);
    const list = screen.getByTestId("history-list");
    expect(list.children.length).toBeGreaterThan(0);
  });

  it("history entries show actor names", async () => {
    await renderHistoryTab("1");
    const { getPatientHistory } = await import("../data/history");
    const history = getPatientHistory("1");
    const firstEntry = history[0];
    expect(screen.getAllByText(new RegExp(firstEntry.actor, "i")).length).toBeGreaterThan(0);
  });

  it("history entries show action descriptions", async () => {
    await renderHistoryTab("1");
    const { getPatientHistory } = await import("../data/history");
    const history = getPatientHistory("1");
    const firstEntry = history[0];
    expect(screen.getAllByText(new RegExp(firstEntry.action.substring(0, 20), "i")).length).toBeGreaterThan(0);
  });

  it("history includes system actions", async () => {
    await renderHistoryTab("1");
    const { getPatientHistory } = await import("../data/history");
    const history = getPatientHistory("1");
    const systemActions = history.filter(h => h.type === "System");
    if (systemActions.length > 0) {
      const allText = document.body.textContent || "";
      expect(allText).toMatch(/System|system/i);
    }
  });
});

describe("History Tab — filtering", () => {
  it("history filter defaults to All", async () => {
    await renderHistoryTab("1");
    const filter = screen.getByTestId("history-filter");
    expect(filter.textContent).toMatch(/All/i);
  });

  it("Clinician history entries exist in data", async () => {
    const { getPatientHistory } = await import("../data/history");
    const allHistory = getPatientHistory("1");
    const clinicianEntries = allHistory.filter(h => h.type === "Clinician");
    expect(clinicianEntries.length).toBeGreaterThan(0);
    expect(clinicianEntries.length).toBeLessThan(allHistory.length);
  });
});

describe("History Tab — via patient detail page", () => {
  it("history list renders from patient detail page", async () => {
    await renderPatientDetailOnHistoryTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("history-list")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("history filter is accessible from patient detail", async () => {
    await renderPatientDetailOnHistoryTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("history-filter")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("history count shows on patient detail", async () => {
    await renderPatientDetailOnHistoryTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("history-count")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
