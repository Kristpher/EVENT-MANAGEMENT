import { useState,useEffect } from "react";
import { Link, useLocation ,useNavigate} from "react-router-dom";
import "./Navbar.css";

const NavBar = ({pendingEvents,searchQueryOrg,setSearchQueryOrg}) => {
  const location = useLocation();
  const navigate=useNavigate();
  const[orgs,setOrgs]=useState();
  const [searchExpanded, setSearchExpanded] = useState(false);
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;

  const navLinks = [
    { name: "Active", path: "/organizer/active" },
    { name: "Past", path: "/organizer/past" },
    { name: "Pending", path: "/organizer/pending" },
  ];
  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/organiserName`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        });

        const data = await res.json(); 

        if (data.success) {
          setOrgs(data.name);
        } else {
          console.log("Fetch failed:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchName();
  }, []);
  return (
    <div className="navbar-main-organizer">
      <h2 className="navbar-logo">{String(orgs).toUpperCase()}</h2>

      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`navbar-link ${
              location.pathname === link.path ? "active" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="navbar-actions">
        <div
          className={`navbar-search-container ${
            searchExpanded ? "expanded" : ""
          }`}
        >
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={searchQueryOrg}
            onChange={((e)=>setSearchQueryOrg(e.target.value))}
            onFocus={() => setSearchExpanded(true)}
            onBlur={() => setSearchExpanded(false)}
             className="navbar-search-input"  
          
          />
        </div>
        <button className="notification-icon" onClick={()=>{navigate('/organizer/notifications')}}>🔔</button>
           {localStorage.getItem('auth-token')?<button className="logout-button" onClick={()=>{localStorage.removeItem('auth-token'); window.location.replace('/')}}>logout</button>:  
         <button onClick={()=>navigate("student/login")}>Login</button>}
      </div>
    </div>
  );
};

export default NavBar;
