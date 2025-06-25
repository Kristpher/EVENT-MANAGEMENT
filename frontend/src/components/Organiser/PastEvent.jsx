import { useEffect, useState } from "react";
import EventShower from "./EventShower";
import './PendingEvents.css';
import { useNavigate } from "react-router-dom";

const PastEvents = ({refetch,searchQueryOrg}) => {
  const navigate = useNavigate();
  const [events,setEvents]=useState(null);
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
  const handleGoFullEvent = (event) => {
    navigate(`/Organizer-past/${encodeURIComponent(event.eventName)}`, { state: {event} });
  };
  useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("organizer approved events");
      const response = await fetch(`${BACKEND_URL}/organizer/past`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const data = await response.json(); 
      console.log("refined data:", data);
      if (data.success) {
        setEvents(data.pastApprovedEvents);
        console.log("is this undefined",data.pastApprovedEvents)
      } else {
        console.log("some error", data.message);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  fetchData(); 
}, [refetch]);

  return (
    <div className="MainPendingEvents-organizer">
      <div className="showEvents">
        {events && events.filter(item=>!searchQueryOrg||item.eventName.toLowerCase().includes(searchQueryOrg.toLowerCase())).map((item, index) => (
          <div key={index} onClick={() => handleGoFullEvent(item)}>
            <EventShower event={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastEvents;
