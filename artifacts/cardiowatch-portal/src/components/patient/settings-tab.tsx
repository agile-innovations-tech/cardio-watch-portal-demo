import React, { useState } from 'react';
import { Patient } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface SettingsTabProps {
  patient: Patient;
}

export function SettingsTab({ patient }: SettingsTabProps) {
  const [monitoringPaused, setMonitoringPaused] = useState(patient.status === 'Paused');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully. Device will sync on next connection.");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Detection Thresholds</CardTitle>
          <CardDescription>Adjust the AI sensitivity and clinical thresholds for this specific patient.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brady">Bradycardia Threshold (bpm)</Label>
              <Input id="brady" type="number" min="30" max="60" defaultValue="45" data-testid="input-brady-threshold" />
              <p className="text-xs text-muted-foreground">Alert if HR falls below this value for &gt;1 minute</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tachy">Tachycardia Threshold (bpm)</Label>
              <Input id="tachy" type="number" min="90" max="180" defaultValue="120" data-testid="input-tachy-threshold" />
              <p className="text-xs text-muted-foreground">Alert if HR exceeds this value for &gt;1 minute</p>
            </div>
            <div className="space-y-2">
              <Label>AF Detection Sensitivity</Label>
              <Select defaultValue="Standard">
                <SelectTrigger data-testid="select-af-sensitivity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High (More alerts, false positives)</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Conservative">Conservative (Fewer alerts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pause">Pause Detection Threshold (sec)</Label>
              <Input id="pause" type="number" min="2.0" max="5.0" step="0.1" defaultValue="3.0" data-testid="input-pause-threshold" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Escalation & Monitoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delay">Caregiver Escalation Delay (minutes)</Label>
              <Input id="delay" type="number" min="5" max="60" defaultValue="15" className="max-w-[200px]" data-testid="input-escalation-delay" />
              <p className="text-xs text-muted-foreground">Wait time before notifying alternate care team members for critical unreviewed events.</p>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md bg-slate-50/50 dark:bg-slate-900/20">
              <div className="space-y-0.5">
                <Label className="text-base">Emergency Escalation</Label>
                <p className="text-sm text-muted-foreground">Auto-page on-call physician for pauses &gt; 5s or HR &lt; 30</p>
              </div>
              <Switch defaultChecked data-testid="toggle-emergency" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md bg-slate-50/50 dark:bg-slate-900/20">
              <div className="space-y-0.5">
                <Label className="text-base text-amber-700 dark:text-amber-500">Pause Monitoring</Label>
                <p className="text-sm text-muted-foreground">Temporarily suppress all alerts for this patient.</p>
              </div>
              <Switch 
                checked={monitoringPaused} 
                onCheckedChange={setMonitoringPaused}
                data-testid="toggle-monitoring-paused" 
              />
            </div>

            {monitoringPaused && (
              <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/30 rounded-md space-y-2">
                <Label className="text-amber-800 dark:text-amber-400">Auto-resume Date (Optional)</Label>
                <Input type="date" className="max-w-[200px] border-amber-300 focus-visible:ring-amber-500" data-testid="input-resume-date" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pb-8">
        <Button type="button" variant="outline">Reset to Defaults</Button>
        <Button type="submit" data-testid="button-save-settings">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>
    </form>
  );
}
