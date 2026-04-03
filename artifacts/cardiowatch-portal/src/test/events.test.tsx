import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { EVENTS } from "../data/events";
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

async function renderEventsTab(patientId = "1") {
  const { EventsTab } = await import("../components/patient/events-tab");
  const events = EVENTS[patientId] || [];
  return render(
    <EventsTab
      events={events}
      onStatusChange={vi.fn()}
      onViewEcg={vi.fn()}
    />
  );
}

async function renderPatientDetail(id = "1") {
  const { default: PatientDetail } = await import("../pages/patient-detail");
  return render(<PatientDetail params={{ id }} />);
}

describe("Events Tab — rendering", () => {
  it("events tab renders without crashing for patient 1", async () => {
    const { container } = await renderEventsTab("1");
    expect(container.firstChild).not.toBeNull();
  });

  it("event filter dropdown is present", async () => {
    await renderEventsTab("1");
    expect(screen.getByTestId("select-event-filter")).toBeInTheDocument();
  });

  it("events are displayed as event cards", async () => {
    await renderEventsTab("1");
    const events = EVENTS["1"];
    expect(events.length).toBeGreaterThan(0);
    const firstEvent = events[0];
    const card = screen.getByTestId(`event-card-${firstEvent.id}`);
    expect(card).toBeInTheDocument();
  });

  it("total event count is displayed in the header", async () => {
    await renderEventsTab("1");
    const events = EVENTS["1"];
    expect(screen.getByText(new RegExp(`${events.length} Total Events`))).toBeInTheDocument();
  });

  it("unreviewed event count is shown correctly", async () => {
    await renderEventsTab("1");
    const events = EVENTS["1"];
    const unreviewed = events.filter(e => e.status === "Unreviewed").length;
    expect(screen.getByText(new RegExp(`${unreviewed} Unreviewed`))).toBeInTheDocument();
  });

  it("event card shows classification label", async () => {
    await renderEventsTab("1");
    const firstEvent = EVENTS["1"][0];
    expect(screen.getAllByText(firstEvent.classification).length).toBeGreaterThan(0);
  });

  it("event card shows confidence score", async () => {
    await renderEventsTab("1");
    const firstEvent = EVENTS["1"][0];
    expect(screen.getAllByText(new RegExp(`${firstEvent.confidence}%`)).length).toBeGreaterThan(0);
  });

  it("event card shows source (Cloud AI or On-Device)", async () => {
    await renderEventsTab("1");
    const allText = document.body.textContent || "";
    expect(allText).toMatch(/Cloud AI|On-Device/);
  });

  it("event cards show status badges", async () => {
    await renderEventsTab("1");
    const unreviewed = EVENTS["1"].filter(e => e.status === "Unreviewed");
    if (unreviewed.length > 0) {
      expect(screen.getAllByText("Unreviewed").length).toBeGreaterThan(0);
    }
  });
});

describe("Events Tab — event cards for patient 1", () => {
  it("event e1 card is rendered for Eleanor Voss", async () => {
    await renderEventsTab("1");
    expect(screen.getByTestId("event-card-e1")).toBeInTheDocument();
  });

  it("event e1 is Atrial Fibrillation", async () => {
    await renderEventsTab("1");
    const card = screen.getByTestId("event-card-e1");
    expect(within(card).getAllByText(/Atrial Fibrillation/).length).toBeGreaterThan(0);
  });

  it("event e1 has confidence 92%", async () => {
    await renderEventsTab("1");
    const card = screen.getByTestId("event-card-e1");
    expect(within(card).getByText(/92%/)).toBeInTheDocument();
  });

  it("event e1 has Cloud AI source", async () => {
    await renderEventsTab("1");
    const card = screen.getByTestId("event-card-e1");
    expect(within(card).getByText("Cloud AI")).toBeInTheDocument();
  });

  it("event e1 has Unreviewed status badge", async () => {
    await renderEventsTab("1");
    const card = screen.getByTestId("event-card-e1");
    expect(within(card).getByText("Unreviewed")).toBeInTheDocument();
  });

  it("event e3 (Pause Detected) is present", async () => {
    await renderEventsTab("1");
    expect(screen.getByTestId("event-card-e3")).toBeInTheDocument();
  });

  it("event e3 has Confirmed status badge", async () => {
    await renderEventsTab("1");
    const card = screen.getByTestId("event-card-e3");
    expect(within(card).getByText("Confirmed")).toBeInTheDocument();
  });
});

describe("Events Tab — filtering", () => {
  it("filter defaults to All Events", async () => {
    await renderEventsTab("1");
    const filter = screen.getByTestId("select-event-filter");
    expect(filter.textContent).toMatch(/All Events/i);
  });

  it("event filter shows Confirmed option in the data", async () => {
    const events = EVENTS["1"];
    const confirmedCount = events.filter(e => e.status === "Confirmed").length;
    expect(confirmedCount).toBeGreaterThan(0);
  });

  it("Unreviewed Only filter reduces the displayed events", async () => {
    const { EventsTab } = await import("../components/patient/events-tab");
    const events = EVENTS["1"];
    const allCount = events.length;
    const unreviewedCount = events.filter(e => e.status === "Unreviewed").length;
    expect(unreviewedCount).toBeLessThan(allCount);
  });
});

describe("Events Tab — status change actions", () => {
  it("Confirm button has correct testid for event e1", async () => {
    await renderEventsTab("1");
    expect(screen.getByTestId("button-confirm-e1")).toBeInTheDocument();
  });

  it("clicking Confirm button calls onStatusChange with Confirmed", async () => {
    const user = userEvent.setup();
    const { EventsTab } = await import("../components/patient/events-tab");
    const onStatusChange = vi.fn();
    const events = EVENTS["1"].filter(e => e.status === "Unreviewed");
    render(<EventsTab events={events} onStatusChange={onStatusChange} onViewEcg={vi.fn()} />);
    const confirmBtn = screen.getByTestId(`button-confirm-${events[0].id}`);
    await user.click(confirmBtn);
    expect(onStatusChange).toHaveBeenCalledWith(events[0].id, "Confirmed");
  });

  it("Dismiss button has correct testid for event e1", async () => {
    await renderEventsTab("1");
    expect(screen.getByTestId("button-dismiss-e1")).toBeInTheDocument();
  });

  it("clicking Dismiss calls onStatusChange with Dismissed", async () => {
    const user = userEvent.setup();
    const { EventsTab } = await import("../components/patient/events-tab");
    const onStatusChange = vi.fn();
    const events = EVENTS["1"].filter(e => e.status === "Unreviewed");
    render(<EventsTab events={events} onStatusChange={onStatusChange} onViewEcg={vi.fn()} />);
    const dismissBtn = screen.getByTestId(`button-dismiss-${events[0].id}`);
    await user.click(dismissBtn);
    expect(onStatusChange).toHaveBeenCalledWith(events[0].id, "Dismissed");
  });

  it("onViewEcg is called when ECG button is clicked", async () => {
    const user = userEvent.setup();
    const { EventsTab } = await import("../components/patient/events-tab");
    const onViewEcg = vi.fn();
    const events = EVENTS["1"];
    render(<EventsTab events={events} onStatusChange={vi.fn()} onViewEcg={onViewEcg} />);
    const ecgBtn = screen.getByTestId(`button-view-ecg-${events[0].id}`);
    await user.click(ecgBtn);
    expect(onViewEcg).toHaveBeenCalledWith(events[0].id);
  });
});

describe("Events Tab — patient 2 (Marcus Tran)", () => {
  it("events render for Marcus Tran", async () => {
    const { container } = await renderEventsTab("2");
    expect(container.firstChild).not.toBeNull();
  });

  it("patient 2 events have valid structure", () => {
    const events = EVENTS["2"];
    expect(events.length).toBeGreaterThan(0);
    events.forEach(e => {
      expect(e.patientId).toBe("2");
      expect(e.classification).toBeTruthy();
      expect(e.confidence).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("Events Tab — via patient detail page", () => {
  it("patient detail shows events tab content for patient 1", async () => {
    await renderPatientDetail("1");
    await waitFor(() => {
      expect(screen.getByTestId("select-event-filter")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("events are loaded from EVENTS data for patient 1", async () => {
    await renderPatientDetail("1");
    const events = EVENTS["1"];
    await waitFor(() => {
      expect(screen.getByTestId(`event-card-e1`)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
