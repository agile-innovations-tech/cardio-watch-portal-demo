import { FlaggedEvent } from '../types';

export const events: Record<string, FlaggedEvent[]> = {
  '1': [
    { id: 'e1', patientId: '1', timestamp: '2023-10-24T02:15:00Z', classification: 'Atrial Fibrillation', confidence: 92, durationSec: 3600, heartRate: 115, source: 'Cloud AI', status: 'Unreviewed' },
    { id: 'e2', patientId: '1', timestamp: '2023-10-23T14:20:00Z', classification: 'Atrial Fibrillation', confidence: 88, durationSec: 1800, heartRate: 108, source: 'On-Device', status: 'Unreviewed' },
    { id: 'e3', patientId: '1', timestamp: '2023-10-22T03:00:00Z', classification: 'Pause Detected', confidence: 95, durationSec: 3.2, heartRate: 45, source: 'Cloud AI', status: 'Confirmed' },
    ...Array.from({ length: 15 }).map((_, i) => ({
      id: `e${i+4}`,
      patientId: '1',
      timestamp: new Date(Date.now() - (i+3) * 86400000).toISOString(),
      classification: ['Atrial Fibrillation', 'Sinus Tachycardia', 'Bradycardia'][Math.floor(Math.random() * 3)] as any,
      confidence: Math.floor(Math.random() * 30) + 65,
      durationSec: Math.floor(Math.random() * 500) + 30,
      heartRate: Math.floor(Math.random() * 80) + 50,
      source: 'On-Device' as const,
      status: (Math.random() > 0.5 ? 'Confirmed' : 'Dismissed') as any
    }))
  ],
  // We can fallback to an empty array for other patients or generate randomly in components
};

// Helper function to get events or generate them if missing
export const getPatientEvents = (patientId: string): FlaggedEvent[] => {
  if (events[patientId]) return events[patientId];
  return Array.from({ length: 15 }).map((_, i) => ({
    id: `e_gen_${patientId}_${i}`,
    patientId,
    timestamp: new Date(Date.now() - i * 43200000).toISOString(),
    classification: ['Atrial Fibrillation', 'Bradycardia', 'Sinus Tachycardia', 'Pause Detected'][Math.floor(Math.random() * 4)] as any,
    confidence: Math.floor(Math.random() * 40) + 60,
    durationSec: Math.floor(Math.random() * 1000) + 10,
    heartRate: Math.floor(Math.random() * 100) + 40,
    source: (Math.random() > 0.5 ? 'Cloud AI' : 'On-Device') as any,
    status: (i < 3 ? 'Unreviewed' : (Math.random() > 0.5 ? 'Confirmed' : 'Dismissed')) as any
  }));
};

// Uppercase alias for test compatibility
import { patients } from './patients';
export const EVENTS: Record<string, import('../types').FlaggedEvent[]> = (() => {
  const result: Record<string, import('../types').FlaggedEvent[]> = { ...events };
  patients.forEach(p => {
    if (!result[p.id]) {
      result[p.id] = getPatientEvents(p.id);
    }
  });
  return result;
})();
