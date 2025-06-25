import React, { useEffect } from 'react';
import './EventShower.css'; 

const EventShower = ({ event }) => {
  useEffect(()=>{
    console.log(event);
  },[])
  return (
    <div className="event-card-organizer">
      <div className="event-poster">
        <img src={event.poster} alt="Event Poster" />
      </div>
      <div className="event-details">
        <h2 className="event-name">{event.eventName}</h2>
        <p className="event-venue">
          <i className="fas fa-map-marker-alt"></i> {event.venue}
        </p>
        <p className="event-time">
          <i className="fas fa-clock"></i> {event.startTime} - {event.endTime}
        </p>
        <p className="event-date">
          <i className="fas fa-calendar-alt"></i> {event.date}
        </p>
      </div>
    </div>
  );
};

export default EventShower;


  