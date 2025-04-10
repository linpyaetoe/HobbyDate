import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import api from "../security/fetchWithAuth";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // click log in --> navigates to event page
  const handleSubmit = async (e) => {
    e.preventDefault();

    // checks for empty fields
    if (!form.username || !form.password) {
      alert("All fields must be filled out!");
      return;
    }

    try {
      const res = await api.post("/login", form);
      login(res.data.user);
      navigate("/events");
    } catch (err) {
      console.error("Log in error:", err);
      alert("Log in failed. Please check your username & password again!");
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
        <h2>Log in to HobbyDate</h2>
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
              Log in
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
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: "bold" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
