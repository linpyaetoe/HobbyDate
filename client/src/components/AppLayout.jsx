import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../security/AuthContext";

export default function AppLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate(); // 👈 add this

  // hides navbar on home, login & register pages
  const hideNav = ["/", "/login", "/register"].includes(location.pathname);

  // click logout --> navigates to home page
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {!hideNav && (
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
            padding: "20px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Link to="/events">Events</Link>
          {user ? (
            <>
              <Link to="/create">Create</Link>
              <Link to="/profile">Profile</Link>
              <button
                onClick={handleLogout}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1em",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
}
