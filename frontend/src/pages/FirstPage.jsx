import React from "react";
import { useNavigate } from "react-router-dom";
import "./FirstPage.css";
const FirstPage=()=>{
  const navigate=useNavigate();

    return(
  <div className="mainFirstPagediv">
   <h1 className="">NITC EVENT APP</h1>
   
   <button onClick={(()=>{navigate(`/admin/login`)})}>Admin</button>
   <button onClick={(()=>{navigate(`/organizer/login`)})}>Organizer</button>
   <button onClick={(()=>{navigate(`/student/login`)})}>Student</button>
  </div>);
}
export default FirstPage;