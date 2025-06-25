import React from 'react';
import './PendingEventsCard.css'; 
import { useNavigate } from 'react-router-dom';

const PendingEventsCard = ({ Events }) => {
    const navigate=useNavigate();
    const handleFullPending=()=>{
         navigate(`/Admin-pending/${encodeURIComponent(Events.eventName)}`, { state: Events });
    }
  return (
    <div className="pending-event-card-admin" onClick={handleFullPending}>
      <div className="pending-event-header">
        <h3 className="event-title">{Events.eventName}</h3>
        <p className="org-name">{Events.organisationName}</p>
      </div>
      <img
        src={Events.poster }
        alt={`${Events.eventName} Poster`}
        className="pending-event-image"
      />
      <p className="pending-event-description">
        {Events.description}
      </p>
    </div>
  );
};

export default PendingEventsCard;
