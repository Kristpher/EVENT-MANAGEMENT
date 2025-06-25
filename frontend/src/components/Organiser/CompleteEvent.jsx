import { useLocation ,useNavigate} from "react-router-dom";
import './CompleteEvent.css';
import { useEffect } from "react";

const CompleteEvent = () => {
  const location = useLocation();
  const event = location.state?.event;
  const navigate =useNavigate();

  useEffect(() => {
    console.log(event);
  }, [event]);

  if (!event) return <div className="no-event">❌ Event data not found.</div>;
  const handleReg=()=>{
   navigate('/organizer/studentlist',{state:event})
  }
  return (
    <div className="complete-event-organizer">
      <h1 className="event-title">{event.eventName}</h1>

      <img src={event.poster} alt="Event Poster" className="event-image" />

      <p className="event-description">{event.description}</p>

      <div className="event-info">
        
        <p><i className="fas fa-calendar-alt icon"></i> {event.date}</p>
        <p><i className="fas fa-clock icon"></i> {event.startTime} - {event.endTime}</p>
        <p><i className="fas fa-map-marker-alt icon"></i> {event.venue}</p>
        <p><i className="fas fa-users icon"></i> Max Participants: {event.maxParticipants || "N/A"}</p>
        <p><i className="fas fa-user icon"></i> No of Participants: {event.noOfparticipants || "N/A"}</p>
        <p><i className="fas fa-rupee-sign icon"></i> ₹{event.regFee || "Free"}</p>
        <p><i className="fas fa-hourglass-half icon"></i> Status: {event.status}</p>
        {event.status==="approved"&&<button onClick={handleReg}>Registered Students</button>}
      </div>
    </div>
  );
};

export default CompleteEvent;
