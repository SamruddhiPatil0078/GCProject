import { useState, useEffect } from 'react';
import Login from './components/Login';
import AssignmentForm from './components/AssignmentForm';
import AssignmentCard from './components/AssignmentCard';
import Timer from './components/Timer';
import GmailFetch from './components/GmailFetch';
import { getAssignments } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const startTimer = (assignment) => {
    setCurrentAssignment(assignment);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return (
      <div className="app">
        <h1>AI Assignment Organizer</h1>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <h1>AI Assignment Organizer</h1>
      <Login onLogin={handleLogin} />
      <GmailFetch onFetch={fetchAssignments} />
      <AssignmentForm onAdd={fetchAssignments} />
      <div className="assignments">
        {assignments.map(assignment => (
          <AssignmentCard
            key={assignment._id}
            assignment={assignment}
            onStart={startTimer}
          />
        ))}
      </div>
      {currentAssignment && (
        <Timer assignment={currentAssignment} onComplete={() => setCurrentAssignment(null)} />
      )}
    </div>
  );
}

export default App;