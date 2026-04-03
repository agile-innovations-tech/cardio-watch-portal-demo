import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FileText, SlidersHorizontal, MessageSquare, Battery, Activity, ShieldAlert, CheckCircle, Search, Filter, CalendarDays, X, ZoomIn, ZoomOut, Maximize, Clock, Settings as SettingsIcon } from 'lucide-react';
import { patients } from '@/data/patients';
import { getPatientEvents } from '@/data/events';
import { getPatientHistory } from '@/data/history';
import { Patient, FlaggedEvent, HistoryEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Subcomponents for tabs to keep file size manageable
import { EventsTab } from '@/components/patient/events-tab';
import { EcgViewerTab } from '@/components/patient/ecg-viewer-tab';
import { TrendsTab } from '@/components/patient/trends-tab';
import { HistoryTab } from '@/components/patient/history-tab';
import { SettingsTab } from '@/components/patient/settings-tab';

export default function PatientDetail({ params }: { params?: { id?: string } } = {}) {
  const navigate = useNavigate();
  const routerParams = useParams<{ id: string }>();
  const patientId = params?.id ?? routerParams.id ?? '1';
  const patient = patients.find(p => p.id === patientId);
  const [activeTab, setActiveTab] = useState('events');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  
  // State for events (need to manage locally to allow status updates)
  const [events, setEvents] = useState<FlaggedEvent[]>([]);

  useEffect(() => {
    if (patient) {
      setEvents(getPatientEvents(patient.id));
    }
  }, [patient]);

  if (!patient) {
    return <div className="p-8 text-center">Patient not found</div>;
  }

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      setReportModalOpen(false);
      toast.success("Report generated successfully. Download will begin shortly.");
    }, 1500);
  };

  const handleEventStatusChange = (eventId: string, newStatus: FlaggedEvent['status'], newClass?: FlaggedEvent['classification']) => {
    setEvents(events.map(ev => {
      if (ev.id === eventId) {
        return { 
          ...ev, 
          status: newStatus,
          ...(newClass ? { classification: newClass } : {})
        };
      }
      return ev;
    }));
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-10">
      {/* Persistent Header */}
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{patient.name}</h1>
            <Badge variant="outline" className="text-sm font-mono">{patient.mrn}</Badge>
            {patient.status === 'Active' && <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>}
            {patient.status === 'Paused' && <Badge variant="secondary" className="bg-amber-500/20 text-amber-700">Paused</Badge>}
            {patient.status === 'Setup Incomplete' && <Badge variant="outline" className="text-slate-500">Setup Incomplete</Badge>}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Demographics</p>
              <p className="font-medium">{patient.age}y, {patient.sex}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Primary Diagnosis</p>
              <p className="font-medium truncate" title={patient.diagnosis}>{patient.diagnosis}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Monitoring Status</p>
              <p className="font-medium">Day {patient.totalDays} (Since {format(new Date(patient.monitoringStartDate), 'MMM d, yyyy')})</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Device / Sync</p>
              <div className="flex items-center gap-2">
                <span className="font-medium">{patient.deviceModel}</span>
                <span className={`text-xs flex items-center ${patient.batteryPct < 20 ? 'text-red-500' : 'text-green-600'}`}>
                  <Battery className="h-3 w-3 mr-0.5" /> {patient.batteryPct}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Sync: {format(new Date(patient.lastDataSync), 'MM/dd HH:mm')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:w-48 shrink-0">
          <Button 
            className="w-full justify-start" 
            onClick={() => setReportModalOpen(true)}
            data-testid="button-generate-report"
          >
            <FileText className="mr-2 h-4 w-4" /> Generate Report
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => setActiveTab('settings')}
            data-testid="button-adjust-thresholds"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Adjust Thresholds
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => toast("Message sent to care team.")}
            data-testid="button-message-team"
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Message Care Team
          </Button>
          <div className="text-xs text-muted-foreground text-center mt-2">
            Assigned: {patient.assignedClinician}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="events" className="text-sm font-medium">Events ({events.filter(e => e.status === 'Unreviewed').length})</TabsTrigger>
          <TabsTrigger value="ecg" className="text-sm font-medium">ECG Viewer</TabsTrigger>
          <TabsTrigger value="trends" className="text-sm font-medium">Trends</TabsTrigger>
          <TabsTrigger value="history" className="text-sm font-medium">History</TabsTrigger>
          <TabsTrigger value="settings" className="text-sm font-medium">Settings</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="events" className="m-0">
            <EventsTab events={events} onStatusChange={handleEventStatusChange} onViewEcg={(id) => setActiveTab('ecg')} />
          </TabsContent>
          <TabsContent value="ecg" className="m-0">
            <EcgViewerTab events={events} />
          </TabsContent>
          <TabsContent value="trends" className="m-0">
            <TrendsTab patient={patient} />
          </TabsContent>
          <TabsContent value="history" className="m-0">
            <HistoryTab patientId={patient.id} />
          </TabsContent>
          <TabsContent value="settings" className="m-0">
            <SettingsTab patient={patient} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Report Generation Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-[500px]" data-testid="report-modal">
          <DialogHeader>
            <DialogTitle>Generate Clinical Report</DialogTitle>
            <DialogDescription>
              Create a standardized PDF report for {patient.name} ({patient.mrn}).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGenerateReport} className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Reporting Period</Label>
              <Select defaultValue="30" data-testid="select-report-period">
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Include Sections</Label>
              <div className="space-y-2 border rounded-md p-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rep-summary" defaultChecked data-testid="checkbox-summary" />
                  <label htmlFor="rep-summary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Clinical Summary</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rep-events" defaultChecked data-testid="checkbox-event-log" />
                  <label htmlFor="rep-events" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Event Log</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rep-ecg" defaultChecked data-testid="checkbox-ecg-excerpts" />
                  <label htmlFor="rep-ecg" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">ECG Excerpts (Confirmed events only)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rep-trends" defaultChecked data-testid="checkbox-trend-charts" />
                  <label htmlFor="rep-trends" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Trend Charts</label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Recipient</Label>
              <Select defaultValue="download" data-testid="select-recipient">
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="download">Download Only</SelectItem>
                  <SelectItem value="physician">Ordering Physician (EHR)</SelectItem>
                  <SelectItem value="specialist">Referring Specialist (Fax/EHR)</SelectItem>
                  <SelectItem value="insurance">Insurance/Prior Auth (Fax)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReportModalOpen(false)} data-testid="button-cancel-report">Cancel</Button>
              <Button type="submit" disabled={reportGenerating} data-testid="button-generate">
                {reportGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
