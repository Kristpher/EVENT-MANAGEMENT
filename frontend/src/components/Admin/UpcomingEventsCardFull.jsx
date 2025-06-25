import './UpcomingCardFull.css'
import { useLocation } from 'react-router-dom';
const UpcomingEventCardFull=()=>{
const {state:event}=useLocation();
     


  return (
    <div className="complete-Upcoming-event-admin">
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
    
    </div>
  );
    
 
}
export default UpcomingEventCardFull;