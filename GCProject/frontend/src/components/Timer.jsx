import { useState, useEffect } from 'react';

const Timer = ({ assignment, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(assignment.estimatedHours * 3600); // in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <h2>Focus Mode: {assignment.title}</h2>
      <p>Time Left: {formatTime(timeLeft)}</p>
      <button onClick={onComplete}>Stop Timer</button>
    </div>
  );
};

export default Timer;