import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../security/fetchWithAuth";
import LocationInput from "./LocationInput";
import { AuthContext } from "../security/AuthContext";
import "../styles/events.css";

export default function EditEvent() {
  // get event id and user info
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // event data
  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    location: "",
    startTime: "",
    endTime: "",
    description: ""
  });
  const [categories, setCategories] = useState([]); // for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // fetch the event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get("/events");
        const foundEvent = res.data.find((e) => e.id === parseInt(id));
        
        if (!foundEvent) {
          setError("Event not found");
          return;
        }
        
        // check if user is the creator
        if (!user || user.id !== foundEvent.userId.toString()) {
          setError("You can only edit events you created");
          return;
        }
        
        // format dates
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); // format: YYYY-MM-DDThh:mm
        };
        
        setForm({
          title: foundEvent.title || "",
          categoryId: foundEvent.categoryId.toString() || "",
          location: foundEvent.location || "",
          startTime: formatDate(foundEvent.startTime),
          endTime: formatDate(foundEvent.endTime),
          description: foundEvent.description || ""
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Failed to load event details!");
      }
    };
    
    fetchEvent();
  }, [id, user]);

  // fetch categories
  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle location change
  const handleLocationChange = (location) => {
    setForm({ ...form, location });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, categoryId, location, startTime, endTime, description } = form;

    // check 1: checks for empty fields
    if (
      !title.trim() ||
      !categoryId ||
      !location.trim() ||
      !startTime ||
      !endTime ||
      !description.trim()
    ) {
      alert("All fields must be filled out!");
      return;
    }

    // convert dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // check 2: end time must be after start time
    if (end <= start) {
      alert("Your event can't end before it begins!");
      return;
    }

    // check 3: title length
    if (title.length > 60) {
      alert("Your title is a bit too long — try keeping it under 60 characters!");
      return;
    }

    // check 4: description length
    if (description.length > 1000) {
      alert("Your description is a bit too long — try keeping it under 1000 characters!");
      return;
    }

    // update event
    try {
      await api.put(`/events/${id}`, form);
      alert("Event updated successfully!");
      navigate(`/events/${id}`);
    } catch (err) {
      console.error("Failed to update event:", err);
      alert(err.response?.data?.error || "Something went wrong. Please try again!");
    }
  };

  // handle cancel
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All unsaved changes will be lost!"
    );
    if (confirmCancel) {
      navigate(`/events/${id}`);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "60px" }}>Loading event details...</p>;
  }

  if (error) {
    return (
      <div className="events-page-wrapper">
        <div className="events-card">
          <h1 className="events-title">Error</h1>
          <p style={{ textAlign: "center", fontSize: "1.2rem" }}>{error}</p>
          <div className="events-button-group">
            <button className="events-button cancel" onClick={() => navigate(`/events/${id}`)}>
              Back to Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page-wrapper">
      <div className="events-card">
        <h1 className="events-title">Edit Event</h1>
        <form className="events-form" onSubmit={handleSubmit}>
          
          {/* title section */}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give it a catchy title"
            />
          </div>

          {/* category section */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Loading categories...</option>
              )}
            </select>
          </div>
          
          {/* location section */}
          <div className="form-group">
            <label className="form-label">Location</label>
            <LocationInput
              value={form.location}
              onChange={handleLocationChange}
              placeholder="Where's the magic happening?"
            />
          </div>
          
          {/* start time section */}
          <div className="form-group">
            <label className="form-label">Start time</label>
            <input
              className="form-input"
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
            />
          </div>
          
          {/* end time section */}
          <div className="form-group">
            <label className="form-label">End time</label>
            <input
              className="form-input"
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>
              
          {/* description section */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="The what, why and wow. Hype it up!"
            />
          </div>
          
          {/* buttons section */}
          <div className="events-button-group">
            <button className="events-button create" type="submit">Save Changes</button>
            <button className="events-button cancel" type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
} 