import React, { useEffect,useState } from 'react';
import PendingEventsCard from './PendingEventsCard.jsx';
import './PendingEvents.css'; 

const PendingEventsAdmin = (refetch) => {
  const [events,setEvents]=useState(null);
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
useEffect(()=>{
  const fetchData=async()=>{
    try{
    const response = await fetch(`${BACKEND_URL}/admin/get-pending`,{
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
       console.error("pending events Error:", error);
    alert("Error connecting to the server.");
  }

  }

  fetchData();
},[refetch])
  return (
    <div className="pending-events-page-admin">
      <h1 className="pending-page-title">Pending Events</h1>
      <div className="pending-events-grid">
        {events && events.map((item, index) => (
          <PendingEventsCard key={index} Events={item} />
        ))}
      </div>
    </div>
  );
};

export default PendingEventsAdmin;
