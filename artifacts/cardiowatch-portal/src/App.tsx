import React from 'react';
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Layout } from "@/components/layout/layout";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import PatientDetail from "@/pages/patient-detail";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, path }: { component: any, path: string }) {
  return (
    <Route path={path}>
      {(params) => (
        <Layout>
          <Component params={params} />
        </Layout>
      )}
    </Route>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/patients/:id" component={PatientDetail} />
      <ProtectedRoute path="/analytics" component={Analytics} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster position="top-right" />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
