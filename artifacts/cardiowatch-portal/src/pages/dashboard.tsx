import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { format, formatDistanceToNow } from 'date-fns';
import { Search, Filter, AlertTriangle, Activity, CheckCircle, Clock } from 'lucide-react';
import { patients } from '@/data/patients';
import { Patient, Severity, PatientStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Stats
  const totalPatients = patients.length;
  const criticalUnreviewed = patients.reduce((acc, p) => acc + p.unreviewedCritical, 0);
  const moderateUnreviewed = patients.reduce((acc, p) => acc + p.unreviewedModerate, 0);
  const avgCompliance = Math.round(patients.reduce((acc, p) => acc + p.complianceRate, 0) / totalPatients);

  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.mrn.includes(q));
    }

    if (severityFilter !== 'All') {
      if (severityFilter === 'Critical') {
        filtered = filtered.filter(p => p.unreviewedCritical > 0);
      } else if (severityFilter === 'Moderate') {
        filtered = filtered.filter(p => p.unreviewedModerate > 0 && p.unreviewedCritical === 0);
      }
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Default sort: critical events descending
    filtered.sort((a, b) => {
      if (b.unreviewedCritical !== a.unreviewedCritical) {
        return b.unreviewedCritical - a.unreviewedCritical;
      }
      return b.unreviewedModerate - a.unreviewedModerate;
    });

    return filtered;
  }, [searchQuery, severityFilter, statusFilter]);

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'Active': return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>;
      case 'Paused': return <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 border-amber-500/30">Paused</Badge>;
      case 'Setup Incomplete': return <Badge variant="outline" className="text-slate-500 border-slate-300">Setup Incomplete</Badge>;
    }
  };

  const getEventsBadge = (p: Patient) => {
    if (p.unreviewedCritical > 0) {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {p.unreviewedCritical} Critical</Badge>;
    }
    if (p.unreviewedModerate > 0) {
      return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1"><Activity className="h-3 w-3" /> {p.unreviewedModerate} Moderate</Badge>;
    }
    return <Badge variant="outline" className="text-slate-500 border-slate-300 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> 0 Unreviewed</Badge>;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Population Dashboard</h1>
          <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4" /> Last refresh: {format(new Date(), 'h:mm a')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="stat-total-patients">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-critical-unreviewed" className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Critical Unreviewed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{criticalUnreviewed}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-moderate-unreviewed" className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">Moderate Unreviewed</CardTitle>
            <Activity className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{moderateUnreviewed}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-compliance-rate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompliance}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by name or MRN..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="search-bar"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters:</span>
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]" data-testid="filter-severity">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]" data-testid="filter-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Setup Incomplete">Setup Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table data-testid="patient-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Last Data</TableHead>
                  <TableHead>Unreviewed Events</TableHead>
                  <TableHead>Last Reviewed</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                      No patients found matching the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient, i) => (
                    <TableRow key={patient.id} data-testid={`row-patient-${patient.id}`}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{patient.mrn}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={patient.diagnosis}>{patient.diagnosis}</TableCell>
                      <TableCell>{getStatusBadge(patient.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${patient.batteryPct < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                              style={{ width: `${patient.batteryPct}%` }} 
                            />
                          </div>
                          <span className="text-xs font-mono">{patient.batteryPct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(patient.lastDataSync), { addSuffix: true })}
                      </TableCell>
                      <TableCell>{getEventsBadge(patient)}</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(patient.lastReviewed), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/patients/${patient.id}`}>
                          <Button size="sm" variant="secondary" data-testid={`button-review-${patient.id}`}>
                            Review
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
