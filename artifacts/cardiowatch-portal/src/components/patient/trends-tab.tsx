import React from 'react';
import { Patient } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TrendsTabProps {
  patient: Patient;
}

export function TrendsTab({ patient }: TrendsTabProps) {
  // Generate dummy trend data for 30 days
  const data = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date(Date.now() - (29 - i) * 86400000);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      afBurden: Math.max(0, patient.afBurden + (Math.random() * 10 - 5)),
      compliance: Math.min(100, Math.max(0, patient.complianceRate + (Math.random() * 20 - 10))),
      hrBase: Math.floor(Math.random() * 10) + 60,
      criticalEvents: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
      moderateEvents: Math.floor(Math.random() * 5)
    };
  });

  const hrDistData = [
    { bucket: '<40', count: 12 },
    { bucket: '40-50', count: 45 },
    { bucket: '50-60', count: 180 },
    { bucket: '60-70', count: 320 },
    { bucket: '70-80', count: 410 },
    { bucket: '80-90', count: 210 },
    { bucket: '90-100', count: 85 },
    { bucket: '100-110', count: 34 },
    { bucket: '>110', count: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-3 rounded-md border shadow-sm">
        <div className="text-sm font-medium">Trend Analysis</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Date Range:</span>
          <Select defaultValue="30">
            <SelectTrigger className="w-[150px] h-8" data-testid="select-date-range">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="chart-af-burden">
          <CardHeader>
            <CardTitle className="text-base">AF Burden Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorAf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={val => `${val}%`} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'AF Burden']}
                  />
                  <Area type="monotone" dataKey="afBurden" stroke="hsl(var(--chart-4))" fillOpacity={1} fill="url(#colorAf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="chart-hr-distribution">
          <CardHeader>
            <CardTitle className="text-base">Heart Rate Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hrDistData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  />
                  <ReferenceLine x="40-50" stroke="hsl(var(--chart-5))" strokeDasharray="3 3" label={{ position: 'top', value: 'Brady', fill: 'hsl(var(--chart-5))', fontSize: 10 }} />
                  <ReferenceLine x="100-110" stroke="hsl(var(--chart-4))" strokeDasharray="3 3" label={{ position: 'top', value: 'Tachy', fill: 'hsl(var(--chart-4))', fontSize: 10 }} />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="chart-event-frequency">
          <CardHeader>
            <CardTitle className="text-base">Event Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="criticalEvents" name="Critical" stackId="a" fill="hsl(var(--destructive))" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="moderateEvents" name="Moderate" stackId="a" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="chart-compliance">
          <CardHeader>
            <CardTitle className="text-base">Monitoring Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={val => `${val}%`} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`${value.toFixed(0)}%`, 'Compliance']}
                  />
                  <Area type="monotone" dataKey="compliance" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorComp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
