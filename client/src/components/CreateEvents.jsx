import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../security/fetchWithAuth";
import LocationInput from "./LocationInput";
import "../styles/events.css";

export default function CreateEvents() {
  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    location: "",
    startTime: "",
    endTime: "",
    description: ""
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // get preset categories
  useEffect(() => {
    console.log("Fetching categories...");
    api.get("/categories")
      .then((res) => {
        console.log("Categories response:", res.data);
        setCategories(res.data);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // updates form field
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle location change from LocationInput component
  const handleLocationChange = (location) => {
    setForm({ ...form, location });
  };

  // click create event --> navigates to events page
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, categoryId, location, startTime, endTime, description } = form;

    // checks for empty fields
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

    // convert to Date objects
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // check 1: both start & end times must be in the future
    if (start <= now || end <= now) {
      alert("Events cannot happen in the past!");
      return;
    }

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
      alert("Your title is a bit too long — try keeping it under 1000 characters!");
      return;
    }

    // create event in backend
    try {
      await api.post("/events", form);
      alert("Event created!");
      navigate("/events");
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Something went wrong. Please try again!");
    }
  };

  // click cancel --> navigates to events page
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All unsaved changes will be lost!"
    );
    if (confirmCancel) {
      navigate("/events");
    }
  };

  return (
    <div className="events-page-wrapper">
      <div className="events-card">
        <h1 className="events-title">Host your own event</h1>
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
          
          {/* location section - now uses our new LocationInput component */}
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
            <button className="events-button create" type="submit">Create</button>
            <button className="events-button cancel" type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
