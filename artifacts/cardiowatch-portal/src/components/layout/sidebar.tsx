import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Activity, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, testId: 'nav-dashboard' },
    { name: 'Analytics', path: '/analytics', icon: Activity, testId: 'nav-analytics' },
    { name: 'Settings', path: '/settings', icon: Settings, testId: 'nav-settings' },
  ];

  return (
    <aside
      data-testid="sidebar"
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-16">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="font-bold tracking-tight truncate whitespace-nowrap">CardioWatch AI</span>
          </div>
        )}
        {collapsed && (
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-foreground mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        )}
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const isActive = location === item.path || (location === '/' && item.path === '/dashboard');
          return (
            <Link key={item.name} href={item.path} className="block">
              <div
                data-testid={item.testId}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          data-testid="button-collapse-sidebar"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
}
