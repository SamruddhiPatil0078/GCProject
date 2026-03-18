import { useState } from 'react';
import { createAssignment, analyzeAssignment } from '../services/api';

const AssignmentForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Analyze with AI
      const analysis = await analyzeAssignment(form.description);
      const assignment = {
        ...form,
        ...analysis
      };
      await createAssignment(assignment);
      onAdd();
      setForm({ title: '', description: '', deadline: '' });
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="assignment-form">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Assignment Title"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        name="deadline"
        type="date"
        value={form.deadline}
        onChange={handleChange}
      />
      <button type="submit">Add Assignment</button>
    </form>
  );
};

export default AssignmentForm;