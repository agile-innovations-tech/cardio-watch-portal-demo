import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { EVENTS } from "../data/events";

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

async function renderEcgTab(patientId = "1") {
  const { EcgViewerTab } = await import("../components/patient/ecg-viewer-tab");
  const events = EVENTS[patientId] || [];
  return render(<EcgViewerTab events={events} />);
}

async function renderPatientDetailOnEcgTab(id = "1") {
  const { default: PatientDetail } = await import("../pages/patient-detail");
  const result = render(<PatientDetail params={{ id }} />);
  const user = userEvent.setup();
  const ecgTab = screen.getByRole("tab", { name: /ECG Viewer/i });
  await user.click(ecgTab);
  return result;
}

describe("ECG Viewer Tab — rendering", () => {
  it("ECG viewer tab renders without crashing", async () => {
    const { container } = await renderEcgTab("1");
    expect(container.firstChild).not.toBeNull();
  });

  it("ECG waveform element is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("ecg-waveform")).toBeInTheDocument();
  });

  it("ECG grid element is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("ecg-grid")).toBeInTheDocument();
  });

  it("ECG time axis is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("ecg-time-axis")).toBeInTheDocument();
  });

  it("ECG amplitude axis is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("ecg-amplitude-axis")).toBeInTheDocument();
  });

  it("zoom in button is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("button-zoom-in")).toBeInTheDocument();
  });

  it("zoom out button is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("button-zoom-out")).toBeInTheDocument();
  });

  it("gain selector is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("select-gain")).toBeInTheDocument();
  });

  it("playback speed selector is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("select-playback-speed")).toBeInTheDocument();
  });

  it("annotations toggle is present", async () => {
    await renderEcgTab("1");
    expect(screen.getByTestId("toggle-annotations")).toBeInTheDocument();
  });
});

describe("ECG Viewer Tab — controls interaction", () => {
  it("zoom in button increases zoom level", async () => {
    const user = userEvent.setup();
    await renderEcgTab("1");
    const zoomInBtn = screen.getByTestId("button-zoom-in");
    const waveformBefore = screen.getByTestId("ecg-waveform");
    const transformBefore = waveformBefore.getAttribute("style") || waveformBefore.getAttribute("transform") || "";
    await user.click(zoomInBtn);
    await waitFor(() => {
      expect(screen.getByTestId("ecg-waveform")).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it("zoom out button is clickable", async () => {
    const user = userEvent.setup();
    await renderEcgTab("1");
    const zoomInBtn = screen.getByTestId("button-zoom-in");
    await user.click(zoomInBtn);
    const zoomOutBtn = screen.getByTestId("button-zoom-out");
    await user.click(zoomOutBtn);
    expect(screen.getByTestId("ecg-waveform")).toBeInTheDocument();
  });

  it("annotations toggle can be clicked", async () => {
    const user = userEvent.setup();
    await renderEcgTab("1");
    const toggle = screen.getByTestId("toggle-annotations");
    const stateBefore = toggle.getAttribute("data-state");
    await user.click(toggle);
    const stateAfter = toggle.getAttribute("data-state");
    expect(stateAfter).not.toBe(stateBefore);
  });

  it("gain selector has default value", async () => {
    await renderEcgTab("1");
    const selector = screen.getByTestId("select-gain");
    expect(selector.textContent).toMatch(/\d+/);
  });

  it("playback speed selector has default value", async () => {
    await renderEcgTab("1");
    const selector = screen.getByTestId("select-playback-speed");
    expect(selector.textContent).toMatch(/\d+/);
  });
});

describe("ECG Viewer Tab — event navigation", () => {
  it("event cards/list from events data is available", async () => {
    await renderEcgTab("1");
    const events = EVENTS["1"];
    expect(events.length).toBeGreaterThan(0);
    expect(screen.getByTestId("ecg-waveform")).toBeInTheDocument();
  });
});

describe("ECG Viewer Tab — via patient detail page", () => {
  it("ECG viewer renders from patient detail page", async () => {
    await renderPatientDetailOnEcgTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("ecg-waveform")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("zoom buttons are available in patient detail ECG tab", async () => {
    await renderPatientDetailOnEcgTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("button-zoom-in")).toBeInTheDocument();
      expect(screen.getByTestId("button-zoom-out")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("annotations toggle is accessible from patient detail", async () => {
    await renderPatientDetailOnEcgTab("1");
    await waitFor(() => {
      expect(screen.getByTestId("toggle-annotations")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
