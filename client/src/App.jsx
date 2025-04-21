import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/NavBar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import CreateEvents from "./pages/CreateEvents";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import { AuthProvider } from "./security/AuthContext";
import RequireAuth from "./security/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/create"
              element={
                <RequireAuth>
                  <CreateEvents />
                </RequireAuth>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <RequireAuth>
                  <EditEvent />
                </RequireAuth>
              }
            />
            <Route
              path="/profile-setup"
              element={
                <RequireAuth>
                  <ProfileSetup />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
          </Routes>
        </AppLayout>
    </AuthProvider>
  );
}
