import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../security/fetchWithAuth";
import "../styles/home.css";

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const navigate = useNavigate();

  // get all events
  useEffect(() => {
    api.get("/events").then((res) => {
      const now = new Date();
      const upcoming = [];
      const past = [];

      res.data.forEach((event) => {
        const endTime = new Date(event.endTime);
        if (endTime > now) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    });
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

      <h2 className="home-title">Upcoming Events</h2>
      <div className="events-grid">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="event-glass-card"
            onClick={handleUnauthClick}
            style={{ cursor: "pointer" }}
          >
            <h3 className="event-title">{event.title}</h3>
            <p className="event-info">📍 {event.location || "Location TBD"}</p>
            <p className="event-info">👥 {event.attendees} attending</p>
          </div>
        ))}
      </div>

      <h2 className="home-title">Past Events</h2>
      <div className="events-grid">
        {pastEvents.map((event) => (
          <div
            key={event.id}
            className="event-glass-card"
            onClick={handleUnauthClick}
            style={{ cursor: "pointer" }}
          >
            <h3 className="event-title">{event.title}</h3>
            <p className="event-info">📍 {event.location || "Location TBD"}</p>
            <p className="event-info">👥 {event.attendees} attended</p>
          </div>
        ))}
      </div>
    </div>
  );
}
