import React, { useState } from 'react';
import { EventsTab as OriginalEventsTab } from './events-tab';
import { events, getPatientEvents } from '../../data/events';

interface EventsTabCompatProps {
  patientId?: string;
  onViewECG?: (id: string) => void;
  onViewEcg?: (id: string) => void;
}

export function EventsTab({ patientId = "1", onViewECG, onViewEcg }: EventsTabCompatProps) {
  const [eventList, setEventList] = useState(
    events[patientId] || getPatientEvents(patientId)
  );
  
  const handleStatusChange = (id: string, status: any, newClass?: any) => {
    setEventList(prev => prev.map(e => e.id === id ? { ...e, status, ...(newClass ? { classification: newClass } : {}) } : e));
  };
  
  const handleViewEcg = (id: string) => {
    if (onViewECG) onViewECG(id);
    if (onViewEcg) onViewEcg(id);
  };

  return (
    <OriginalEventsTab 
      events={eventList} 
      onStatusChange={handleStatusChange} 
      onViewEcg={handleViewEcg}
    />
  );
}
