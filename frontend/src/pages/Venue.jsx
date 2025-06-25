import { useEffect, useState } from "react";
import './Venue.css';

const Venue = ({ onClose, bookingMap, onSelect, startTime, endTime, date }) => {
  const [bookmap, setBookmap] = useState(null);
  const [venues, setVenues] = useState(null);
  const [available, setAvailable] = useState([]);
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/getvenue`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        });
        const data = await response.json();
        console.log("refined data", data);
        if (data.success) {
          setBookmap(data.venues);
          setVenues([...new Set(data.venues.map(item => item.venueName))]);
        } else {
          console.log("error", data.message);
        }
      } catch (error) {
        console.error("registered events Error:", error);
        alert("Error connecting to the server.");
      }
    };

    fetchdata();
  }, []);

  const parseTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  const checkAvailability = () => {
    if (!bookmap || !venues) return;

    const startNew = parseTime(startTime);
    const endNew = parseTime(endTime);
    const availableList = [];


    for (let venue of bookmap) {
      const venueName = venue.venueName;
      const dateObj = venue.dateArray.find(d => d.date === date);

      if (!dateObj) {
      
        availableList.push(venueName);
        continue;
      }

      let isAvailable = true;

      for (let slot of dateObj.slots) {
        const startBooked = parseTime(slot.startTime);
        const endBooked = parseTime(slot.endTime);

        if (isOverlap(startNew, endNew, startBooked, endBooked)) {
          isAvailable = false;
          console.log("Overlapping:", venueName);
          break;
        }
      }

      if (isAvailable) {
        availableList.push(venueName);
      }
    }

    setAvailable(availableList);
  };

  useEffect(() => {
    if (bookmap && venues) {
      checkAvailability();
    
    }
    console.log(bookmap);
    console.log(venues);
  }, [bookmap, venues, startTime, endTime, date]);

  const handleVenue = (item) => {
    onSelect(item);
  };

  return (
    <div className="MainVenueDiv">
      <h3>Available Locations</h3>
      <button className="close-btn" onClick={onClose}>✕</button>
      <div className="venues">
        {available.length === 0 ? (
          <p>No venues available for the selected time.</p>
        ) : (
          available.map((item, index) => (
            <div className="available" key={index}>
              {item}
              <button onClick={() => handleVenue(item)}>Select</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Venue;
