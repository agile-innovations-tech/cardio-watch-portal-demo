import React, { useState } from 'react';
import { format } from 'date-fns';
import { getPatientHistory } from '@/data/history';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, User, ShieldAlert, Smartphone } from 'lucide-react';

interface HistoryTabProps {
  patientId: string;
}

export function HistoryTab({ patientId }: HistoryTabProps) {
  const [filter, setFilter] = useState('All');
  const history = getPatientHistory(patientId);
  
  const filteredHistory = filter === 'All' 
    ? history 
    : history.filter(h => h.type === filter);

  const getActorIcon = (type: string) => {
    switch (type) {
      case 'Clinician': return <User className="h-4 w-4 text-blue-500" />;
      case 'System': return <Activity className="h-4 w-4 text-slate-500" />;
      case 'Patient': return <Smartphone className="h-4 w-4 text-purple-500" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-3 rounded-md border shadow-sm">
        <div className="text-sm font-medium" data-testid="history-count">
          {filteredHistory.length} Entries
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Actor Type:</span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px] h-8" data-testid="history-filter">
              <SelectValue placeholder="All Actors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Actors</SelectItem>
              <SelectItem value="Clinician">Clinician</SelectItem>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="Patient">Patient</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border" data-testid="history-list">
            {filteredHistory.map((entry) => (
              <div key={entry.id} className="p-4 flex gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <div className="mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                  {getActorIcon(entry.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-sm text-foreground">{entry.actor}</span>
                    <Badge variant="secondary" className="text-[10px] font-normal h-4 py-0 px-1.5">{entry.type}</Badge>
                    <span className="text-xs text-muted-foreground font-mono ml-auto">
                      {format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{entry.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
