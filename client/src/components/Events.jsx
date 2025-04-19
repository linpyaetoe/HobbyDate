import { useEffect, useState } from "react";
import api from "../security/fetchWithAuth";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Events() {
  const [events, setEvents] = useState([]);

  // get all events
  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data));
  }, []);

  return (
    <div className="home-page-wrapper">
      <h2 className="home-title">All Events</h2>
      <div className="events-grid">
        {events.map((event) => (
          <Link to={`/events/${event.id}`} key={event.id} className="event-glass-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-info">📍 {event.location || "Location TBD"}</p>
            <p className="event-info">👥 {event.attendees?.length || 0} attending</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
