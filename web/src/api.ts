import axios from 'axios';
import { BulletEntry, BulletItem, Streak, Insight } from './types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const entriesApi = {
  // Create a new entry
  create: async (items: BulletItem[]): Promise<BulletEntry> => {
    const response = await api.post('/entries', { items });
    return response.data;
  },

  // Get all entries
  getAll: async (): Promise<BulletEntry[]> => {
    const response = await api.get('/entries');
    return response.data;
  },

  // Get specific entry
  getById: async (id: number): Promise<BulletEntry> => {
    const response = await api.get(`/entries/${id}`);
    return response.data;
  },

  // Update entry
  update: async (id: number, items: BulletItem[]): Promise<BulletEntry> => {
    const response = await api.put(`/entries/${id}`, { items });
    return response.data;
  },

  // Delete entry
  delete: async (id: number): Promise<void> => {
    await api.delete(`/entries/${id}`);
  },

  // Get streak
  getStreak: async (): Promise<Streak> => {
    const response = await api.get('/streak');
    return response.data;
  },

  // Get insight
  getInsight: async (id: number): Promise<Insight> => {
    const response = await api.get(`/entries/${id}/insight`);
    return response.data;
  },
};

export default api;
