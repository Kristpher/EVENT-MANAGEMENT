import React, { useEffect } from "react";
import "./PopularEventsCard.css";
import { useNavigate } from "react-router-dom";
const PopularEventsCard = ({ events ,regIds}) => {
  const navigate =useNavigate();
    if (!events) return null;
  const handleDetails=()=>{
   const isRegistered = regIds.includes(events._id);
     navigate(`/Student-event-details/${events.eventName}`, { state: {events,isRegistered} });
  }
//  useEffect(()=>{
//   console.log(events);
//   console.log(regIds);
//  },[events,regIds])
  return (
    <div className="MainPopularEventsCard">
      <div className="PopularEventsCard">
      <div className="card-header">
  <h2 className="event-name">{events.eventName}</h2>
  <h3 className="org-name">{events.organisationName}</h3>
</div>

<div className="card-body">
  <div className="card-info-section">
    <div className="descAndImage">
      <img src={events.poster} alt="Event Poster" className="event-image" />
       <p className="event-description">{events.description}</p>
    </div>
          
    <div className="card-details-grid">
      <div className="detail-item">
        <i className="fas fa-calendar-alt icon"></i>
        <span>{events.date}</span>
      </div>
      <div className="detail-item">
        <i className="fas fa-clock icon"></i>
        <span>{events.startTime}</span>
      </div>
      <div className="detail-item">
        <i className="fas fa-users icon"></i>
        <span>{events.maxParticipants}</span>
      </div>
      <div className="detail-item">
        <i className="fas fa-rupee-sign icon"></i>
        <span>₹{events.regFee}</span>
      </div>
    </div>

    <div className="popularActions">
      <button onClick={handleDetails}>Show Event Details</button>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default PopularEventsCard;
