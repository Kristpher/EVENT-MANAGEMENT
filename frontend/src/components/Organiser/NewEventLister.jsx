import { useEffect, useState } from 'react';
import './NewEventLister.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Venue from '../../pages/Venue';
const EventModal = ({ onClose,onSubmit,pendingEvents,bookMap,setRefetch}) => {
  const navigate =useNavigate();
  const [showVenue, setShowVenue]=useState(false);
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
  const [formData, setFormData] = useState({
    id:'',
    OrganisationName:'',
    EventName:'',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    posterFile:'',
    description: '',
    additionalInfo: '',
    maxParticipants: '',
    registrationFee: '',
    status:'pending'
  });
    const [Ven,setVen]=useState(null);
    const [error, setError] = useState('');
      const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
 
const handleSubmit = async (e) => {
  e.preventDefault();

  const { date, startTime, endTime, venue, description, posterFile } = formData;

  if (!date || !startTime || !endTime || !venue || !description || !posterFile) {
    setError("Please fill all required fields marked *");
    return;
  }

  setError('');
  try {
  
    const uploadData = new FormData();
    uploadData.append("poster", posterFile);

    const uploadRes = await fetch(`${BACKEND_URL}/uploadPoster`, {
      method: "POST",
      body: uploadData,
    });

    const uploadResult = await uploadRes.json();
    if (!uploadResult.success) {
      alert("Image upload failed: " + uploadResult.message);
      return;
    }

   
    const updatedFormData = {
      ...formData,
      posterFile: uploadResult.fileUrl
    };

   
    const eventRes = await fetch(`${BACKEND_URL}/addEvent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token")
      },
      body: JSON.stringify(updatedFormData)
    });

    const eventResult = await eventRes.json();
    if (eventResult.success) {
      alert("Event created successfully!");
      setRefetch(prev => !prev);
      onClose(); 
    } else {
      alert("Failed to create event: " + eventResult.message);
    }

  } catch (error) {
    console.error("Error in creating event:", error);
    alert("Something went wrong. Please try again.");
  }
};

  const handleFileChange = (e) => {
  setFormData(prev => ({
    ...prev,
    posterFile: e.target.files[0] 
  }));
};

const selectVenue=()=>{
  setShowVenue(true);
}
useEffect(() => {
  if (!formData.date) return;

  const selectedDate = new Date(formData.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  if (selectedDate < today) {
    alert("The selected date is in the past");
    setFormData(prev => ({ ...prev, date: "" }));
  }
}, [formData.date]);


useEffect(() => {
  
  if (!formData.date || !formData.startTime || !formData.endTime) return;

  const now = new Date();
  const selectedDate = new Date(formData.date);
  const currentTime = now.toTimeString().slice(0, 5);


  if (selectedDate.toDateString() === now.toDateString()) {
    if (formData.startTime < currentTime) {
      alert("The start time is in the past");
      setFormData(prev => ({ ...prev, startTime: "" }));
      return;
    }

    if (formData.endTime < currentTime) {
      alert("The end time is in the past");
      setFormData(prev => ({ ...prev, endTime: "" }));
      return;
    }
  }

  if (formData.startTime >= formData.endTime) {
    alert("Start time must be before end time");
    setFormData(prev => ({ ...prev, endTime: "" }));
  }
}, [formData.date, formData.startTime, formData.endTime]);


  return (

     <div className="modal-overlay-organizer">
    
      {
        showVenue && <div className="venue-model"><Venue  onClose={() => setShowVenue(false)} startTime={formData.startTime} endTime={formData.endTime} date={formData.date} bookingMap={bookMap} onSelect={(venue)=>{setVen(venue);setFormData(prev => ({ ...prev, venue }));setShowVenue(false);}}/></div>
      }
      
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2 className="modal-heading">Add New Event</h2>
        <form className="event-form" onSubmit={handleSubmit}>
  {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
<label>Event Name: *</label>
  <input name="EventName" type="text" value={formData.EventName} onChange={handleChange} required />

  <label>Date: *</label>
  <input name="date" type="date" value={formData.date} onChange={handleChange} required />

  <label>Start Time: *</label>
  <input name="startTime" type="time" value={formData.startTime} onChange={handleChange} required />

  <label>End Time: *</label>
  <input name="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
{/* 
  <label>Venue: *</label>
  <input name="venue" type="text" value={formData.venue} onChange={handleChange} required /> */}

  <button type="button" onClick={() => {
  if (formData.date!='' && formData.startTime!='' && formData.endTime!='') {
    selectVenue();
  } else {
    alert("Please fill date, starting time, and ending time");
  }
}}>
  {Ven?Ven:"Venue"}
</button>

  <label>Description: *</label>
  <textarea name="description" value={formData.description} onChange={handleChange} required />

  <label>Poster Image: *</label>
<input
  type="file"
  name="posterFile"
  accept="image/*"
  onChange={handleFileChange}
  required
/>

  <label>Maximum Participants:</label>
  <input name="maxParticipants" type="number" value={formData.maxParticipants} onChange={handleChange} />

  <label>Registration Fee (₹):</label>
  <input name="registrationFee" type="number" value={formData.registrationFee} onChange={handleChange} />

  <button type="submit" className="create-btn">Create Event</button>
</form>

      </div>
    </div>
  );
};

export default EventModal;
