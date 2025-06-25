import React, { useEffect } from "react";
import "./EventDetails.css";
import { useLocation } from "react-router-dom";
const EventDetails = () => {
      const {state:{events,isRegistered}}=useLocation();
      const [isReg,setisReg]=React.useState(isRegistered);
        const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
      const event=events;
      useEffect(()=>{
        console.log(isReg);
      },[])
 const handleRegister=async()=>{
  setisReg(true);
   try {
    const response = await fetch(`${BACKEND_URL}/student/registered`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ id: event._id }), 
    });

    const data = await response.json();
    console.log("Refined data:", data);

    if (data.success) {

      console.log("Approval successful!");
      
    } else {
      console.log("Approval error from backend:", data.message);
      console.log("Approval failed: " + data.message);
    }
  } catch (error) {
    console.error("Approval Error:", error);
    console.log("Error connecting to the server.");
  }
 }

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
          <span>{event.noOfparticipants} Registered Students</span>
        </div>
      </div>

<div className="register-btn-wrapper">
  {event.maxParticipants && parseInt(event.maxParticipants) > 0
    ? parseInt(event.maxParticipants) > event.noOfparticipants
      ? !isReg 
        ? (
            <button className="register-btn" onClick={handleRegister}>
              Register
            </button>
          )
        : (
            <h2>Registered</h2>
          )
      : (
          <h2>Registration Completed</h2>
        )
    : !isReg 
      ? (
          <button className="register-btn" onClick={handleRegister}>
            Register
          </button>
        )
      : (
          <h2>Registered</h2>
        )}
</div>

    </div>
  );
};

export default EventDetails;
