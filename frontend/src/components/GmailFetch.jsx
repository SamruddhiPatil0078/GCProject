import { useState } from 'react';
import { fetchEmails } from '../services/api';

const GmailFetch = ({ onFetch }) => {
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);

    try {
      console.log('Starting Gmail fetch...');

      const res = await fetchEmails();
      console.log('Response:', res);

      const assignments = res.assignments || [];

      if (assignments.length === 0) {
        alert('No assignment emails found.');
        return;
      }

      // 🔥 Backend already saves → just refresh UI
      onFetch();

      alert(`Fetched ${assignments.length} assignments successfully!`);

    } catch (error) {
      console.error('Error fetching emails:', error);

      if (error.response?.status === 401) {
        alert('Authentication error. Please log out and log back in.');
      } else {
        alert(`Error fetching assignments: ${error.message}`);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gmail-fetch">
      <button onClick={handleFetch} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Assignments from Gmail'}
      </button>
    </div>
  );
};

export default GmailFetch;