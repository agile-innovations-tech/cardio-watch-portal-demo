import { FlaggedEvent, EventClassification, EventStatus } from '../types';

const CLASSIFICATIONS: EventClassification[] = [
  'Atrial Fibrillation', 'Sinus Tachycardia', 'Bradycardia', 'Pause Detected',
  'Atrial Flutter', 'Sinus Bradycardia', 'AV Block', 'Normal Sinus Rhythm', 'Junctional Rhythm'
];
const SOURCES: FlaggedEvent['source'][] = ['Cloud AI', 'On-Device'];
const REVIEWED_STATUSES: EventStatus[] = ['Confirmed', 'Dismissed'];

function pick<T>(arr: T[], i: number): T {
  return arr[Math.abs(i) % arr.length];
}

export const events: Record<string, FlaggedEvent[]> = {
  '1': [
    { id: 'e1', patientId: '1', timestamp: '2023-10-24T02:15:00Z', classification: 'Atrial Fibrillation', confidence: 92, durationSec: 3600, heartRate: 115, source: 'Cloud AI', status: 'Unreviewed' },
    { id: 'e2', patientId: '1', timestamp: '2023-10-23T14:20:00Z', classification: 'Atrial Fibrillation', confidence: 88, durationSec: 1800, heartRate: 108, source: 'On-Device', status: 'Unreviewed' },
    { id: 'e3', patientId: '1', timestamp: '2023-10-22T03:00:00Z', classification: 'Pause Detected', confidence: 95, durationSec: 3.2, heartRate: 45, source: 'Cloud AI', status: 'Confirmed' },
    ...Array.from({ length: 15 }).map((_, i): FlaggedEvent => ({
      id: `e${i + 4}`,
      patientId: '1',
      timestamp: new Date(Date.UTC(2023, 9, 21) - i * 86400000).toISOString(),
      classification: pick(CLASSIFICATIONS, i * 7 + 3),
      confidence: 65 + (i * 11 % 30),
      durationSec: 30 + (i * 37 % 500),
      heartRate: 50 + (i * 13 % 80),
      source: pick(SOURCES, i),
      status: i < 5 ? 'Unreviewed' : pick(REVIEWED_STATUSES, i),
    }))
  ],
};

export const getPatientEvents = (patientId: string): FlaggedEvent[] => {
  if (events[patientId]) return events[patientId];
  const seed = patientId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Array.from({ length: 15 }).map((_, i): FlaggedEvent => ({
    id: `e_gen_${patientId}_${i}`,
    patientId,
    timestamp: new Date(Date.UTC(2023, 9, 24) - i * 43200000).toISOString(),
    classification: pick(CLASSIFICATIONS, seed + i * 3),
    confidence: 60 + ((seed + i * 7) % 40),
    durationSec: 10 + ((seed + i * 17) % 1000),
    heartRate: 40 + ((seed + i * 11) % 100),
    source: pick(SOURCES, seed + i),
    status: i < 3 ? 'Unreviewed' : pick(REVIEWED_STATUSES, seed + i),
  }));
};

// Uppercase alias for test compatibility
import { patients } from './patients';
export const EVENTS: Record<string, FlaggedEvent[]> = (() => {
  const result: Record<string, FlaggedEvent[]> = { ...events };
  patients.forEach(p => {
    if (!result[p.id]) {
      result[p.id] = getPatientEvents(p.id);
    }
  });
  return result;
})();
