import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrganizerLS.css"; 


const OrganizerSignupPage = () => {
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;

  const handleSignupPage = async() => {
    console.log("Organiser signup page started");
    try{
       const response = await fetch(`${BACKEND_URL}/organizer/signup`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({email,orgName,password})
       });
       console.log("Response Organiser SignUP",response);
       const data =await response.json();
       console.log("Parsed Response: ",data);
       if(data.success){
         alert("Signup Organiser successful");
         localStorage.setItem('auth-token',data.token);
         window.location.replace("/organizer/login");
       }
       else{
        console.log("Signup Organiser failed: "+(data.message||"Unknown error"))
       }
    
    }
    catch(error){
  console.error("Signup Error:", error);
        console.log("Error connecting to the server.");
    }
  };

  return (
    <div className="organizer-container">
      <h1 className="organizer-title">Organizer</h1>
      <div className="login-box">
        <h2 className="login-title">Signup</h2>

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
          placeholder="Create Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleSignupPage}>
          Sign Up
        </button>

        <p className="redirect-text">
          Already registered?{" "}
          <span onClick={() => navigate("/organizer/login")} className="redirect-link">
            Login
          </span>
        </p>
      </div>
     
    </div>
  );
};

export default OrganizerSignupPage;
