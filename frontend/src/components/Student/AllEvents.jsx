import AllEventsCard from "./AllEventsCard";
import "./AllEvents.css";
import { useEffect, useState } from "react";

const AllEvents = ({searchQueryStudent}) => {
  const [Events, setEvents] = useState([]);
  const [organs, setOrgans] = useState("CSEA");
  const [interestedEvents,setInterestedEvents]=useState([]);
  const [registeredEvents,setRegisteredEvents]=useState([]);
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    console.log("hey");

    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/student/all`, {
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
          setEvents(data.organizerData);
          setInterestedEvents(data.interestedEvents)
          setRegisteredEvents(data.registeredIds)
                if (data.organizerData.length > 0) {
          setOrgans(data.organizerData[0].organisationName);
        }
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
  useEffect(()=>{
    console.log(organs);
    const specevent=Events.filter(item => item.organisationName === organs);
    console.log(specevent);
  },[organs])
  return (
    <div className="MainAllEvents">
      <div className="organisation">
        {Events.map((item, index) => (
          <div
            key={index}
            className={`org-circle ${item.organisationName === organs ? "active" : ""}`}
            onClick={() => setOrgans(item.organisationName)}
          >
            <p>{item.organisationName}</p>
          </div>
        ))}
      </div>

  <div className="events-grid">
  {Events.filter(item => item.organisationName === organs)
    .flatMap(item => 
      item.approvedEvents.filter(item=>!searchQueryStudent||item.eventName.toLowerCase().includes(searchQueryStudent.toLowerCase())).map((event, idx) => {
        const isInterested = interestedEvents.includes(event._id);
        const isRegistered =registeredEvents.includes(event._id)
        return (
          <AllEventsCard key={event._id} events={event} isInterested={isInterested} isRegistered={isRegistered}/>
        );
      })
    )}
</div>
    </div>
  );
};

export default AllEvents;
