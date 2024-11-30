// src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./component/zookeeper/sidebar";
import Animal from "./page/Zookeeper/animals/animal";
import Event from "./page/Zookeeper/event/event";
import Calendar from "./page/Zookeeper/calendar/calendar";
import Habitat from "./page/Zookeeper/habitat/habitat";
import Work from "./page/Zookeeper/work/work";
import Report from "./page/Zookeeper/report/report";
import Reviews from "./page/reviews/review";
import MyTicket from "./page/reviews/MyTicket/myticket"; 
import CreateEvent from "./page/Zookeeper/event/create/index"; 
import CreateHabitat from "./page/Zookeeper/habitat/create/index"; 
import CreateAnimal from "./page/Zookeeper/animals/create/index"; 
import EditAnimal from "./page/Zookeeper/animals/edit/index"; 
import CreateReport from "./page/Zookeeper/report/create/index";
import EditEvent from "./page/Zookeeper/event/edit/index"; 

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Animal />} />
            <Route path="/event" element={<Event />} />
            <Route path="/habitat" element={<Habitat />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/report" element={<Report />} />
            <Route path="/work" element={<Work />} />
            <Route path="/review" element={<Reviews />} />
            <Route path="/myticket" element={<MyTicket />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/create-habitat" element={<CreateHabitat />} />
            <Route path="/create-animal" element={<CreateAnimal />} />
            <Route path="/create-report" element={<CreateReport />} />
            <Route path="/animals/edit/:id" element={<EditAnimal />} />
            <Route path="/events/edit/:id" element={<EditEvent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
