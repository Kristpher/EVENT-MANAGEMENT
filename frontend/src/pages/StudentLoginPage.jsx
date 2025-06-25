import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentStyle.css";



const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async() => {
    console.log("Logging in", { email, rollNo, password });
    
    
  try {
    const response = await fetch(`${BACKEND_URL}/student/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, rollNo, password }),
    });

    console.log("response of organizer login reached", response);

    const data = await response.json();
    console.log("refined json data: ", data);

    if (response.ok && data.success) {
      alert("Login is Successful!");
      localStorage.setItem("auth-token", data.token);
      navigate("/student/popular");
    } else {
      console.log("Something went wrong!",data.message);

    }
  } catch (error) {
    console.error("Login Error:", error);
  
  }
  };

  return (
    <div className="student-container">
      <h1 className="student-title">Student</h1>
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
          placeholder="Roll No"
          className="login-input"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
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
          <span onClick={() => navigate("/student/signup")} className="redirect-link">
            Sign up
          </span>
        </p>
      </div>
     
    </div>
  );
};

export default StudentLoginPage;
