import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { patients } from '@/data/patients';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export function ReportModal({ isOpen, onClose, patientId }: ReportModalProps) {
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const patient = patients.find(p => p.id === patientId) || patients[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[500px]" data-testid="report-modal">
        <DialogHeader>
          <DialogTitle>Generate Clinical Report</DialogTitle>
          <DialogDescription>
            {patient ? `Create a standardized PDF report for ${patient.name} (${patient.mrn}).` : 'Create a report'}
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="py-8 text-center text-green-600 font-medium" data-testid="report-success">
            Report generated successfully. Download will begin shortly.
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Reporting Period</Label>
              <Select defaultValue="30">
                <SelectTrigger data-testid="select-report-period">
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
                  <label htmlFor="rep-summary" className="text-sm font-medium">Clinical Summary</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rep-events" defaultChecked data-testid="checkbox-event-log" />
                  <label htmlFor="rep-events" className="text-sm font-medium">Event Log</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rep-ecg" data-testid="checkbox-ecg-excerpts" />
                  <label htmlFor="rep-ecg" className="text-sm font-medium">ECG Excerpts</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rep-trends" defaultChecked data-testid="checkbox-trend-charts" />
                  <label htmlFor="rep-trends" className="text-sm font-medium">Trend Charts</label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Recipient</Label>
              <Select defaultValue="download">
                <SelectTrigger data-testid="select-recipient">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="download">Download Only</SelectItem>
                  <SelectItem value="physician">Ordering Physician</SelectItem>
                  <SelectItem value="specialist">Referring Specialist</SelectItem>
                  <SelectItem value="insurance">Insurance/Prior Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-report">
                Cancel
              </Button>
              <Button type="submit" disabled={generating} data-testid="button-generate">
                {generating ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
