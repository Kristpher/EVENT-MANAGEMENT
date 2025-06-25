import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./notificationsStudent.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [registeredEvents,setRegisteredEvents]=useState([]);
  const navigate = useNavigate();
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

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
          setRegisteredEvents(data.registeredIds)
        } else {
          console.log("error", data.message);
        }
      } catch (error) {
        console.error("pending events Error:", error);
        alert("Error connecting to the server.");
      }
    };

    fetchData();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/student/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsSeen = async (index, id) => {
    try {
      await fetch(`${BACKEND_URL}/api/student/notifications/seen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ id }),
      });

      const updated = [...notifications];
      updated[index].seen = true;
      setNotifications(updated);
    } catch (err) {
      console.error("Failed to mark as seen", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/api/student/notifications/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ id }),
      });

      const updated = notifications.filter(n => n._id !== id);
      setNotifications(updated);
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

const handleSeeEvent = (events) => {
  if (Array.isArray(events)) {
    events = events[0];  
  }
  
  if (events && events.eventName) {
    console.log(registeredEvents);
    console.log(events._id)
    const isRegistered =registeredEvents.includes(events._id)
    console.log(isRegistered);
    console.log(events.eventName, events, " this is event");
    navigate(`/Student-event-details/${events.eventName}`, {
      state: { events, isRegistered }
    });
  }
};
  return (
    <div className="notifications-page">
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((n, i) => (
            <div
              key={n._id}
              className={`notification-item ${n.seen ? "seen" : "unseen"}`}
              onClick={() => markAsSeen(i, n._id)}
            >
              <p>{n.message}</p>
              <span className="timestamp">
                {new Date(n.createdAt).toLocaleString()}
              </span>

              <div className="notif-actions">
                <button onClick={(e) => { e.stopPropagation(); handleSeeEvent(n.event); }}>
                  See Event
                </button>
                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
