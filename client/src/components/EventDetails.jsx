import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../security/fetchWithAuth";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  // get specific event details
  useEffect(() => {
    api.get("/events").then((res) => {
      const found = res.data.find((e) => e.id === parseInt(id));
      setEvent(found);
    });
  }, [id]);

  if (!event) return <p style={{ textAlign: "center", marginTop: "60px" }}>Loading event...</p>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "700px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "left",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>{event.title}</h2>
        <p style={{ marginBottom: "10px" }}>
        <p>Description: {event.description}</p>
        <p>Category: {event.category.name}</p>
        <p>Created by: {event.user.username}</p>
        </p>
      </div>
    </div>
  );
}
