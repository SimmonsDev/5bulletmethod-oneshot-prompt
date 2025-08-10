import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE || 'http://localhost:7071/api',
});

export default api;
