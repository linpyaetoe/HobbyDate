import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../security/fetchWithAuth";

export default function CreateEvents() {
  const [form, setForm] = useState({ title: "", description: "", categoryId: "" });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // get preset categories
  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  // click create event --> navigates to events page
  const handleSubmit = async (e) => {
    e.preventDefault();

    // checks for empty fields
    if (!form.title || !form.description || !form.categoryId) {
      alert("All fields must be filled out!");
      return;
    }

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
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Create a New Event</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{
              padding: "12px",
              width: "80%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            style={{
              padding: "12px",
              width: "80%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              resize: "vertical",
            }}
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            style={{
              padding: "12px",
              width: "80%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "12px 24px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
