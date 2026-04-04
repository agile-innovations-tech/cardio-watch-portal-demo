import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationDrawer } from './notification-drawer';
import { notifications as initialNotifications } from '@/data/notifications';

export function Header() {
  const { role, setRole, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header data-testid="header" className="bg-background border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">Northgate Cardiac Institute</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDrawerOpen(true)}
            data-testid="notification-bell"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                data-testid="notification-badge"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2" data-testid="user-menu">
              <User className="h-5 w-5" />
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium leading-none">Dr. Sarah Okonkwo, MD</span>
                <span className="text-xs text-muted-foreground leading-none mt-1">{role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="role-switcher" onClick={() => setRole(role === 'Clinician' ? 'Admin' : 'Clinician')}>
              Switch to {role === 'Clinician' ? 'Admin' : 'Clinician'} View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={logout}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NotificationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </header>
  );
}
