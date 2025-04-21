import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../security/fetchWithAuth";
import { AuthContext } from "../security/AuthContext";
import LocationInput from "./LocationInput";
import "../styles/events.css";

export default function EventDetails() {
  // get event id and user info
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // event data and rsvp states
  const [event, setEvent] = useState(null);
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isPastEvent = event && new Date(event.endTime) < new Date();
  
  // track edited fields
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  
  // form field states
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  // setup navigation
  const navigate = useNavigate();

  // get specific event details
  useEffect(() => {
    api.get("/events").then((res) => {
      const found = res.data.find((e) => e.id === parseInt(id));
      if (found) {
        setEvent(found);
        
        // initialize form fields
        setTitle(found.title || "");
        setLocation(found.location || "");
        setDescription(found.description || "");
        setCategoryId(found.categoryId.toString() || "");
        
        // format dates
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); // format: YYYY-MM-DDThh:mm
        };
        
        setStartTime(formatDate(found.startTime));
        setEndTime(formatDate(found.endTime));
      }
    });
  }, [id]);

  // fetch categories for dropdown
  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // check if user has rsvp’d and fetch list of rsvps
  useEffect(() => {
    if (!user || !id) return;

    const fetchRsvpData = async () => {
      try {
        // check if current user is rsvp'd
        const rsvpStatusResponse = await api.get(`/${id}/rsvp`);
        setIsRsvpd(rsvpStatusResponse.data.isRsvpd);

        // get list of rsvps for this event
        const rsvpsResponse = await api.get(`/${id}/rsvps`);
        setRsvpList(rsvpsResponse.data);
      } catch (err) {
        console.error("Failed to fetch RSVP data:", err);
      }
    };

    fetchRsvpData();
  }, [id, user]);

  // save changes made to any editable field
  const handleSaveField = async (field) => {
    if (!event) return;
  
    try {
      const updateData = {};
  
      switch (field) {
        case "title":
          if (!validateField("Title", title, 60)) return;
          updateData.title = title;
          setIsEditingTitle(false);
          break;
  
        case "location":
          if (!validateField("Location", location)) return;
          updateData.location = location;
          setIsEditingLocation(false);
          break;
  
        case "time":
          if (!startTime || !endTime) {
            alert("Both start and end time must be filled out!");
            return;
          }
          const start = new Date(startTime);
          const end = new Date(endTime);
          if (end <= start) {
            alert("Your event can't end before it begins!");
            return;
          }
          updateData.startTime = startTime;
          updateData.endTime = endTime;
          setIsEditingTime(false);
          break;
  
        case "description":
          if (!validateField("Description", description, 1000)) return;
          updateData.description = description;
          setIsEditingDescription(false);
          break;
  
        case "category":
          if (!categoryId) {
            alert("Please select a category!");
            return;
          }
          updateData.categoryId = categoryId;
          setIsEditingCategory(false);
          break;
  
        default:
          break;
      }
      // api call to update the event
      const response = await api.put(`/events/${id}`, updateData);
      setEvent(response.data);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
      alert(`Failed to update ${field}. Please try again!`);
    }
  };

  // helper method for making sure fields cannot be empty or exceed char limit
  const validateField = (fieldName, value, maxLength = null) => {
    if (!value || value.trim() === "") {
      alert(`${fieldName} cannot be empty!`);
      return false;
    }
    if (maxLength && value.length > maxLength) {
      alert(`${fieldName} cannot exceed ${maxLength} characters!`);
      return false;
    }
    return true;
  };
  
  // handle rsvp or cancel rsvp
  const handleRsvp = async () => {
    if (!user) {
      alert("Please log in to RSVP");
      return;
    }

    setLoading(true);
    try {
      if (isRsvpd) {
        // cancel rsvp & fetch the updated rsvp list
        await api.delete(`/${id}/rsvp`);
        setIsRsvpd(false);
        const updatedRsvps = await api.get(`/${id}/rsvps`);
        setRsvpList(updatedRsvps.data);
      } else {
        // create rsvp & refresh rsvp list
        await api.post(`/${id}/rsvp`);
        setIsRsvpd(true);
        const rsvpsResponse = await api.get(`/${id}/rsvps`);
        setRsvpList(rsvpsResponse.data);
      }
    } catch (err) {
      console.error("RSVP action failed:", err);
      alert(err.response?.data?.error || "Failed to update RSVP status!");
    } finally {
      setLoading(false);
    }
  };

  // handle event deletion
  const handleDeleteEvent = async () => {
    if (!user || !isCreator) {
      alert("You can only delete events you created!");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone!"
    );
    if (!confirmDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/events/${id}`);
      alert("Event deleted successfully!");
      navigate("/events");
    } catch (err) {
      console.error("Delete event failed:", err);
      alert(err.response?.data?.error || "Failed to delete event!");
    } finally {
      setDeleteLoading(false);
    }
  };

  // gets category name
  const getCategoryName = () => {
    if (event && event.category) return event.category.name;
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category ? category.name : "Unknown category";
  };

  // show how many people are attending
  const displayedAttendees = (() => {
    if (!event) return rsvpList;
    const isCreatorIncluded = rsvpList.some(r => r.userId === event.userId);
    if (!isCreatorIncluded) {
      return [
        ...rsvpList,
        {
          id: `creator-${event.userId}`,
          userId: event.userId,
          username: event.user?.username || "Host"
        }
      ];
    }
    return rsvpList;
  })();

  // display if event page is not loading
  if (!event) return <p style={{ textAlign: "center", marginTop: "60px" }}>Loading event, please give it a moment!</p>;

  // checks if user is the creator of the event
  const isCreator = user && parseInt(user.id) === event.userId;


  return (
    <div className="event-details-wrapper">
      <div className="event-details-card">
        <div className="event-grid">

          <div className="event-left">

            {/* event title section */}
            <div className="edit-row">
              {isEditingTitle ? (
                <input className="edit-input" value={title} onChange={e => setTitle(e.target.value)}/>
              ) : (
                <h2 className="event-heading">{title}</h2>
              )}
              {isCreator && (
                <button
                  className="mini-edit-btn"
                  onClick={() => isEditingTitle ? handleSaveField('title') : setIsEditingTitle(true)}
                >
                  {isEditingTitle ? '💾' : '✏️'}
                </button>
              )}
            </div>

            {/* event category section */}
            <div className="edit-row">
              {isEditingCategory ? (
                <select
                  className="edit-select"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              ) : (
                <p className="event-category">📋 {event.category?.name}</p>
              )}
              {isCreator && (
                <button
                  className="mini-edit-btn"
                  onClick={() => isEditingCategory ? handleSaveField('category') : setIsEditingCategory(true)}
                >
                  {isEditingCategory ? '💾' : '✏️'}
                </button>
              )}
            </div>

            {/* event time section */}
            <div className="edit-row">
              {isEditingTime ? (
                <div className="time-inputs">
                  <input
                    type="datetime-local"
                    className="edit-input"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                  <input
                    type="datetime-local"
                    className="edit-input"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                  />
                </div>
              ) : (
                <p className="event-time">📅 {new Date(event.startTime).toLocaleString()} – {new Date(event.endTime).toLocaleString()}</p>
              )}
              {isCreator && (
                <button
                  className="mini-edit-btn"
                  onClick={() => isEditingTime ? handleSaveField('time') : setIsEditingTime(true)}
                >
                  {isEditingTime ? '💾' : '✏️'}
                </button>
              )}
            </div>

            {/* event location section */}
            <div className="edit-row">
              {isEditingLocation ? (
                <LocationInput value={location} onChange={setLocation} />
              ) : (
                <p className="event-location">📍 {location}</p>
              )}
              {isCreator && (
                <button
                  className="mini-edit-btn"
                  onClick={() => isEditingLocation ? handleSaveField('location') : setIsEditingLocation(true)}
                >
                  {isEditingLocation ? '💾' : '✏️'}
                </button>
              )}
            </div>

            </div>
            {/* attendee list section */}
            <div className="event-right">
              <div className="attendee-list">
                <p className="event-subtitle">Attendees ({rsvpList.length})</p>
                <ul className="attendee-ul">
                  {rsvpList.map(r => <li key={r.id} className="attendee-item">{r.username}</li>)}
                </ul>
            </div>
            
            {/* rsvp button section */}
            {!isCreator && !isPastEvent && (
              <button className="rsvp-button" onClick={handleRsvp} disabled={loading}>
                {isRsvpd ? 'Cancel RSVP' : 'RSVP to Event'}
              </button>
            )}

            {/* event details section */}
            <div className="event-description-box">
              <div className="edit-row">
                <p className="event-subtitle">Description</p>
                {isCreator && (
                  <button
                    className="mini-edit-btn"
                    onClick={() =>
                      isEditingDescription
                        ? handleSaveField("description")
                        : setIsEditingDescription(true)
                    }
                  >
                    {isEditingDescription ? "💾" : "✏️"}
                  </button>
                )}
              </div>
              {isEditingDescription ? (
                <textarea
                  className="edit-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <p className="event-description">{description}</p>
              )}
            </div>
            
            {/* delete event section */}
            {isCreator && (
              <div className="creator-buttons">
                <button className="delete-button" onClick={handleDeleteEvent} disabled={deleteLoading}>
                  Delete Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

