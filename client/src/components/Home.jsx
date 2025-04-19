import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../security/fetchWithAuth";
import "../styles/home.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const handleUnauthClick = () => {
    alert("Please log in to view event details.");
  };

  return (
    <div className="home-page-wrapper">
      <div className="intro-card">
        <h1 className="home-title">Welcome to HobbyDate!</h1>
        <p className="home-description">
          HobbyDate is your go-to platform to discover, create & share fun events with your community.
          Whether you're into rock climbing, dancing or just exploring new interests — simply post &
          let others join you. Or, find hobbies you love & connect with new friends who share your passions!
        </p>
        <div className="button-group">
          <button className="auth-button primary" onClick={() => navigate("/login")}>Log In</button>
          <button className="auth-button cancel" onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      </div>

      <div className="events-grid">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="event-glass-card"
            onClick={handleUnauthClick}
            style={{ cursor: "pointer" }}
          >
            <h3 className="event-title">{event.title}</h3>
            <p className="event-info">📍 {event.location || "Location TBD"}</p>
            <p className="event-info">👥 {event.attendees?.length || 0} attending</p>
          </div>
        ))}
      </div>
    </div>
  );
}
