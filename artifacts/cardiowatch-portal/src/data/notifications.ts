import { Notification } from '../types';

export const notifications: Notification[] = [
  { id: 'n1', message: 'Critical: 3.2s Pause detected for Eleanor Voss', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'critical', read: false, link: '/patients/1' },
  { id: 'n2', message: 'Device battery low (12%) for Patricia Huang', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'moderate', read: false, link: '/patients/3' },
  { id: 'n3', message: 'Weekly summary report generated for Marcus Tran', timestamp: new Date(Date.now() - 86400000).toISOString(), severity: 'info', read: true, link: '/patients/2' },
  { id: 'n4', message: 'New AF episode (4h 12m) for James Okello', timestamp: new Date(Date.now() - 172800000).toISOString(), severity: 'moderate', read: false, link: '/patients/4' },
  { id: 'n5', message: 'Patient onboarding incomplete: David Chen', timestamp: new Date(Date.now() - 259200000).toISOString(), severity: 'info', read: true },
  { id: 'n6', message: 'Critical: HR > 150bpm for 10 mins (Raymond Kessler)', timestamp: new Date(Date.now() - 300000000).toISOString(), severity: 'critical', read: false },
  { id: 'n7', message: 'Compliance drop detected (<60%) for Yuki Tanaka', timestamp: new Date(Date.now() - 400000000).toISOString(), severity: 'moderate', read: false },
  { id: 'n8', message: 'System update scheduled for tonight 2:00 AM EST', timestamp: new Date(Date.now() - 500000000).toISOString(), severity: 'info', read: true }
];

// Uppercase alias for test compatibility  
export const NOTIFICATIONS = notifications;
