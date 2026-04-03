import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
