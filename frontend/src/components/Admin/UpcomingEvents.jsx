import React, { useEffect,useState } from 'react';
import UpcomingEventCard from './UpcomingEventCard';
import './UpcomingEvents.css'; 

const UpcomingEvents = (refetch) => {
    const [events,setEvents]=useState(null);
      const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
    useEffect(()=>{
      const fetchData=async()=>{
        try{
        const response = await fetch(`${BACKEND_URL}/admin/get-approved`,{
          method:"GET",
          headers:{
            "Content-type":"application/json",
            "auth-token":localStorage.getItem("auth-token")
          }
    
        }
       )
       const data = await response.json();
       console.log("refined data",data);
       if(data.success){
         setEvents(data.events);
         console.log(data.events);
       }
       else{
         console.log(data.events," ",data.success);
        console.log("error",data.message);
       }
      }
      catch(error){
           console.error("upcoming events Error:", error);
        console.log("Error connecting to the server.");
      }
    
      }
    
      fetchData();
    },[refetch])
  return (
    <div className="upcoming-events-page-admin">
      <h1 className="page-title">Upcoming Events</h1>
      <div className="upcoming-events-grid">
        {events && events.map((item, index) => (
          <UpcomingEventCard key={index} eventData={item} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
