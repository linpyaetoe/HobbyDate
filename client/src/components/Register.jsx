import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import api from "../security/fetchWithAuth";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // click register --> navigates to event page
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // checks for empty fields
    if (!form.username || !form.email || !form.password) {
      alert("All fields must be filled out!");
      return;
    }
  
    try {
      const res = await api.post("/register", form);
      login(res.data.user);
      navigate("/events");
    } catch (err) {
      console.error("Register error:", err);
  
      // checks for duplicate username/email
      if (err.response && err.response.status === 409) {
        alert("This username or email already exists. Try logging in instead!");
      } else {
        alert("Registration failed. Please try again!");
      }
    }
  };
  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginTop: "80px",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "40px 40px",
          maxWidth: "670px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Create Your HobbyDate Account</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "30px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            style={{
              padding: "12px",
              width: "80%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            style={{
              padding: "12px",
              width: "80%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            style={{
              padding: "12px",
              width: "80%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
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
              Register
            </button>
            <Link to="/">
              <button
                type="button"
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
            </Link>
          </div>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
