import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentStyle.css";

const StudentSignupPage = () => {
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;

  const handleSignup = async() => {
    console.log("Signing up", { email, rollNo, password });
   
     try{
       const response = await fetch(`${BACKEND_URL}/student/signup`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({email,rollNo,password})
       });
       console.log("Response Student SignUP",response);
       const data =await response.json();
       console.log("Parsed Response: ",data);
       if(data.success){
         alert("Signup successful");
         localStorage.setItem('auth-token',data.token);
         navigate("/student/login");
       }
       else{
        console.log("Signup Organiser failed: "+(data.message||"Unknown error"))
       }
    
    }
    catch(error){
  console.error("Signup Error:", error);
        //alert("Error connecting to the server.");
    }
  };

  return (
    <div className="student-container">
      <h1 className="student-title">Student</h1>
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
          placeholder="Roll No"
          className="login-input"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleSignup}>
          Sign Up
        </button>

        <p className="redirect-text">
          Already registered?{" "}
          <span onClick={() => navigate("/student/login")} className="redirect-link">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default StudentSignupPage;
