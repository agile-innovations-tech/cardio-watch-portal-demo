import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(() => ({ pathname: "/dashboard", search: "", hash: "", state: null })),
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

async function renderDashboard() {
  const { default: Dashboard } = await import("../pages/dashboard");
  return render(<Dashboard />);
}

describe("Patient Population Dashboard — rendering", () => {
  it("dashboard renders without crashing", async () => {
    const { container } = await renderDashboard();
    expect(container.firstChild).not.toBeNull();
  });

  it("Population Dashboard heading is present", async () => {
    await renderDashboard();
    expect(screen.getByText(/Population Dashboard/i)).toBeInTheDocument();
  });

  it("total patients stat card is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("stat-total-patients")).toBeInTheDocument();
  });

  it("total patients count is a positive number", async () => {
    await renderDashboard();
    const card = screen.getByTestId("stat-total-patients");
    const number = parseInt(card.textContent?.replace(/\D/g, "") || "0");
    expect(number).toBeGreaterThan(0);
  });

  it("critical unreviewed stat card is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("stat-critical-unreviewed")).toBeInTheDocument();
  });

  it("moderate unreviewed stat card is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("stat-moderate-unreviewed")).toBeInTheDocument();
  });

  it("compliance rate stat card is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("stat-compliance-rate")).toBeInTheDocument();
  });

  it("compliance rate shows a percentage", async () => {
    await renderDashboard();
    const card = screen.getByTestId("stat-compliance-rate");
    expect(card.textContent).toMatch(/%/);
  });

  it("patient table is rendered", async () => {
    await renderDashboard();
    expect(screen.getByTestId("patient-table")).toBeInTheDocument();
  });

  it("search bar is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  it("severity filter dropdown is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("filter-severity")).toBeInTheDocument();
  });

  it("status filter dropdown is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("filter-status")).toBeInTheDocument();
  });
});

describe("Patient Population Dashboard — table columns", () => {
  it("Patient Name column header is present", async () => {
    await renderDashboard();
    expect(screen.getByTestId("sort-name")).toBeInTheDocument();
  });

  it("Age column header is present and sortable", async () => {
    await renderDashboard();
    expect(screen.getByTestId("sort-age")).toBeInTheDocument();
  });

  it("Battery column header is sortable", async () => {
    await renderDashboard();
    expect(screen.getByTestId("sort-batteryPct")).toBeInTheDocument();
  });

  it("Unreviewed Events column header is sortable", async () => {
    await renderDashboard();
    expect(screen.getByTestId("sort-unreviewedCritical")).toBeInTheDocument();
  });

  it("Last Reviewed column header is sortable", async () => {
    await renderDashboard();
    expect(screen.getByTestId("sort-lastReviewed")).toBeInTheDocument();
  });

  it("MRN column header is present", async () => {
    await renderDashboard();
    expect(screen.getByText("MRN")).toBeInTheDocument();
  });

  it("Diagnosis column header is present", async () => {
    await renderDashboard();
    expect(screen.getByText("Diagnosis")).toBeInTheDocument();
  });

  it("Status column header is present", async () => {
    await renderDashboard();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("Last Data column header is present", async () => {
    await renderDashboard();
    expect(screen.getByText("Last Data")).toBeInTheDocument();
  });

  it("Action column header is present", async () => {
    await renderDashboard();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});

describe("Patient Population Dashboard — patient rows", () => {
  it("at least 30 patient rows are rendered", async () => {
    await renderDashboard();
    const reviewButtons = document.querySelectorAll("[data-testid^='button-review-']");
    expect(reviewButtons.length).toBeGreaterThanOrEqual(30);
  });

  it("Eleanor Voss appears in the table", async () => {
    await renderDashboard();
    expect(screen.getByText("Eleanor Voss")).toBeInTheDocument();
  });

  it("Marcus Tran appears in the table", async () => {
    await renderDashboard();
    expect(screen.getByText("Marcus Tran")).toBeInTheDocument();
  });

  it("Patricia Huang appears in the table", async () => {
    await renderDashboard();
    expect(screen.getByText("Patricia Huang")).toBeInTheDocument();
  });

  it("each patient row has a Review button", async () => {
    await renderDashboard();
    const reviewButtons = document.querySelectorAll("[data-testid^='button-review-']");
    expect(reviewButtons.length).toBeGreaterThan(0);
    reviewButtons.forEach(btn => {
      expect(btn.textContent).toMatch(/review/i);
    });
  });

  it("Review button links to patient detail page", async () => {
    await renderDashboard();
    const reviewLink = document.querySelector("a[href^='/patients/']");
    expect(reviewLink).not.toBeNull();
  });

  it("patient row 1 review button links to /patients/1", async () => {
    await renderDashboard();
    const link = document.querySelector("a[href='/patients/1']");
    expect(link).not.toBeNull();
  });

  it("MRN numbers are displayed in the table", async () => {
    await renderDashboard();
    expect(screen.getByText("10042891")).toBeInTheDocument();
  });

  it("patient ages are displayed", async () => {
    await renderDashboard();
    const table = screen.getByTestId("patient-table");
    expect(table.textContent).toMatch(/72|65|81|58/);
  });
});

describe("Patient Population Dashboard — search and filter", () => {
  it("searching by name filters results to matching patients", async () => {
    const user = userEvent.setup();
    await renderDashboard();
    const initialRowCount = document.querySelectorAll("[data-testid^='button-review-']").length;
    const searchBar = screen.getByTestId("search-bar");
    await user.type(searchBar, "Eleanor");
    await waitFor(() => {
      const filteredCount = document.querySelectorAll("[data-testid^='button-review-']").length;
      expect(filteredCount).toBeLessThan(initialRowCount);
    }, { timeout: 2000 });
  });

  it("searching Eleanor Voss shows exactly her row", async () => {
    const user = userEvent.setup();
    await renderDashboard();
    const searchBar = screen.getByTestId("search-bar");
    await user.type(searchBar, "Eleanor Voss");
    await waitFor(() => {
      const rows = document.querySelectorAll("[data-testid^='button-review-']");
      expect(rows.length).toBe(1);
      expect(screen.getByText("Eleanor Voss")).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("searching by MRN filters to that patient", async () => {
    const user = userEvent.setup();
    await renderDashboard();
    const searchBar = screen.getByTestId("search-bar");
    await user.type(searchBar, "10042891");
    await waitFor(() => {
      expect(screen.getByText("Eleanor Voss")).toBeInTheDocument();
      const rows = document.querySelectorAll("[data-testid^='button-review-']");
      expect(rows.length).toBe(1);
    }, { timeout: 2000 });
  });

  it("clearing search restores full patient list", async () => {
    const user = userEvent.setup();
    await renderDashboard();
    const fullCount = document.querySelectorAll("[data-testid^='button-review-']").length;
    const searchBar = screen.getByTestId("search-bar");
    await user.type(searchBar, "Eleanor");
    await user.clear(searchBar);
    await waitFor(() => {
      const restoredCount = document.querySelectorAll("[data-testid^='button-review-']").length;
      expect(restoredCount).toBe(fullCount);
    }, { timeout: 2000 });
  });

  it("searching for a non-existent name shows empty state", async () => {
    const user = userEvent.setup();
    await renderDashboard();
    const searchBar = screen.getByTestId("search-bar");
    await user.type(searchBar, "ZZZZZZZ_NONEXISTENT_PATIENT");
    await waitFor(() => {
      expect(screen.getByText(/No patients found/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("status filter dropdown has All Statuses option", async () => {
    await renderDashboard();
    const filterBtn = screen.getByTestId("filter-status");
    expect(filterBtn.textContent).toMatch(/all statuses/i);
  });

  it("severity filter dropdown has All Severities option", async () => {
    await renderDashboard();
    const filterBtn = screen.getByTestId("filter-severity");
    expect(filterBtn.textContent).toMatch(/all severities/i);
  });
});

describe("Patient Population Dashboard — sorting", () => {
  it("clicking Patient Name header sorts alphabetically descending (first click = desc)", async () => {
    const user = userEvent.setup();
    await renderDashboard();
    const nameHeader = screen.getByTestId("sort-name");
    await user.click(nameHeader);
    await waitFor(() => {
      const rows = document.querySelectorAll("tbody tr");
      expect(rows.length).toBeGreaterThan(0);
    });
    const cells = Array.from(document.querySelectorAll("tbody tr td:first-child")).map(c => c.textContent || "");
    const sorted = [...cells].sort((a, b) => b.localeCompare(a));
    expect(cells).toEqual(sorted);
  });

  it("clicking Patient Name header twice toggles sort direction", async () => {
    await renderDashboard();
    fireEvent.click(screen.getByTestId("sort-name"));
    let descSnapshot = "";
    await waitFor(() => {
      const cells = Array.from(document.querySelectorAll("tbody tr td:first-child")).map(c => c.textContent || "");
      expect(cells[0].localeCompare(cells[cells.length - 1])).toBeGreaterThan(0);
      descSnapshot = cells.join(",");
    }, { timeout: 1000 });
    fireEvent.click(screen.getByTestId("sort-name"));
    await waitFor(() => {
      const ascSnapshot = Array.from(document.querySelectorAll("tbody tr td:first-child")).map(c => c.textContent || "").join(",");
      expect(ascSnapshot).not.toBe(descSnapshot);
    }, { timeout: 1000 });
  });

  it("clicking Age header sorts by age descending (first click = desc)", async () => {
    const user = userEvent.setup();
    await renderDashboard();
    const ageHeader = screen.getByTestId("sort-age");
    await user.click(ageHeader);
    await waitFor(() => {
      const rows = document.querySelectorAll("tbody tr");
      expect(rows.length).toBeGreaterThan(0);
    });
    const ages = Array.from(document.querySelectorAll("tbody tr td:nth-child(3)")).map(c => parseInt(c.textContent || "0"));
    for (let i = 1; i < ages.length; i++) {
      expect(ages[i]).toBeLessThanOrEqual(ages[i - 1]);
    }
  });

  it("sorting column header shows chevron icon indicator", async () => {
    const user = userEvent.setup();
    await renderDashboard();
    const nameHeader = screen.getByTestId("sort-name");
    await user.click(nameHeader);
    const svg = nameHeader.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("default sort puts patients with critical events first", async () => {
    await renderDashboard();
    const { patients } = await import("../data/patients");
    const criticalPatients = patients.filter(p => p.unreviewedCritical > 0);
    if (criticalPatients.length > 0) {
      const firstRowName = document.querySelector("tbody tr td:first-child")?.textContent;
      const criticalPatientNames = criticalPatients.map(p => p.name);
      expect(criticalPatientNames).toContain(firstRowName);
    }
  });
});
