import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    login();
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <svg
            data-testid="logo-cardiowatch"
            viewBox="0 0 24 24"
            className="h-16 w-16 text-primary mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-center">CardioWatch AI</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Clinician Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@institute.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-primary hover:underline" data-testid="link-forgot-password">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
              className="bg-background"
            />
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <Button type="submit" className="w-full" data-testid="button-sign-in">
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-muted-foreground" data-testid="text-disclaimer">
          Authorized clinical users only. Access is logged and monitored.
        </div>
      </div>
    </div>
  );
}
