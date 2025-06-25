import React, { useState } from "react";
import { useLocation, Link, Outlet ,useNavigate} from "react-router-dom";
import './NavBarStudents.css';

const NavBarStudents = ({setSearchQueryStudent,searchQueryStudent}) => {
  const location = useLocation();
  const navigate=useNavigate();
  const [searchExpanded, setSearchExpanded] = useState(false);


  return (
    <>
      <div className="MainNavabarStudents">
        <div className="NavbarStudents">
          <h1 className="NavbarTitle">Events</h1>

          <div className="LinksStudentsNavbar">
            <Link to="/student/popular" className={`StudentsLink ${location.pathname === "/student/popular" ? "active" : ""}`}>
              Popular
            </Link>
            <Link to="/student/all" className={`StudentsLink ${location.pathname === "/student/all" ? "active" : ""}`}>
              All Events
            </Link>
            <Link to="/student/interested" className={`StudentsLink ${location.pathname === "/student/interested" ? "active" : ""}`}>
              Interested
            </Link>
            <Link to="/student/registered" className={`StudentsLink ${location.pathname === "/student/registered" ? "active" : ""}`}>
              Registered
            </Link>
              <Link to="/student/history" className={`StudentsLink ${location.pathname === "/student/history" ? "active" : ""}`}>
              Events History
            </Link>
          </div>

          <div className={`Searchbar ${searchExpanded ? "expanded" : ""}dh`}>
            <i className="fas fa-search searchIcon"></i>
            <input
              placeholder="Search"
              type="text"
              value={searchQueryStudent}
              onChange={((e)=>setSearchQueryStudent(e.target.value))}
              onFocus={() => setSearchExpanded(true)}
              onBlur={() => setSearchExpanded(false)}
              className="Search-input"
            />
          </div>

          <div className="StudentButtons">
            <button className="notificationBtn" onClick={()=>{navigate('/Student/notifications')}}>
              <i className="fas fa-bell"></i>
            </button>
             {localStorage.getItem('auth-token')?<button className="logoutBtn" onClick={()=>{localStorage.removeItem('auth-token'); window.location.replace('/')}}>logout</button>:  
         <button onClick={()=>navigate("student/login")}>Login</button>}
          </div>
        </div>
      </div>
      <div className="StudentMainContent">
        <Outlet />
      </div>
    </>
  );
};

export default NavBarStudents;
