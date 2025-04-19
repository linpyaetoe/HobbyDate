import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../security/fetchWithAuth";
import { AuthContext } from "../security/AuthContext";
import LocationInput from "./LocationInput";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useContext(AuthContext);
  
  // Edit state management
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  
  // Form field states
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  // Get specific event details
  useEffect(() => {
    api.get("/events").then((res) => {
      const found = res.data.find((e) => e.id === parseInt(id));
      if (found) {
        setEvent(found);
        
        // Initialize form fields
        setTitle(found.title || "");
        setLocation(found.location || "");
        setDescription(found.description || "");
        setCategoryId(found.categoryId.toString() || "");
        
        // Format dates for datetime-local input
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
        };
        
        setStartTime(formatDate(found.startTime));
        setEndTime(formatDate(found.endTime));
      }
    });
  }, [id]);

  // Fetch categories for dropdown
  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
      });
  }, []);

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

  // Handle saving changes for a field
  const handleSaveField = async (field) => {
    if (!event) return;
    
    try {
      const updateData = {};
      
      switch(field) {
        case "title":
          updateData.title = title;
          setIsEditingTitle(false);
          break;
        case "location":
          updateData.location = location;
          setIsEditingLocation(false);
          break;
        case "time":
          updateData.startTime = startTime;
          updateData.endTime = endTime;
          
          // Validate dates
          const start = new Date(startTime);
          const end = new Date(endTime);
          
          if (end <= start) {
            alert("End time must be after start time!");
            return;
          }
          
          setIsEditingTime(false);
          break;
        case "description":
          updateData.description = description;
          setIsEditingDescription(false);
          break;
        case "category":
          updateData.categoryId = categoryId;
          setIsEditingCategory(false);
          break;
        default:
          break;
      }
      
      // Make the API call to update the event
      const response = await api.put(`/events/${id}`, updateData);
      setEvent(response.data);
      
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
      alert(`Failed to update ${field}. Please try again.`);
    }
  };

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

  // Handle Delete Event button click
  const handleDeleteEvent = async () => {
    if (!user || !isCreator) {
      alert("You can only delete events you created");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/events/${id}`);
      alert("Event deleted successfully");
      navigate("/events"); // Redirect to events page
    } catch (err) {
      console.error("Delete event failed:", err);
      alert(err.response?.data?.error || "Failed to delete event");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!event) return <p style={{ textAlign: "center", marginTop: "60px" }}>Loading event...</p>;

  // Check if user is the creator of the event
  const isCreator = user && parseInt(user.id) === event.userId;

  // Get category name
  const getCategoryName = () => {
    if (event && event.category) return event.category.name;
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category ? category.name : "Unknown category";
  };

  return (
    <div className="event-details-wrapper">
      <div className="event-details-card">
        <div className="event-grid">
          
          {/* left section: host info, time, location */}
          <div className="event-left">
            {isEditingTitle ? (
              <div className="edit-container">
                <input
                  className="edit-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button className="save-btn" onClick={() => handleSaveField("title")}>
                  Save
                </button>
              </div>
            ) : (
              <h2 className="event-heading">
                {event.title}
                {isCreator && (
                  <button 
                    className="mini-edit-btn" 
                    onClick={() => setIsEditingTitle(true)}
                  >
                    ✏️
                  </button>
                )}
              </h2>
            )}
            
            <p className="event-host">👤 Hosted by {event.user.username}</p>
            
            {isEditingTime ? (
              <div className="edit-container time-edit">
                <div className="time-inputs">
                  <div>
                    <label>Start:</label>
                    <input
                      type="datetime-local"
                      className="edit-input"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>End:</label>
                    <input
                      type="datetime-local"
                      className="edit-input"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                <button className="save-btn" onClick={() => handleSaveField("time")}>
                  Save
                </button>
              </div>
            ) : (
              <p className="event-time">
                📅 {new Date(event.startTime).toLocaleString()} – {new Date(event.endTime).toLocaleString()}
                {isCreator && (
                  <button 
                    className="mini-edit-btn" 
                    onClick={() => setIsEditingTime(true)}
                  >
                    ✏️
                  </button>
                )}
              </p>
            )}
            
            {isEditingLocation ? (
              <div className="edit-container">
                <LocationInput
                  value={location}
                  onChange={setLocation}
                  placeholder="Event location"
                />
                <button className="save-btn" onClick={() => handleSaveField("location")}>
                  Save
                </button>
              </div>
            ) : (
              <p className="event-location">
                📍 {event.location}
                {isCreator && (
                  <button 
                    className="mini-edit-btn" 
                    onClick={() => setIsEditingLocation(true)}
                  >
                    ✏️
                  </button>
                )}
              </p>
            )}
            
            {isEditingCategory ? (
              <div className="edit-container">
                <select
                  className="edit-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button className="save-btn" onClick={() => handleSaveField("category")}>
                  Save
                </button>
              </div>
            ) : (
              <p className="event-category">
                🏷️ {getCategoryName()}
                {isCreator && (
                  <button 
                    className="mini-edit-btn" 
                    onClick={() => setIsEditingCategory(true)}
                  >
                    ✏️
                  </button>
                )}
              </p>
            )}
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
              <div className="creator-actions">
                <p className="event-note">You can't RSVP to your own event!</p>
                <div className="creator-buttons">
                  <button
                    className="delete-button"
                    onClick={handleDeleteEvent}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete Event"}
                  </button>
                </div>
              </div>
            )}
  
            <div className="event-description-box">
              <div className="description-header">
                <p className="event-subtitle">Details</p>
                {isCreator && (
                  <button 
                    className="mini-edit-btn" 
                    onClick={() => setIsEditingDescription(true)}
                  >
                    ✏️
                  </button>
                )}
              </div>
              
              {isEditingDescription ? (
                <div className="edit-container">
                  <textarea
                    className="edit-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button className="save-btn" onClick={() => handleSaveField("description")}>
                    Save
                  </button>
                </div>
              ) : (
                <p className="event-description">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
