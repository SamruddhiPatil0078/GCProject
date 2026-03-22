<<<<<<< HEAD
import { useState } from 'react';

const AssignmentCard = ({ assignment, onStart }) => {

  const addToCalendar = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assignments/${id}/calendar`,
        {
          method: 'POST',
          credentials: 'include' // 🔥 IMPORTANT for auth
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed');
      }

      alert("Added to Google Calendar ✅");
      console.log(data);

    } catch (err) {
      console.error(err);
      alert("Error adding to calendar ❌");
    }
  };

=======
const AssignmentCard = ({ assignment, onStart }) => {
>>>>>>> main
  return (
    <div className="assignment-card">
      <h3>{assignment.title}</h3>
      <p>{assignment.description}</p>
<<<<<<< HEAD

      <p>📅 Deadline: {assignment.deadline ? new Date(assignment.deadline).toDateString() : 'N/A'}</p>
      <p>⚡ Priority: {assignment.priority}</p>
      <p>📚 Category: {assignment.category}</p>

      <p>Estimated Hours: {assignment.estimatedHours || '-'}</p>
      <p>Progress: {assignment.progress}%</p>

      {assignment.source === 'google_classroom' && (
        <p>📚 From Google Classroom {assignment.hasPdf && '📄 Has PDF'}</p>
      )}

      <button onClick={() => addToCalendar(assignment._id)}>
        📅 Add to Calendar
      </button>
=======
      <p>Category: {assignment.category}</p>
      <p>Estimated Hours: {assignment.estimatedHours}</p>
      <p>Progress: {assignment.progress}%</p>
      {assignment.source === 'google_classroom' && (
        <p>📚 From Google Classroom {assignment.hasPdf && '📄 Has PDF'}</p>
      )}
      <button onClick={() => onStart(assignment)}>Start Timer</button>
>>>>>>> main
    </div>
  );
};

export default AssignmentCard;