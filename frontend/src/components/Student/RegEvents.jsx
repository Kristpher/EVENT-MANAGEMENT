import AllRegEventsCard from "./AllRegEventsCard";
import "./AllEvents.css";
import { useState,useEffect } from "react";


const RegEvents = ({searchQueryStudent}) => {
     const [Events, setEvents] = useState([]);
     const [orgs,setOrgs]=useState([]);
     const [organs, setOrgans] = useState("CSEA");
       const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
     const [registeredEvents,setRegisteredEvents]=useState([]);
    useEffect(() => {
       const fetchData = async () => {
         try {
           const response = await fetch(`${BACKEND_URL}/getregistered`, {
             method: "GET",
             headers: {
               "Content-type": "application/json",
               "auth-token": localStorage.getItem("auth-token"),
             },
           });
           const data = await response.json();
           console.log("refined data", data);
           if (data.success) {
              const orgNames = [...new Set(data.registeredEvents.map(item => item.organisationName))];
              setOrgs(orgNames);
              setEvents(data.registeredEvents);
              setRegisteredEvents(data.registeredIds);
                   if (orgNames.length > 0) {
          setOrgans(orgNames[0]);
        }
           } else {
             console.log("error", data.message);
           }
         } catch (error) {
           console.error("registered events Error:", error);
           console.log("Error connecting to the server.");
         }
       };
   
       fetchData();
     }, []);

  return (
    <div className="MainAllEvents">
      <div className="organisation">
        {orgs.map((item, index) => (
          <div key={index} className="org-circle" onClick={()=>setOrgans(item)}>
           <p> {item}</p>
          </div>
        ))}
      </div>

   <div className="events-grid">
  {Events &&
    Events.filter(event => organs === event.organisationName)
      .filter(item =>
        !searchQueryStudent ||
        item.eventName.toLowerCase().includes(searchQueryStudent.toLowerCase())
      )
      .map((item, index) => (
        <AllRegEventsCard key={index} events={item} />
      ))}
</div>

    </div>
  );
};

export default RegEvents;
