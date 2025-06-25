import { useEffect, useState } from "react";
import EventShower from "./EventShower";
import './PendingEvents.css';
import { useNavigate } from "react-router-dom";

const PendingEvents = ({refetch,searchQueryOrg}) => {
  const navigate = useNavigate();
  const [events,setEvents]=useState(null);
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
  const handleGoFullEvent = (event) => {
    navigate(`/Organizer-pending/${encodeURIComponent(event.eventName)}`, { state: {event} });
  };
  useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("organizer pending events");
      const response = await fetch(`${BACKEND_URL}/organizer/pending`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const data = await response.json(); 
      console.log("refined data:", data);
      if (data.success) {
        setEvents(data.pendingEvents);
        console.log("is this undefined",data.pendingEvents)
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

export default PendingEvents;
