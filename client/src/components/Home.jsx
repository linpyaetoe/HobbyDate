import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginTop: "80px",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "40px 40px",
          maxWidth: "670px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1>Welcome to HobbyDate! </h1>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          HobbyDate is your go-to platform to discover, create & share
          fun events with your community. Whether you're into rock climbing, 
          dancing, photography or just exploring new interests — 
          simply post & let others join you. Or, find hobbies you love & 
          connect with new friends who share your passions!
          <br />
          <br />
          <strong>Get started now! 😊</strong>
        </p>
        <div style={{ marginTop: "30px" }}>
          <Link to="/login">
            <button style={{ marginRight: "10px" }}>Login</button>
          </Link>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
