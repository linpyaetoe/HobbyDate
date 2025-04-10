import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import Events from "./components/Events";
import CreateEvents from "./components/CreateEvents";
import EventDetails from "./components/EventDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
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
