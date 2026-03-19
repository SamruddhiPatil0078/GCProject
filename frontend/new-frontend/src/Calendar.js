import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/assignments/calendar", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Calendar events:", data);
        setEvents(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assignment Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="80vh"
        eventClick={(info) => {
          alert(`Assignment: ${info.event.title}`);
        }}
      />
    </div>
  );
};

export default Calendar;