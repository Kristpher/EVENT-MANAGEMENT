import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import PendingEvents from "./components/Organiser/PendingEvents";
import CompleteEvent from "./components/Organiser/CompleteEvent";
import FirstPage from "./pages/FirstPage";
import Layout from "./pages/EventsOrganizer";
import NavbarAdmin from "./components/Admin/Navbar";
import UpcomingEvents from "./components/Admin/UpcomingEvents";
import PendingEventsAdmin from "./components/Admin/PendingEvents";
import PendingEventCardFull from "./components/Admin/PendingEventCardFull";
import UpcomingEventCardFull from "./components/Admin/UpcomingEventsCardFull";
import NavBarStudents from "./components/Student/NavBarStudents";
import PopularEvents from "./components/Student/PopularEvents";
import AllEvents from "./components/Student/AllEvents";
import IntEvents from "./components/Student/IntEvents";
import EventDetails from "./components/Student/EventsDetails";
import AdminLogin from "./pages/AdminLoginPage";
import OrganizerLoginPage from "./pages/OrganizerLoginPage";
import OrganizerSignupPage from "./pages/OrganizerSignUpPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentSignupPage from "./pages/StudentSignUpPage";
import ActiveEvents from "./components/Organiser/ActiveEvents";
import PastEvents from "./components/Organiser/PastEvent";
import RegEvents from "./components/Student/RegEvents";
import RegEventDetails from "./components/Student/RegEventDetails";
import NotificationsPage from "./pages/notificationsStudent";
import NotificationsPageOrg from "./pages/notificationsOrganiser";
import StudentList from "./components/Organiser/StudentList";

function App() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const bookingMapRef = useRef(new Map()); 
  const bookingMap = bookingMapRef.current;
  const [refetch, setRefetch] = useState(false);
  const [searchQueryStudent,setSearchQueryStudent]=useState("");
  const [searchQueryOrg,setSearchQueryOrg]=useState("");
  // const OrganisationMapRef = useRef(new Map());
  // const OrganisationMap = OrganisationMapRef.current;

  const addEvent = (data) => {
    console.log("Incoming new event:", data); 
    setPendingEvents(prev => [...prev, data]);

    const { date, venue, startTime, endTime } = data;

    if (!bookingMap.has(date)) bookingMap.set(date, new Map());
    const venueMap = bookingMap.get(date);
    if (!venueMap.has(venue)) venueMap.set(venue, new Set());
    
    venueMap.get(venue).add(`${startTime}-${endTime}`); 

    
  };

  useEffect(() => {
    console.log("Updated pendingEvents:", pendingEvents);
    console.log(bookingMap);
  }, [pendingEvents]);

  return (
   
    <Router>
      <Routes>
     
        <Route path="/" element={<FirstPage />} />
        <Route path="/Organizer-pending/:eventName" element={<CompleteEvent />} />
          <Route path="/Organizer-active/:eventName" element={<CompleteEvent />} />
          <Route path="/Organizer-past/:eventName" element={<CompleteEvent />} />
              <Route path="/Student/notifications" element={<NotificationsPage/>} />
              <Route path="/organizer/notifications" element={<NotificationsPageOrg/>} />
              <Route path="/organizer/studentlist" element={<StudentList/>}/>
         <Route path="/Admin-pending/:eventName" element={<PendingEventCardFull setRefetch={setRefetch}/>} />
         <Route path="/Student-event-details/:eventName" element={<EventDetails/>} />
                  <Route path="/Student-reg-event-details/:eventName" element={<RegEventDetails/>} />
         <Route path="/admin/login" element={<AdminLogin/>}/>
         <Route path="/organizer/login" element={<OrganizerLoginPage/>}/>
          <Route path="/organizer/signup" element={<OrganizerSignupPage/>}/>
          <Route path="/student/login" element={<StudentLoginPage/>}/>
          <Route path="/student/signup" element={<StudentSignupPage/>}/>
         <Route path="/student" element={<NavBarStudents setSearchQueryStudent={setSearchQueryStudent} searchQueryStudent={searchQueryStudent}/>}>
          <Route path="popular" element={<PopularEvents/>}/>
           <Route path="all" element={<AllEvents searchQueryStudent={searchQueryStudent}/>}/>
            <Route path="interested" element={<IntEvents searchQueryStudent={searchQueryStudent}/> }/>
             <Route path="registered" element={<RegEvents searchQueryStudent={searchQueryStudent}/>}/>
         </Route>
          <Route path="/Admin-Upcoming/:eventName" element={<UpcomingEventCardFull/>} />
         <Route path="/admin"  element={<NavbarAdmin/>}>
         <Route path="upcoming" element={<UpcomingEvents refetch={refetch}/> }/>
         <Route path="pending" element={< PendingEventsAdmin refetch={refetch}/>}/>

         </Route>
      
        <Route
          path="/organizer"
          element={
            <Layout addEvent={addEvent} setRefetch={setRefetch} pendingEvents={pendingEvents} bookMap={bookingMap} searchQueryOrg={searchQueryOrg} setSearchQueryOrg={setSearchQueryOrg} />
          }
        >
          <Route path="active" element={<div><ActiveEvents refetch={refetch} searchQueryOrg={searchQueryOrg}/></div>} />
          <Route path="past" element={<PastEvents refetch={refetch} searchQueryOrg={searchQueryOrg}/>} />
          <Route path="pending" element={<PendingEvents refetch={refetch} searchQueryOrg={searchQueryOrg} />} />
        </Route>
      </Routes>
    </Router>
    
  
  );
}

export default App;
