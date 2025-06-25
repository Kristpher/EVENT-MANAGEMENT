import React from "react";
import "./EventDetails.css";
import { useLocation } from "react-router-dom";
const RegEventDetails = () => {
      const {state:event}=useLocation();

 
  return (
    <div className="event-details-container-student">
      <div className="event-header">
        <h1 className="event-title">{event.eventName}</h1>
        <h3 className="org-name">{event.organisationName}</h3>
      </div>

      <img src={event.poster} alt="Event Poster" className="event-image" />

      <p className="event-description">{event.description}</p>

      <div className="event-info-grid">
        <div className="info-item">
          <i className="fas fa-calendar-alt icon"></i>
          <span>{event.date}</span>
        </div>
        <div className="info-item">
          <i className="fas fa-map-marker-alt icon"></i>
          <span>{event.venue}</span>
        </div>
        <div className="info-item">
          <i className="fas fa-clock icon"></i>
          <span>
            {event.startTime} - {event.endTime}
          </span>
        </div>
        <div className="info-item">
          <i className="fas fa-rupee-sign icon"></i>
          <span>₹{event.regFee}</span>
        </div>
        <div className="info-item">
          <i className="fas fa-users icon"></i>
          <span>{event.maxParticipants} Participants</span>
        </div>
          <div className="info-item">
          <i className="fas fa-user icon"></i>
          <span>{event.noOfaparticipants} Registered Studented</span>
        </div>
      </div>
    </div>
  );
};

export default RegEventDetails;
