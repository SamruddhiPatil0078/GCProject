import { useState } from 'react';

const AssignmentCard = ({ assignment, onStart }) => {

  return (
    <div className="assignment-card">
      <h3>{assignment.title}</h3>
      <p>{assignment.description}</p>

      <p>📅 Deadline: {assignment.deadline ? new Date(assignment.deadline).toDateString() : 'N/A'}</p>
      <p>⚡ Priority: {assignment.priority}</p>
      <p>📚 Category: {assignment.category}</p>

      <p>Estimated Hours: {assignment.estimatedHours || '-'}</p>
      <p>Progress: {assignment.progress}%</p>

      {assignment.source === 'google_classroom' && (
        <p>📚 From Google Classroom {assignment.hasPdf && '📄 Has PDF'}</p>
      )}


      <button onClick={() => onStart(assignment)}>
        ⏱ Start Timer
      </button>
    </div>
  );
};

export default AssignmentCard;