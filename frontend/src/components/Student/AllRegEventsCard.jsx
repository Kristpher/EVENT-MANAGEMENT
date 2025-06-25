import React, { useEffect, useState } from "react";
import "./AllEventsCard.css";
import { useNavigate } from "react-router-dom";

const AllRegEventsCard = ({ events,isRegistered}) => {
const navigate = useNavigate();
  const handleClick = () => {
    console.log("this is my name",events.eventName)
    navigate(`/Student-event-details/${events.eventName}`, { state: {events,isRegistered} });
  };

  return (
    <div className="MainAllEventsCard-student">
      <h2 className="allEventsHeading">{events.eventName}</h2>

      <div className="eventTopRow">
        <img src={events.poster} alt="Event Poster" className="eventCardImage" />
       
      </div>
 <p className="eventCardDescription">{events.description}</p>
      <div className="eventDetailsGrid">
        <div className="detailItem">
          <i className="fas fa-calendar-alt"></i>
          <span>{events.date}</span>
        </div>
        <div className="detailItem">
          <i className="fas fa-clock"></i>
          <span>{events.startTime}</span>
        </div>
        <div className="detailItem">
          <i className="fas fa-map-marker-alt"></i>
          <span>{events.venue || "Location TBD"}</span>
        </div>
        <div className="detailItem">
          <i className="fas fa-users"></i>
          <span>{events.maxParticipants}</span>
        </div>
      </div>

      <div className="eventCardActions Actions">
        <button className="viewBtn" onClick={handleClick}>View Event</button>
      </div>
    </div>
  );
};

export default AllRegEventsCard;
