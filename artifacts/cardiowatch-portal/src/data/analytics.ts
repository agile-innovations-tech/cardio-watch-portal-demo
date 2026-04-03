export const analyticsSummary = {
  totalPatientDays: 4281,
  totalEvents: 1847,
  confirmedEvents: 1203,
  confirmedPct: 65,
  dismissedEvents: 644,
  dismissedPct: 35,
  avgTurnaroundHrs: 3.2,
  avgCompliancePct: 88
};

export const eventVolumeData = Array.from({ length: 90 }).map((_, i) => ({
  date: new Date(Date.now() - (89 - i) * 86400000).toISOString().split('T')[0],
  volume: Math.floor(Math.random() * 30) + 10
}));

export const classificationBreakdown = [
  { name: 'AF', value: 850 },
  { name: 'Bradycardia', value: 320 },
  { name: 'Tachycardia', value: 410 },
  { name: 'Pause', value: 120 },
  { name: 'Other', value: 147 }
];

export const turnaroundDist = [
  { bucket: '< 1 hr', count: 450 },
  { bucket: '1-4 hrs', count: 520 },
  { bucket: '4-12 hrs', count: 180 },
  { bucket: '12-24 hrs', count: 40 },
  { bucket: '> 24 hrs', count: 13 }
];

export const complianceByPatient = Array.from({ length: 20 }).map((_, i) => ({
  patient: `Patient ${String.fromCharCode(65 + i)}`,
  compliance: Math.floor(Math.random() * 40) + 60
})).sort((a, b) => a.compliance - b.compliance);

// Uppercase alias for test compatibility
export const ANALYTICS = {
  eventVolume: eventVolumeData,
  classificationBreakdown,
  turnaroundDistribution: turnaroundDist,
  complianceByPatient,
  summary: analyticsSummary,
};

// Function aliases for test compatibility
export const generateAFBurdenData = (patientId: string) => 
  Array.from({ length: 30 }).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    burden: Math.floor(Math.random() * 40) + 2,
    value: Math.floor(Math.random() * 40) + 2,
  }));

export const generateHRDistributionData = (patientId: string) => 
  Array.from({ length: 20 }).map((_, i) => ({
    bpm: 40 + i * 8,
    count: Math.floor(Math.random() * 50) + 5,
  }));

export const generateEventFrequencyData = (patientId: string) => 
  Array.from({ length: 30 }).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    critical: Math.floor(Math.random() * 3),
    moderate: Math.floor(Math.random() * 5),
    total: Math.floor(Math.random() * 8),
  }));

export const generateComplianceData = (patientId: string) => 
  Array.from({ length: 30 }).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    compliance: Math.floor(Math.random() * 30) + 70,
    value: Math.floor(Math.random() * 30) + 70,
  }));
