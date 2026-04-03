import { Patient } from '../types';

export const patients: Patient[] = [
  { id: '1', name: 'Eleanor Voss', mrn: '10042891', age: 72, sex: 'F', diagnosis: 'Paroxysmal AF', status: 'Active', batteryPct: 82, lastDataSync: '2023-10-24T14:22:00Z', monitoringStartDate: '2023-10-01', totalDays: 24, deviceModel: 'Apple Watch Series 9', assignedClinician: 'Dr. Sarah Okonkwo, MD', unreviewedCritical: 2, unreviewedModerate: 5, lastReviewed: '2023-10-23T09:00:00Z', complianceRate: 94, afBurden: 12 },
  { id: '2', name: 'Marcus Tran', mrn: '10042892', age: 65, sex: 'M', diagnosis: 'Unexplained syncope', status: 'Active', batteryPct: 45, lastDataSync: '2023-10-24T12:00:00Z', monitoringStartDate: '2023-10-10', totalDays: 15, deviceModel: 'Apple Watch Series 9', assignedClinician: 'Dr. James Ritter, MD', unreviewedCritical: 0, unreviewedModerate: 1, lastReviewed: '2023-10-22T11:30:00Z', complianceRate: 88, afBurden: 0 },
  { id: '3', name: 'Patricia Huang', mrn: '10042893', age: 81, sex: 'F', diagnosis: 'Suspected Brady', status: 'Paused', batteryPct: 12, lastDataSync: '2023-10-20T08:15:00Z', monitoringStartDate: '2023-09-15', totalDays: 40, deviceModel: 'Apple Watch Series 9', assignedClinician: 'Jennifer Calás, NP', unreviewedCritical: 1, unreviewedModerate: 0, lastReviewed: '2023-10-19T14:20:00Z', complianceRate: 65, afBurden: 2 },
  { id: '4', name: 'James Okello', mrn: '10042894', age: 58, sex: 'M', diagnosis: 'Persistent AF', status: 'Active', batteryPct: 96, lastDataSync: '2023-10-24T14:30:00Z', monitoringStartDate: '2023-10-05', totalDays: 20, deviceModel: 'Apple Watch Series 9', assignedClinician: 'Dr. Michael Park, MD', unreviewedCritical: 0, unreviewedModerate: 8, lastReviewed: '2023-10-24T08:00:00Z', complianceRate: 98, afBurden: 45 },
  // Adding enough to meet 30+ requirement
  ...Array.from({ length: 27 }).map((_, i) => ({
    id: `${i + 5}`,
    name: ['Raymond Kessler', 'Adaeze Obi', 'Priya Mehta', 'Thomas Brennan', 'Yuki Tanaka', 'Rosa Delgado', 'Henrik Larsson', 'Fatimah Al-Rashid', 'David Chen', 'Amara Nwosu', 'Claudia Ferreira', 'Brendan Walsh', 'Mei-Ling Zhou', 'Samuel Asante', 'Ingrid Holm', 'Rafael Gutierrez', 'Nadia Petrov', 'Calvin Brooks', 'Asha Patel', 'Emeka Diallo', 'Katarina Nowak', 'Jerome Williams', 'Lily Nakamura', 'Omar Sharif', 'Brigitte Moreau', 'Winston Osei', 'Anika Sharma', 'Diego Torres'][i % 28],
    mrn: `10042${895 + i}`,
    age: Math.floor(Math.random() * 40) + 45,
    sex: (Math.random() > 0.5 ? 'M' : 'F') as 'M'|'F',
    diagnosis: ['Sinus Node Dysfunction', 'PSVT', 'Long QT Syndrome', 'Ventricular Tachycardia', 'Complete Heart Block', 'Wolff-Parkinson-White', 'Paroxysmal AF'][Math.floor(Math.random() * 7)],
    status: (Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Paused' : 'Setup Incomplete') : 'Active') as PatientStatus,
    batteryPct: Math.floor(Math.random() * 100),
    lastDataSync: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    monitoringStartDate: new Date(Date.now() - Math.random() * 5000000000).toISOString().split('T')[0],
    totalDays: Math.floor(Math.random() * 60) + 5,
    deviceModel: 'Apple Watch Series 9',
    assignedClinician: ['Dr. Sarah Okonkwo, MD', 'Dr. James Ritter, MD', 'Jennifer Calás, NP', 'Dr. Michael Park, MD'][Math.floor(Math.random() * 4)],
    unreviewedCritical: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0,
    unreviewedModerate: Math.floor(Math.random() * 5),
    lastReviewed: new Date(Date.now() - Math.random() * 200000000).toISOString(),
    complianceRate: Math.floor(Math.random() * 30) + 70,
    afBurden: Math.floor(Math.random() * 20)
  }))
];

// Uppercase alias for test compatibility
export const PATIENTS = patients;
