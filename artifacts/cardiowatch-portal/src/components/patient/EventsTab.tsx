import React, { useState } from 'react';
import { EventsTab as OriginalEventsTab } from './events-tab';
import { events, getPatientEvents } from '../../data/events';
import { FlaggedEvent } from '../../types';

interface EventsTabCompatProps {
  patientId?: string;
  onViewECG?: (id: string) => void;
  onViewEcg?: (id: string) => void;
}

export function EventsTab({ patientId = "1", onViewECG, onViewEcg }: EventsTabCompatProps) {
  const [eventList, setEventList] = useState<FlaggedEvent[]>(
    events[patientId] || getPatientEvents(patientId)
  );

  const handleStatusChange = (
    id: string,
    status: FlaggedEvent['status'],
    newClass?: FlaggedEvent['classification']
  ) => {
    setEventList(prev =>
      prev.map(e =>
        e.id === id ? { ...e, status, ...(newClass ? { classification: newClass } : {}) } : e
      )
    );
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
