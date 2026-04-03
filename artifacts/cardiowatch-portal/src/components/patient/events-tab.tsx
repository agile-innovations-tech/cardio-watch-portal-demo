import React, { useState } from 'react';
import { format } from 'date-fns';
import { FlaggedEvent } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Check, X, ActivitySquare, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EventsTabProps {
  events: FlaggedEvent[];
  onStatusChange: (id: string, status: FlaggedEvent['status'], newClass?: FlaggedEvent['classification']) => void;
  onViewEcg: (id: string) => void;
}

const RHYTHM_LABELS = [
  'Atrial Fibrillation', 'Atrial Flutter', 'Bradycardia', 'Sinus Bradycardia', 
  'Sinus Tachycardia', 'AV Block', 'Normal Sinus Rhythm', 'Pause Detected', 'Junctional Rhythm'
] as const;

export function EventsTab({ events, onStatusChange, onViewEcg }: EventsTabProps) {
  const [filter, setFilter] = useState('All');
  
  const filteredEvents = events.filter(e => filter === 'All' ? true : e.status === filter || (filter === 'Unreviewed Only' && e.status === 'Unreviewed'));

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900';
    if (conf >= 70) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900';
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Unreviewed': return <Badge variant="destructive">Unreviewed</Badge>;
      case 'Confirmed': return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Confirmed</Badge>;
      case 'Dismissed': return <Badge variant="outline" className="border-slate-300 text-slate-500 bg-slate-50">Dismissed</Badge>;
      case 'Reclassified': return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">Reclassified</Badge>;
      default: return null;
    }
  };

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.floor(sec/60)}m ${sec%60}s`;
    return `${Math.floor(sec/3600)}h ${Math.floor((sec%3600)/60)}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-3 rounded-md border shadow-sm">
        <div className="text-sm font-medium">
          {events.length} Total Events <span className="text-muted-foreground mx-2">|</span> 
          <span className="text-red-600">{events.filter(e => e.status === 'Unreviewed').length} Unreviewed</span>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] h-8" data-testid="select-event-filter">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Events</SelectItem>
              <SelectItem value="Unreviewed Only">Unreviewed Only</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredEvents.map(event => (
          <Card key={event.id} className="overflow-hidden" data-testid={`event-card-${event.id}`}>
            <div className="flex flex-col md:flex-row">
              {/* Event Info */}
              <div className="p-4 md:w-[35%] border-r border-border bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-sm text-muted-foreground">
                    {format(new Date(event.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </div>
                  {getStatusBadge(event.status)}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{event.classification}</h3>
                
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <Badge variant="outline" className={`mt-0.5 font-mono ${getConfidenceColor(event.confidence)}`}>
                      {event.confidence}%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium mt-0.5">{formatDuration(event.durationSec)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="font-medium font-mono mt-0.5">{event.heartRate} bpm</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <p className="font-medium mt-0.5">{event.source}</p>
                  </div>
                </div>
              </div>
              
              {/* ECG Sparkline */}
              <div className="p-4 flex-1 flex flex-col justify-center border-r border-border bg-white dark:bg-slate-950 relative overflow-hidden group">
                <div className="absolute top-2 left-2 text-xs text-muted-foreground font-mono bg-background/80 px-1 rounded z-10">
                  Lead I Excerpt (10s)
                </div>
                
                {/* Fake Sparkline SVG */}
                <div className="w-full h-24 opacity-80 mt-2">
                  <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full stroke-primary">
                    <path 
                      d="M0,50 L20,50 L25,45 L30,55 L40,50 L45,50 L50,20 L55,80 L60,40 L65,50 L100,50 L105,45 L110,55 L120,50 L125,50 L130,20 L135,80 L140,40 L145,50 L180,50 L185,45 L190,55 L200,50 L205,50 L210,20 L215,80 L220,40 L225,50 L260,50 L265,45 L270,55 L280,50 L285,50 L290,20 L295,80 L300,40 L305,50 L340,50 L345,45 L350,55 L360,50 L365,50 L370,20 L375,80 L380,40 L385,50 L420,50 L425,45 L430,55 L440,50 L445,50 L450,20 L455,80 L460,40 L465,50 L500,50" 
                      fill="none" 
                      strokeWidth="1.5" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                
                <div className="absolute inset-0 bg-background/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  <Button variant="secondary" size="sm" onClick={() => onViewEcg(event.id)} data-testid={`button-view-ecg-${event.id}`}>
                    <ActivitySquare className="mr-2 h-4 w-4" /> View Full ECG
                  </Button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-4 md:w-[200px] flex flex-col gap-2 justify-center bg-slate-50/50 dark:bg-slate-900/20">
                {event.status === 'Unreviewed' ? (
                  <>
                    <Button 
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => onStatusChange(event.id, 'Confirmed')}
                      data-testid={`button-confirm-${event.id}`}
                    >
                      <Check className="mr-2 h-4 w-4" /> Confirm
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => onStatusChange(event.id, 'Dismissed')}
                      data-testid={`button-dismiss-${event.id}`}
                    >
                      <X className="mr-2 h-4 w-4" /> Dismiss
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="w-full text-xs" data-testid={`button-reclassify-${event.id}`}>
                          Reclassify <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
                        {RHYTHM_LABELS.map(label => (
                          <DropdownMenuItem 
                            key={label} 
                            onClick={() => onStatusChange(event.id, 'Reclassified', label as any)}
                          >
                            {label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">Review completed</p>
                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onStatusChange(event.id, 'Unreviewed')}>
                      Undo Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filteredEvents.length === 0 && (
          <div className="p-8 text-center text-muted-foreground bg-card border rounded-md">
            No events found matching the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
