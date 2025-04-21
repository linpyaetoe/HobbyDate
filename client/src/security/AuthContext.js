import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./fetchWithAuth";

// context for sharing log in info
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // log in w/ user info
  const login = (userData) => {
    setUser(userData);
    navigate("/");
  };

  // log out & clear user info
  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
