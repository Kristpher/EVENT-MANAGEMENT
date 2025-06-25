import React, { useState } from "react";
import "./AdminLoginPage.css";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async() => {
    
    console.log("Logging in with", email, password);
    try{
       const response = await fetch(`${BACKEND_URL}/admin/login`,{
         method:"POST",
         headers:{
          "Content-type":"application/json",
        
         },
         body:JSON.stringify({email,password}),
       });
       const data =await response.json();
       console.log("refined data",data);
       if(data.success){
        alert("login succefful");
        localStorage.setItem("auth-token",data.token)
        navigate(`/admin/upcoming`);
       }
       else{
        console.log("login error for admin",data.message)
       }
    }
    catch(error){
         console.error("Login Error:", error);
    console.log("Error connecting to the server.");
    }
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-title">Admin</h1>

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
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
