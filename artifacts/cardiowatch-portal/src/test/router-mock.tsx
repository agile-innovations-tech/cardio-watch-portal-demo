import React from "react";
import { vi } from "vitest";

interface LinkProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
}

interface ChildrenProps {
  children: React.ReactNode;
}

interface RouteProps {
  element: React.ReactNode;
  path?: string;
}

export const routerMock = {
  useLocation: vi.fn(() => ({ pathname: "/dashboard", search: "", hash: "", state: null })),
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(() => ({ id: "1" })),
  useMatch: vi.fn(() => null),
  Link: ({ children, to, href, onClick }: LinkProps) => (
    <a href={to ?? href} onClick={onClick}>{children}</a>
  ),
  Navigate: () => null,
  MemoryRouter: ({ children }: ChildrenProps) => <>{children}</>,
  Routes: ({ children }: ChildrenProps) => <>{children}</>,
  Route: ({ element }: RouteProps) => <>{element}</>,
  BrowserRouter: ({ children }: ChildrenProps) => <>{children}</>,
};
