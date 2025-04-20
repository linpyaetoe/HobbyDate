import { useEffect, useState } from "react";
import api from "../security/fetchWithAuth";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    api.get("/events").then((res) => {
      const now = new Date();

      const upcoming = [];
      const past = [];

      res.data.forEach(event => {
        const end = new Date(event.endTime);
        if (end > now) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    });
  }, []);

  return (
    <div className="home-page-wrapper">
      <h2 className="home-title">Upcoming Events</h2>
      <div className="events-grid">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="event-glass-card"
            onClick={() => navigate(`/events/${event.id}`)}
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
            className="event-glass-card event-card-past"
            onClick={() => navigate(`/events/${event.id}`)}
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
