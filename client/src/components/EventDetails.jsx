import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../security/fetchWithAuth";
import { AuthContext } from "../security/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Get specific event details
  useEffect(() => {
    api.get("/events").then((res) => {
      const found = res.data.find((e) => e.id === parseInt(id));
      setEvent(found);
    });
  }, [id]);

  // Check if user is RSVP'd to this event and get RSVP list
  useEffect(() => {
    if (!user || !id) return;

    // Check if current user is RSVP'd
    api.get(`/${id}/rsvp`)
      .then(res => {
        setIsRsvpd(res.data.isRsvpd);
      })
      .catch(err => {
        console.error("Failed to check RSVP status:", err);
      });

    // Get list of RSVPs for this event
    api.get(`/${id}/rsvps`)
      .then(res => {
        setRsvpList(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch RSVPs:", err);
      });
  }, [id, user]);

  // Handle RSVP button click
  const handleRsvp = async () => {
    if (!user) {
      alert("Please log in to RSVP");
      return;
    }

    setLoading(true);
    try {
      if (isRsvpd) {
        // Cancel RSVP
        await api.delete(`/${id}/rsvp`);
        setIsRsvpd(false);
        // Remove user from RSVP list
        setRsvpList(rsvpList.filter(rsvp => rsvp.userId !== user.id));
      } else {
        // Create RSVP
        await api.post(`/${id}/rsvp`);
        setIsRsvpd(true);
        // Refresh RSVP list
        const rsvpsResponse = await api.get(`/${id}/rsvps`);
        setRsvpList(rsvpsResponse.data);
      }
    } catch (err) {
      console.error("RSVP action failed:", err);
      alert(err.response?.data?.error || "Failed to update RSVP status");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <p style={{ textAlign: "center", marginTop: "60px" }}>Loading event...</p>;

  // Check if user is the creator of the event (correctly comparing user ID)
  const isCreator = user && parseInt(user.id) === event.userId;

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
        
        <div style={{ marginBottom: "20px" }}>
          <p>Description: {event.description}</p>
          <p>Category: {event.category.name}</p>
          <p>Created by: {event.user.username}</p>
        </div>

        {user && !isCreator && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleRsvp}
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: isRsvpd ? "#ff4d4d" : "#4caf50", 
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Processing..." : isRsvpd ? "Cancel RSVP" : "RSVP to Event"}
            </button>
          </div>
        )}

        {isCreator && (
          <p style={{ marginTop: "20px", textAlign: "center", fontStyle: "italic" }}>
            You can't RSVP to your own event.
          </p>
        )}

        {/* RSVP List */}
        <div style={{ marginTop: "30px" }}>
          <h3>Attendees ({rsvpList.length})</h3>
          {rsvpList.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {rsvpList.map(rsvp => (
                <li key={rsvp.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  {rsvp.username}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: "italic" }}>No RSVPs yet. Be the first to join!</p>
          )}
        </div>
      </div>
    </div>
  );
}
