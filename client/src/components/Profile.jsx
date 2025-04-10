import { useContext } from "react";
import { AuthContext } from "../security/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  
  // displays username & email in profile page
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "700px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>My Profile</h2>
        <p style={{ marginBottom: "10px" }}>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
}
