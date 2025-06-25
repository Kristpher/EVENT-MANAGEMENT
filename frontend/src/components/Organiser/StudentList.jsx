import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './StudentList.css';

const StudentList = () => {
  const [Students, setStudents] = useState([]);
  const { state: event } = useLocation();
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    console.log(event.students)
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get-registered-students`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "auth-token": localStorage.getItem("auth-token")
          },

          body: JSON.stringify({ student: event.students }) 
        });
    
        const data = await response.json();

        if (data.students) {
          setStudents(data.students);
        } else {
          console.log("Failed to get student list");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [event]);

  return (
    <div className="MainStudentList-organizer">
      <div className="student-grid">
        {Students && Students.map((item, key) => (
          <div key={key} className="student-card">
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Roll No:</strong> {item.rollnumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
