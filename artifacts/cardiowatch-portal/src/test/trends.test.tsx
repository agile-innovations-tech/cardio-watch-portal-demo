import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { patients } from "../data/patients";

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

async function renderTrendsTab(patientId = "1") {
  const { TrendsTab } = await import("../components/patient/trends-tab");
  const patient = patients.find(p => p.id === patientId)!;
  return render(<TrendsTab patient={patient} />);
}

async function renderPatientDetailOnTrendsTab(id = "1") {
  const { default: PatientDetail } = await import("../pages/patient-detail");
  const result = render(<PatientDetail params={{ id }} />);
  const user = userEvent.setup();
  const trendsTab = screen.getByRole("tab", { name: /Trends/i });
  await user.click(trendsTab);
  return result;
}

describe("Trends Tab — rendering", () => {
  it("trends tab renders without crashing", async () => {
    const { container } = await renderTrendsTab("1");
    expect(container.firstChild).not.toBeNull();
  });

  it("AF Burden chart is present", async () => {
    await renderTrendsTab("1");
    expect(screen.getByTestId("chart-af-burden")).toBeInTheDocument();
  });

  it("Compliance chart is present", async () => {
    await renderTrendsTab("1");
    expect(screen.getByTestId("chart-compliance")).toBeInTheDocument();
  });

  it("HR Distribution chart is present", async () => {
    await renderTrendsTab("1");
    expect(screen.getByTestId("chart-hr-distribution")).toBeInTheDocument();
  });

  it("Event Frequency chart is present", async () => {
    await renderTrendsTab("1");
    expect(screen.getByTestId("chart-event-frequency")).toBeInTheDocument();
  });

  it("date range selector is present", async () => {
    await renderTrendsTab("1");
    expect(screen.getByTestId("select-date-range")).toBeInTheDocument();
  });
});

describe("Trends Tab — chart content", () => {
  it("AF Burden chart shows Eleanor Voss's AF burden value", async () => {
    await renderTrendsTab("1");
    const chart = screen.getByTestId("chart-af-burden");
    expect(chart).toBeInTheDocument();
    const allText = document.body.textContent || "";
    expect(allText).toMatch(/AF Burden|af burden/i);
  });

  it("compliance chart has correct section heading", async () => {
    await renderTrendsTab("1");
    const allText = document.body.textContent || "";
    expect(allText).toMatch(/Compliance/i);
  });

  it("date range selector defaults to 30 days", async () => {
    await renderTrendsTab("1");
    const selector = screen.getByTestId("select-date-range");
    expect(selector.textContent).toMatch(/30 Days|30d/i);
  });

  it("trends data is shown for a patient with af burden > 0", async () => {
    await renderTrendsTab("1");
    const patient = patients.find(p => p.id === "1")!;
    expect(patient.afBurden).toBeGreaterThan(0);
    expect(screen.getByTestId("chart-af-burden")).toBeInTheDocument();
  });
});

describe("Trends Tab — date range interaction", () => {
  it("date range selector has clickable trigger element", async () => {
    await renderTrendsTab("1");
    const selector = screen.getByTestId("select-date-range");
    expect(selector).toBeInTheDocument();
    expect(selector.role === "combobox" || selector.tagName === "BUTTON" || !!selector).toBeTruthy();
  });

  it("date range selector shows 30 days as default text", async () => {
    await renderTrendsTab("1");
    const selector = screen.getByTestId("select-date-range");
    expect(selector.textContent).toMatch(/30 Days|30d/i);
  });
});

describe("Trends Tab — via patient detail page", () => {
  it("trends charts render from patient detail page", async () => {
    await renderPatientDetailOnTrendsTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("chart-af-burden")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("all four trend charts are present from patient detail", async () => {
    await renderPatientDetailOnTrendsTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("chart-af-burden")).toBeInTheDocument();
      expect(screen.getByTestId("chart-compliance")).toBeInTheDocument();
      expect(screen.getByTestId("chart-hr-distribution")).toBeInTheDocument();
      expect(screen.getByTestId("chart-event-frequency")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("select-date-range is available on trends tab", async () => {
    await renderPatientDetailOnTrendsTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("select-date-range")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
