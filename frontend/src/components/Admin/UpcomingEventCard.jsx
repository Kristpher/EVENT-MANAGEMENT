import React from 'react';
import './UpcomingEventCard.css'; 
import { useNavigate } from 'react-router-dom';

const UpcomingEventCard = ({eventData}) => {
  const navigate=useNavigate();
  const handleStats=()=>{
      
         navigate(`/Admin-upcoming/${encodeURIComponent(eventData.eventName)}`, { state: eventData });
    
  }
  return (
    <div className="event-card-upcoming-admin">
      <div className="event-header">
        <h2>{eventData.eventName}</h2>
        <span className="org-name">{eventData.organisationName}</span>
      </div>
      <img src={eventData.poster} alt="EEE Quiz Poster" className="event-image" />
      <p className="event-description">
        {eventData.description}
      </p>
      <div className="event-details">
        <p><i className="fa fa-calendar"></i> {eventData.date}</p>
        <p><i className="fa fa-clock"></i> {eventData.startTime}</p>
        <p><i className="fa fa-map-marker"></i> {eventData.venue}</p>
        <p><i className="fa fa-users"></i> {eventData.maxParticipants}</p>
      </div>
      <button className="stats-button" onClick={handleStats}>View Event Statistics</button>
    </div>
  );
};

export default UpcomingEventCard;
