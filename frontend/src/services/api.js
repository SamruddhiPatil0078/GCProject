import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

export const getAssignments = async () => {
  const response = await api.get('/assignments');
  return response.data;
};

export const createAssignment = async (assignment) => {
  const response = await api.post('/assignments', assignment);
  return response.data;
};

export const analyzeAssignment = async (description) => {
  const response = await api.post('/ai/analyze', { description });
  return response.data;
};

export const fetchEmails = async () => {
  const response = await api.get('/gmail/fetch');
  return response.data.assignments;
};