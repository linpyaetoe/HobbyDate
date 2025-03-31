import { useEffect, useState } from "react";
import api from "../security/fetchWithAuth";
import { Link } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);

  // get all events
  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data));
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h2>All Events</h2>
      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              textAlign: "left",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Link to={`/events/${event.id}`} style={{ textDecoration: "none", color: "black" }}>
              <h3 style={{ marginBottom: "10px" }}>{event.title}</h3>
            </Link>
            <p style={{ marginBottom: "8px" }}>{event.description}</p>
            <small>Category: {event.category.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
