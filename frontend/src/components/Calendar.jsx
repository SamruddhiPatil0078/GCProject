import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = () => {
  console.log("Calendar loaded");

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/assignments/calendar", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Calendar events:", data);
        setEvents(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Assignment Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="80vh"
      />
    </div>
  );
};

export default Calendar;