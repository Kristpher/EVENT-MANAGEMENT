import './PendingEventCardFull.css'
import React from 'react';
import { useLocation } from 'react-router-dom';
const PendingEventCardFull=({setRefetch})=>{
const {state:event}=useLocation();
const [click,setClick]=React.useState(false);     
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
const handleApprove = async () => {
 
  try {
     setClick(true);
    const response = await fetch(`${BACKEND_URL}/approve`, {
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
      setRefetch(prev => !prev);
    } else {
      console.log("Approval error from backend:", data.message);
      console.log("Approval failed: " + data.message);
    }
  } catch (error) {
    console.error("Approval Error:", error);
    console.log("Error connecting to the server.");
  }
};

const handleReject = async () => {
  
  try {
    setClick(true);
    const response = await fetch(`${BACKEND_URL}/reject`, {
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

      console.log("rejection successful!");
      setRefetch(prev => !prev);
    } else {
      console.log("rejection error from backend:", data.message);
      console.log("rejection failed: " + data.message);
    }
  } catch (error) {
    console.error("Approval Error:", error);
    console.log("Error connecting to the server.");
  }
};


  return (
    <div className="complete-Pending-event-admin">
      <h1 className="event-title">{event.eventName}</h1>
      <h2>{event.organisationName}</h2>
      <img src={event.poster} alt="Event Poster" className="event-image" />

      <p className="event-description">{event.description}</p>

      <div className="event-info">
        <p><i className="fas fa-calendar-alt icon"></i> {event.date}</p>
        <p><i className="fas fa-clock icon"></i> {event.startTime} - {event.endTime}</p>
        <p><i className="fas fa-map-marker-alt icon"></i> {event.venue}</p>
        <p><i className="fas fa-users icon"></i> Max Participants: {event.maxParticipants || "N/A"}</p>
        <p><i className="fas fa-rupee-sign icon"></i> ₹{event.regFee || "Free"}</p>
      </div>
   {event && event.status === "pending" && !click &&(
  <div className="button-action">
    <button onClick={handleApprove}>Approve</button>
    <button onClick={handleReject}>Reject</button>
  </div>
)}
    </div>
  );
    
 
}
export default PendingEventCardFull;