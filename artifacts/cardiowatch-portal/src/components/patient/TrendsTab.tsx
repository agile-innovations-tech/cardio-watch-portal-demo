import React from 'react';
import { TrendsTab as OriginalTrendsTab } from './trends-tab';
import { patients } from '../../data/patients';

interface TrendsTabCompatProps {
  patientId?: string;
  patient?: typeof patients[0];
}

export function TrendsTab({ patientId, patient }: TrendsTabCompatProps) {
  const resolvedPatient = patient || patients.find(p => p.id === patientId) || patients[0];
  return <OriginalTrendsTab patient={resolvedPatient} />;
}
