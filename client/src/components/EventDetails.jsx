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

  // Check if user is the creator of the event
  // The userId field in the event object needs to be compared with the id from the user object
  const isCreator = user && parseInt(user.id) === event.userId;

  return (
    <div className="event-details-wrapper">
      <div className="event-details-card">
        <div className="event-grid">
          
          {/* left section: host info, time, location */}
          <div className="event-left">
            <h2 className="event-heading">{event.title}</h2>
            <p className="event-host">👤 Hosted by {event.user.username}</p>
            <p className="event-time">📅 {new Date(event.startTime).toLocaleString()} – {new Date(event.endTime).toLocaleString()}</p>
            <p className="event-location">📍 {event.location}</p>
            <p className="event-category">🏷️ {event.category.name}</p>
          </div>
  
          {/* right section: attendees, RSVP button, description */}
          <div className="event-right">
            <div className="attendee-list">
              <p className="event-subtitle">Attendees ({rsvpList.length}):</p>
              {rsvpList.length > 0 ? (
                <ul className="attendee-ul">
                  {rsvpList.map((rsvp) => (
                    <li key={rsvp.id} className="attendee-item">
                      {rsvp.username}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-rsvp">**add avatars of the attendees here**</p>
              )}
            </div>
  
            {!isCreator && user && (
              <button
                className={`rsvp-button ${isRsvpd ? "cancel" : "join"}`}
                onClick={handleRsvp}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isRsvpd
                  ? "Cancel RSVP"
                  : "RSVP to Event"}
              </button>
            )}
  
            {isCreator && (
              <p className="event-note">You can't RSVP to your own event NOTE TO CHANGE TO GREY BOX.</p>
            )}
  
            <div className="event-description-box">
              <p className="event-subtitle">Details</p>
              <p className="event-description">{event.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
