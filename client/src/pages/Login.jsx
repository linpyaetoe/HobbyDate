import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import api from "../security/fetchWithAuth";
import { motion } from "framer-motion";
import "../styles/auth.css";

export default function Login() {
  // get user info
  const { login } = useContext(AuthContext);

  // form state for logging in user
  const [form, setForm] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  // handle form submit for logging in
  const handleSubmit = async (e) => {
    e.preventDefault();

    // check for empty fields
    if (!form.username || !form.password) {
      alert("All fields must be filled out!");
      return;
    }

    try {
      // try to log in
      const res = await api.post("/login", form);
      login(res.data.user);
      navigate("/events");
    } catch (err) {
      alert("Log in failed. Please check your username & password again!");
    }
  };

  return (
    <div className="auth-page-wrapper">

      {/* title section */}
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="auth-title">Log in to HobbyDate</h1>
        <h2 className="auth-subtitle">warning: may spark spontaneous friendships</h2>

        {/* log in info section */}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="username"
            className="auth-input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="password"
            className="auth-input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* buttons section */}
          <div className="auth-button-group">
            <button type="submit" className="auth-button primary">Log in</button>
            <Link to="/">
              <button type="button" className="auth-button cancel">Cancel</button>
            </Link>
          </div>
        </form>

        {/* register section */}
        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
