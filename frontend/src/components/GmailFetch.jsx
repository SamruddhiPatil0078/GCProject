import { useState } from 'react';
import { fetchEmails, createAssignment, analyzeAssignment } from '../services/api';

const GmailFetch = ({ onFetch }) => {
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      console.log('Starting Gmail fetch...');
      const assignments = await fetchEmails();
      console.log('Fetched assignments:', assignments);
      
      if (assignments.length === 0) {
        alert('No assignment emails found in your Gmail. Try sending yourself a test email with "assignment" in the subject.');
        return;
      }
      
      // Process each fetched assignment
      let successCount = 0;
      for (const assignment of assignments) {
        try {
          console.log('Processing assignment:', assignment.title);
          // Analyze with AI
          const analysis = await analyzeAssignment(assignment.description);
          console.log('AI analysis:', analysis);
          const fullAssignment = { ...assignment, ...analysis };
          
          // Save to database
          await createAssignment(fullAssignment);
          console.log('Saved assignment to database');
          successCount++;
        } catch (analysisError) {
          console.error('Error processing assignment:', assignment.title, analysisError);
          // Still try to save without analysis
          try {
            await createAssignment(assignment);
            successCount++;
          } catch (saveError) {
            console.error('Error saving assignment:', saveError);
          }
        }
      }
      
      // Refresh the assignments list
      onFetch();
      const classroomCount = assignments.filter(a => a.source === 'google_classroom').length;
      alert(`Successfully processed ${successCount} assignments from Gmail! (${classroomCount} from Google Classroom)`);
    } catch (error) {
      console.error('Error fetching emails:', error);
      if (error.response?.status === 401) {
        alert('Authentication error. Please log out and log back in.');
      } else {
        alert(`Error fetching assignments from Gmail: ${error.message}`);
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