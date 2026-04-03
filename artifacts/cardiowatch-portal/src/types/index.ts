export type PatientStatus = 'Active' | 'Paused' | 'Setup Incomplete';
export type Severity = 'Critical' | 'Moderate' | 'Stable';
export type EventClassification = 'Atrial Fibrillation' | 'Bradycardia' | 'Sinus Tachycardia' | 'Pause Detected' | 'Atrial Flutter' | 'Sinus Bradycardia' | 'AV Block' | 'Normal Sinus Rhythm' | 'Junctional Rhythm';
export type EventStatus = 'Unreviewed' | 'Confirmed' | 'Dismissed' | 'Reclassified';

export interface Patient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  sex: 'M' | 'F' | 'Other';
  diagnosis: string;
  status: PatientStatus;
  batteryPct: number;
  lastDataSync: string;
  monitoringStartDate: string;
  totalDays: number;
  deviceModel: string;
  assignedClinician: string;
  unreviewedCritical: number;
  unreviewedModerate: number;
  lastReviewed: string;
  complianceRate: number;
  afBurden: number;
}

export interface FlaggedEvent {
  id: string;
  patientId: string;
  timestamp: string;
  classification: EventClassification;
  confidence: number;
  durationSec: number;
  heartRate: number;
  source: 'On-Device' | 'Cloud AI';
  status: EventStatus;
}

export interface HistoryEntry {
  id: string;
  patientId: string;
  timestamp: string;
  actor: string;
  action: string;
  type: 'System' | 'Clinician' | 'Patient';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'moderate' | 'info';
  read: boolean;
  link?: string;
}
