import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { X, CheckCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  setNotifications: (n: Notification[]) => void;
}

export function NotificationDrawer({ open, onOpenChange, notifications, setNotifications }: NotificationDrawerProps) {
  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-destructive bg-destructive/5';
      case 'moderate': return 'border-l-amber-500 bg-amber-500/5';
      case 'info': return 'border-l-blue-500 bg-blue-500/5';
      default: return 'border-l-border';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0" data-testid="notification-drawer">
        <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0">
          <SheetTitle>Notifications</SheetTitle>
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead} data-testid="button-mark-all-read" className="h-8">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No notifications to display.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/50">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  data-testid={`notification-item-${notif.id}`}
                  className={cn(
                    "p-4 border-l-4 relative group transition-colors hover:bg-muted/50",
                    getSeverityStyle(notif.severity),
                    !notif.read ? "opacity-100" : "opacity-60 grayscale-[50%]"
                  )}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                      {notif.link ? (
                        <Link to={notif.link} onClick={() => onOpenChange(false)}>
                          <div className="text-sm font-medium cursor-pointer hover:underline text-foreground">
                            {notif.message}
                          </div>
                        </Link>
                      ) : (
                        <div className="text-sm font-medium text-foreground">{notif.message}</div>
                      )}
                      <div className="text-xs text-muted-foreground font-mono">
                        {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDismiss(notif.id)}
                      data-testid={`button-dismiss-${notif.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
