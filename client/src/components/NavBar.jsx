import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../security/AuthContext";
import { Calendar, PlusSquare, User, LogOut, LogIn, UserPlus } from "lucide-react";
import "../styles/navBar.css";

export default function NavBar({ children }) {
  // get user & logout method from auth context
  const { user, logout } = useContext(AuthContext);

  // get current route info
  const location = useLocation();
  const navigate = useNavigate();

  // hides navbar on home, login & register pages
  const hideNav = ["/", "/login", "/register", "/profile-setup"].includes(location.pathname);

   // handle logout --> goes to homepage
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>

      {/* hides nav bar for certain pages*/}
      {!hideNav && (
        <nav className="navbar">
          <Link to="/events" className="button">
            <Calendar className="nav-icon" />
            All events
          </Link>

          {/* nav section for authenticated users */}
          {user ? (
            <>
              <Link to="/create" className="button">
                <PlusSquare className="nav-icon" />
                Create event
              </Link>

              <Link to="/profile" className="button">
                <User className="nav-icon" />
                Profile
              </Link>

              <button onClick={handleLogout} className="button">
                <LogOut className="nav-icon" />
                Log out
              </button>
            </>
          ) : (
            <>
              {/* nav section for not authenticated users */}
              <Link to="/login" className="button">
                <LogIn className="nav-icon" />
                Log in
              </Link>

              <Link to="/register" className="button">
                <UserPlus className="nav-icon" />
                Register
              </Link>
            </>
          )}
        </nav>
      )}

      <main>{children}</main>
    </div>
  );
}
