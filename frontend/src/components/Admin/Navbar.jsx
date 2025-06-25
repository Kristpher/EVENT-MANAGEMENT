import React from "react";
import { Link, useLocation, Outlet ,useNavigate} from "react-router-dom";
import './Navbar.css';

const NavbarAdmin = () => {
  const navigate=useNavigate();
  const location = useLocation();

  return (
    <div className="navbar-admin-wrapper">
      <div className="navbar-admin">
        <h2 className="admin-logo">Events</h2>

        <div className="admin-links">
          <Link
            to="/admin/upcoming"
            className={`admin-link ${location.pathname === "/admin/upcoming" ? "active" : ""}`}
          >
            Upcoming
          </Link>
          <Link
            to="/admin/pending"
            className={`admin-link ${location.pathname === "/admin/pending" ? "active" : ""}`}
          >
            Pending
          </Link>
        </div>

         {localStorage.getItem('auth-token')?<button className="admin-logout" onClick={()=>{localStorage.removeItem('auth-token'); window.location.replace('/')}}>logout</button>:  
         <button onClick={()=>navigate("student/login")}>Login</button>}
      </div>

    <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default NavbarAdmin;
