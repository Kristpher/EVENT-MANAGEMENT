import React from "react";
import './HistoryCard.css';

const HistoryCard = ({ event }) => {
  if (!event) return null;

  return (
    <div className="history-card">
      <div className="card-image-container">
        <img src={event.poster} alt="Event Poster" className="event-poster" />
        <div className="org-name-overlay">{event.organisationName}</div>
      </div>
      <div className="card-content">
        <h3 className="event-name">{event.eventName}</h3>
      </div>
    </div>
  );
};

export default HistoryCard;
