import { HistoryEntry } from '../types';

export const getPatientHistory = (patientId: string): HistoryEntry[] => {
  return Array.from({ length: 25 }).map((_, i) => ({
    id: `h_${patientId}_${i}`,
    patientId,
    timestamp: new Date(Date.now() - i * 86400000).toISOString(),
    actor: ['Dr. Sarah Okonkwo, MD', 'System', 'Patient', 'Jennifer Calás, NP'][Math.floor(Math.random() * 4)],
    action: [
      'Confirmed Atrial Fibrillation event',
      'Dismissed Sinus Tachycardia event',
      'Adjusted Bradycardia threshold to 45 bpm',
      'Generated 30-day summary report',
      'Device sync completed',
      'Patient reported symptoms: Palpitations',
      'System alert: Battery below 15%'
    ][Math.floor(Math.random() * 7)],
    type: (['Clinician', 'System', 'Patient', 'Clinician'][Math.floor(Math.random() * 4)]) as any
  }));
};

// Uppercase alias for test compatibility
import { patients } from './patients';
export const HISTORY: Record<string, import('../types').HistoryEntry[]> = (() => {
  const result: Record<string, import('../types').HistoryEntry[]> = {};
  patients.forEach(p => { result[p.id] = getPatientHistory(p.id); });
  return result;
})();
