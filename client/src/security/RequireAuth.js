import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function RequireAuth({ children }) {
  // get current user from context
  const { user } = useContext(AuthContext);
  
  // redirect to log in if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}