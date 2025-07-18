// TimelineCard.js
import React from 'react';
import EditableTimelineCard from './EditableTimelineCard';

const TimelineCard = ({ event, onDeleteEvent, dayIndex, eventIndex, showDelete = false }) => {
  // Vérification de sécurité
  if (!event) {
    console.warn('TimelineCard: event est undefined');
    return null;
  }

  // Utiliser EditableTimelineCard comme composant de base
  return (
    <EditableTimelineCard
      event={event}
      onDeleteEvent={onDeleteEvent}
      dayIndex={dayIndex}
      eventIndex={eventIndex}
      showDelete={showDelete}
      onUpdate={() => {}} // Pas de mise à jour dans le mode lecture
    />
  );
};

export default TimelineCard;
