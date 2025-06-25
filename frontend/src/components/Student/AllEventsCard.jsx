import React, { useEffect, useState } from "react";
import "./AllEventsCard.css";
import { useNavigate } from "react-router-dom";

const AllEventsCard = ({ events, isInterested,isRegistered }) => {
  const [interested, setInterested] = useState(isInterested);
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
 
  useEffect(() => {
    setInterested(isInterested);
  }, [isInterested]);

  const toggleInterested = () => {
    const updated = !interested;
    setInterested(updated);

    const fetchData = async () => {
      try {
        const msg = updated ? "interested applied" : "interested removed";
        const url = updated
          ? `${BACKEND_URL}/student/interested`
          : `${BACKEND_URL}/student/remove-interested`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({ id: events._id }),
        });

        const data = await response.json();
        if (data.success) {
          console.log(msg);
        } else {
          console.error("Backend error:", data.message);
          console.log("Failed: " + data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        console.log("Network error.");
      }
    };

    fetchData();
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/Student-event-details/${events.eventName}`, { state: {events,isRegistered} });
  };

  return (
    <div className="MainAllEventsCard-student">
      <h2 className="allEventsHeading">{events.eventName}</h2>

      <div className="eventPoster">
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

      <div className="eventCardActions">
        <button className="interestedBtn" onClick={toggleInterested}>
          <i className={`fa-star ${interested ? "fas filled" : "far"}`}></i>{" "}
          Interested
        </button>
        <button className="viewBtn" onClick={handleClick}>View Event</button>
      </div>
    </div>
  );
};

export default AllEventsCard;
