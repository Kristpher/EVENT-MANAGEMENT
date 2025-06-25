import React, { useState ,useEffect} from "react";
import PopularEventsCard from "./PopularEventsCard";
import "./PopularEvents.css";

const PopularEvents = () => {
   const [p1,setP1]=useState([]);
   const [events,setEvents]=useState([]);
   const [regIds,setRegIds]=useState([]);
     const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
     useEffect(()=>{
      console.log("currentINdex",p1[currentIndex]);
        console.log("RegIds",regIds);

    },[p1,regIds])
 useEffect(() => {
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
        const allEvents = data.organizerData
          .flatMap(org => org.approvedEvents || []);
        //console.log(allEvents);
        //console.log(data.registeredIds);
        let i = allEvents.length < 4 ? allEvents.length : 4;

        setP1(allEvents.slice(0, i));
        setRegIds(data.registeredIds);
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? p1.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === p1.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="MainPopularEvents">
      <button className="arrow-btn left" onClick={handlePrev}>
        <i className="fas fa-chevron-left"></i>
      </button>

      <div className="carousel">{
        p1&&
        <PopularEventsCard events={p1[currentIndex]} regIds={regIds} />}
      </div>

      <button className="arrow-btn right" onClick={handleNext}>
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default PopularEvents;
