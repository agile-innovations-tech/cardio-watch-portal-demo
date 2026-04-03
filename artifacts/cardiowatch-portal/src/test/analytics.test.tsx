import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(() => ({ pathname: "/analytics", search: "", hash: "", state: null })),
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

async function renderAnalytics() {
  const { default: Analytics } = await import("../pages/analytics");
  return render(<Analytics />);
}

describe("Population Analytics — page rendering", () => {
  it("analytics page renders without crashing", async () => {
    const { container } = await renderAnalytics();
    expect(container.firstChild).not.toBeNull();
  });

  it("Population Analytics heading is present", async () => {
    await renderAnalytics();
    expect(screen.getByText(/Population Analytics/i)).toBeInTheDocument();
  });

  it("Data Export button is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("button-export")).toBeInTheDocument();
  });
});

describe("Population Analytics — summary metrics", () => {
  it("patient-days metric card is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("metric-patient-days")).toBeInTheDocument();
  });

  it("patient-days displays a positive value", async () => {
    await renderAnalytics();
    const card = screen.getByTestId("metric-patient-days");
    const text = card.textContent || "";
    expect(text).toMatch(/\d/);
  });

  it("total-events metric card is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("metric-total-events")).toBeInTheDocument();
  });

  it("total-events shows the correct value from data", async () => {
    await renderAnalytics();
    const { analyticsSummary } = await import("../data/analytics");
    const card = screen.getByTestId("metric-total-events");
    expect(card.textContent).toContain(analyticsSummary.totalEvents.toLocaleString());
  });

  it("confirmed-events metric card is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("metric-confirmed")).toBeInTheDocument();
  });

  it("dismissed-events metric card is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("metric-dismissed")).toBeInTheDocument();
  });

  it("turnaround metric card is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("metric-turnaround")).toBeInTheDocument();
  });

  it("compliance metric card is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("metric-compliance")).toBeInTheDocument();
  });

  it("compliance card shows percentage value", async () => {
    await renderAnalytics();
    const card = screen.getByTestId("metric-compliance");
    expect(card.textContent).toMatch(/%/);
  });
});

describe("Population Analytics — charts", () => {
  it("event volume chart is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("chart-event-volume")).toBeInTheDocument();
  });

  it("classification breakdown chart is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("chart-classification")).toBeInTheDocument();
  });

  it("turnaround distribution chart is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("chart-turnaround-dist")).toBeInTheDocument();
  });

  it("compliance by patient chart is present", async () => {
    await renderAnalytics();
    expect(screen.getByTestId("chart-compliance-by-patient")).toBeInTheDocument();
  });
});

describe("Population Analytics — export", () => {
  it("Data Export button has correct label", async () => {
    await renderAnalytics();
    const btn = screen.getByTestId("button-export");
    expect(btn.textContent).toMatch(/Data Export/i);
  });

  it("clicking Data Export button triggers export", async () => {
    const user = userEvent.setup();
    await renderAnalytics();
    const btn = screen.getByTestId("button-export");
    await user.click(btn);
    await waitFor(() => {
      expect(btn).toBeDisabled();
    }, { timeout: 500 });
  });

  it("export button becomes re-enabled after export completes", async () => {
    const user = userEvent.setup();
    await renderAnalytics();
    const btn = screen.getByTestId("button-export");
    await user.click(btn);
    await waitFor(() => {
      expect(btn).not.toBeDisabled();
    }, { timeout: 3000 });
  });
});
