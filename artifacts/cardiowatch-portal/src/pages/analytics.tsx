import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { analyticsSummary, eventVolumeData, classificationBreakdown, turnaroundDist, complianceByPatient } from '@/data/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const COLORS = {
  AF: 'hsl(var(--chart-4))', // red for AF
  Bradycardia: 'hsl(var(--chart-5))', // amber for Brady
  Tachycardia: 'hsl(var(--chart-2))', // slate for Tachy
  Pause: 'hsl(var(--chart-1))', // dark slate for Pause
  Other: 'hsl(var(--chart-3))' // light slate for other
};

export default function Analytics() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    toast.success("Export initiated. You will receive an email when the file is ready.");
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Population Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated insights across all monitored patients.
          </p>
        </div>
        <Button onClick={handleExport} disabled={isExporting} data-testid="button-export">
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Data Export'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card data-testid="metric-patient-days">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Patient-Days</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{analyticsSummary.totalPatientDays.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card data-testid="metric-total-events">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total AI Events</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{analyticsSummary.totalEvents.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card data-testid="metric-confirmed">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-green-700">{analyticsSummary.confirmedEvents.toLocaleString()}</div>
            <p className="text-xs text-slate-500">{analyticsSummary.confirmedPct}% of total</p>
          </CardContent>
        </Card>
        <Card data-testid="metric-dismissed">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Dismissed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{analyticsSummary.dismissedEvents.toLocaleString()}</div>
            <p className="text-xs text-slate-500">{analyticsSummary.dismissedPct}% of total</p>
          </CardContent>
        </Card>
        <Card data-testid="metric-turnaround">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg Turnaround</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{analyticsSummary.avgTurnaroundHrs} hrs</div>
          </CardContent>
        </Card>
        <Card data-testid="metric-compliance">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg Compliance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{analyticsSummary.avgCompliancePct}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="chart-event-volume">
          <CardHeader>
            <CardTitle>Event Volume</CardTitle>
            <CardDescription>Daily AI-flagged events over the last 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eventVolumeData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => {
                      const date = new Date(val);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="chart-classification">
          <CardHeader>
            <CardTitle>Classification Breakdown</CardTitle>
            <CardDescription>Distribution of confirmed event types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classificationBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {classificationBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="chart-turnaround-dist">
          <CardHeader>
            <CardTitle>Review Turnaround Time</CardTitle>
            <CardDescription>Time from AI detection to clinician review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turnaroundDist} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="chart-compliance-by-patient">
          <CardHeader>
            <CardTitle>Compliance by Patient</CardTitle>
            <CardDescription>Bottom 20 patients by device wear time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceByPatient} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="patient" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    formatter={(val: number) => [`${val}%`, 'Compliance']}
                  />
                  <Bar dataKey="compliance" radius={[0, 4, 4, 0]}>
                    {complianceByPatient.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.compliance < 70 ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-2))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
