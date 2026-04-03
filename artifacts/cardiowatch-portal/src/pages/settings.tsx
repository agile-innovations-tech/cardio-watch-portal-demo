import React, { useState } from 'react';
import { User, Shield, Bell, Building2, Key, Users, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const FAKE_USERS = [
  { id: 1, name: 'Dr. Sarah Okonkwo, MD', email: 's.okonkwo@northgate.edu', role: 'Admin', lastLogin: 'Today, 8:42 AM', active: true },
  { id: 2, name: 'Dr. James Ritter, MD', email: 'j.ritter@northgate.edu', role: 'Clinician', lastLogin: 'Yesterday, 4:15 PM', active: true },
  { id: 3, name: 'Jennifer Calás, NP', email: 'j.calas@northgate.edu', role: 'Clinician', lastLogin: 'Oct 22, 2023', active: true },
  { id: 4, name: 'Dr. Michael Park, MD', email: 'm.park@northgate.edu', role: 'Clinician', lastLogin: 'Oct 18, 2023', active: false },
];

export default function Settings() {
  const { role } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteModalOpen(false);
    setInviteEmail('');
  };

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account preferences and practice configurations.
        </p>
      </div>

      <div data-testid="user-profile-section" className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 border-b pb-2">
          <User className="h-5 w-5" /> My Profile
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Display Name</Label>
                <Input defaultValue="Dr. Sarah Okonkwo, MD" readOnly />
              </div>
              <div className="space-y-1">
                <Label>Email Address</Label>
                <Input defaultValue="s.okonkwo@northgate.edu" readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Input defaultValue="Attending Cardiologist" readOnly />
                </div>
                <div className="space-y-1">
                  <Label>NPI Number</Label>
                  <Input defaultValue="1487295013" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Key className="h-4 w-4"/> Security</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="space-y-1">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-1">
                  <Label>Confirm New Password</Label>
                  <Input type="password" />
                </div>
                <Button type="button" variant="secondary" className="w-full">Update Password</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4"/> Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive alerts for patient events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>In-App Notifications</Label>
                  <p className="text-sm text-slate-500">Receive alerts within the portal</p>
                </div>
                <Switch defaultChecked data-testid="toggle-inapp-alerts" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Alerts</Label>
                  <p className="text-sm text-slate-500">Receive daily summaries and critical alerts via email</p>
                </div>
                <Switch defaultChecked data-testid="toggle-email-alerts" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-slate-500">Receive text messages for critical events only</p>
                </div>
                <Switch defaultChecked={false} data-testid="toggle-sms-alerts" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {role === 'Admin' && (
        <div data-testid="practice-admin-section" className="space-y-6 pt-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 border-b pb-2">
            <Shield className="h-5 w-5" /> Practice Administration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4"/> Organization Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Practice Name</Label>
                  <Input defaultValue="Northgate Cardiac Institute" />
                </div>
                <div className="space-y-1">
                  <Label>Address</Label>
                  <Input defaultValue="4500 Medical Center Dr." />
                </div>
                <div className="space-y-1">
                  <Label>Organization NPI</Label>
                  <Input defaultValue="1893240091" />
                </div>
                <div className="pt-4 border-t mt-4">
                  <Label className="mb-2 block">EHR Integration</Label>
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-400">Connected to Epic</p>
                      <p className="text-xs text-green-600/80">Last sync: 5 mins ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4"/> User Management</CardTitle>
                  <CardDescription>Manage access for clinicians and staff</CardDescription>
                </div>
                
                <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" data-testid="button-invite-user">Invite User</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New User</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join Northgate Cardiac Institute.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInvite} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="invite-email">Email Address</Label>
                        <Input 
                          id="invite-email" 
                          type="email" 
                          placeholder="colleague@northgate.edu" 
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <option>Clinician</option>
                          <option>Admin</option>
                          <option>Nurse/MA</option>
                        </select>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Send Invitation</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {FAKE_USERS.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            {user.active ? 
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge> : 
                              <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">Inactive</Badge>
                            }
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">{user.lastLogin}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
