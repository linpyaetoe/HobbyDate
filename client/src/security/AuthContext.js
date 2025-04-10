import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./fetchWithAuth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
    navigate("/");
  };

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
