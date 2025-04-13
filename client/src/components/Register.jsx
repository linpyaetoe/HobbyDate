import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import api from "../security/fetchWithAuth";
import { motion } from "framer-motion";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      alert("All fields must be filled out!");
      return;
    }

    try {
      const res = await api.post("/register", form);
      login(res.data.user);
      navigate("/events");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This username or email already exists. Try logging in instead!");
      } else {
        alert("Registration failed. Please try again!");
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="auth-title">Create your account</h1>
        <h2 className="auth-subtitle">let your hobbies do the matchmaking</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="username"
            className="auth-input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="email"
            className="auth-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="password"
            className="auth-input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="auth-button-group">
            <button type="submit" className="auth-button primary">Register</button>
            <Link to="/">
              <button type="button" className="auth-button cancel">Cancel</button>
            </Link>
          </div>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
