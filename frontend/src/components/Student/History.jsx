import AllEventsCard from "./AllEventsCard";
import "./AllEvents.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [events, setEvents] = useState([]);
  const navigate=useNavigate();
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    console.log("hey");
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/gethistory`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        });
        const data = await response.json();
        console.log("refined data", data);
        if (data.success) {
          console.log(data)
          setEvents(data.registeredEvents);
        } else {
          console.log("error", data.message);
        }
      } catch (error) {
        console.error("pending events Error:", error);
        console.log("Error connecting to the server.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="MainAllEvents">
      

  <div className="events-grid">
  {events&&events.map((eventData, idx) => {
   
        return (
            <div className="MainHistory" onClick={navigate(`/Admin-upcoming/${encodeURIComponent(eventData.eventName)}`, { state: eventData })}>
          <HistoryCard key={eventData._id} event={eventData} />
          </div>
        );
      })
}
</div>
    </div>
  );
};

export default History;
