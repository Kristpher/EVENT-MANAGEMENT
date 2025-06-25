import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./notificationsStudent.css"; 

const NotificationsPageOrg = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/organizer/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch organiser notifications", err);
    }
  };

  const markAsSeen = async (index, id) => {
    try {
      await fetch(`${BACKEND_URL}/api/organizer/notifications/seen`, {
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
      await fetch(`${BACKEND_URL}/api/organizer/notifications/delete`, {
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

  const handleSeeEvent = (event) => {
    if (Array.isArray(event)) event = event[0];
    if (event && event.eventName) {
        console.log(event)
        console.log(event.eventName)
        
      navigate(`/Organizer-active/${event.eventName}`, {
        state: { event },
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

export default NotificationsPageOrg;
