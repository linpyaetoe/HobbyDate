import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../security/AuthContext";
import { Calendar, PlusSquare, User, LogOut } from "lucide-react"; 
import "../styles/navBar.css";

export default function NavBar({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // hides navbar on home, login & register pages
  const hideNav = ["/", "/login", "/register", "/profile-setup"].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {!hideNav && (
        <nav className="navbar">
          <Link to="/events" className="button">
            <Calendar size={25} style={{ marginRight: 8 }} />
            All events
          </Link>

          {user ? (
            <>
              <Link to="/create" className="button">
                <PlusSquare size={25} style={{ marginRight: 10 }} />
                Create event
              </Link>

              <Link to="/profile" className="button">
                <User size={25} style={{ marginRight: 10 }} />
                Profile
              </Link>

              <button onClick={handleLogout} className="button">
                <LogOut size={25} style={{ marginRight: 10 }} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">Login</Link>
              <Link to="/register" className="nav-button">Register</Link>
            </>
          )}
        </nav>
      )}

      <main>{children}</main>
    </div>
  );
}
