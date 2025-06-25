import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrganizerLS.css";

const OrganizerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
const handleLogin = async () => {
  console.log("Logging in", { email, orgName, password });

  try {
    const response = await fetch(`${BACKEND_URL}/organizer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, orgName, password }),
    });

    console.log("response of organizer login reached", response);

    const data = await response.json();
    console.log("refined json data: ", data);

    if (response.ok && data.success) {
      alert("Login is successful");
      localStorage.setItem("auth-token", data.token);
      window.location.replace("/organizer/active");
    } else {
      console.log("Login failed: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Login Error:", error);
    console.log("Error connecting to the server.");
  }
};

  
  return (
    <div className="organizer-container">
      <h1 className="organizer-title">Organizer</h1>
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Organization Name"
          className="login-input"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p className="redirect-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/organizer/signup")} className="redirect-link">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrganizerLoginPage;
