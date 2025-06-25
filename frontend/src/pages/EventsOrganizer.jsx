import { useState } from 'react';
import { Outlet } from "react-router-dom";
import NavBar from "../components/Organiser/Navbar";
import EventModal from '../components/Organiser/NewEventLister';
import './EventsOrganizer.css';

const Layout = ({ addEvent, pendingEvents, bookMap,setRefetch,searchQueryOrg,setSearchQueryOrg}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mainEvents">
      <NavBar pendingEvents={pendingEvents} setSearchQueryOrg={setSearchQueryOrg} searchQueryOrg={searchQueryOrg}/>
      {showModal && (
        <EventModal
          pendingEvents={pendingEvents}
          onClose={() => setShowModal(false)}
          bookMap={bookMap}
          setRefetch={setRefetch}
          onSubmit={(data) => {
            addEvent(data);
            setShowModal(false);
          }}
        />
      )}
      <div className="EventAddButtonDiv">
        <button onClick={() => setShowModal(true)}>Add Event</button>
      </div>

      <div className="route-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
