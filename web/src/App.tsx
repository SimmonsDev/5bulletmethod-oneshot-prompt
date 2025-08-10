import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeeklyEntryForm from './WeeklyEntryForm';
import HistoryView from './HistoryView';
import StreakTracker from './StreakTracker';

const API_BASE = '/api';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/entries`).then(res => setEntries(res.data));
    axios.get(`${API_BASE}/streak`).then(res => setStreak(res.data.streak));
  }, []);

  const handleSubmit = async (week_start_date, items) => {
    const res = await axios.post(`${API_BASE}/entries`, { week_start_date, items });
    const entryId = res.data.id;
    const insightRes = await axios.get(`${API_BASE}/entries/${entryId}/insight`);
    setInsight(insightRes.data.insight_text);
    axios.get(`${API_BASE}/entries`).then(res => setEntries(res.data));
    axios.get(`${API_BASE}/streak`).then(res => setStreak(res.data.streak));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">5BulletMethod</h1>
      <StreakTracker streak={streak} />
      <WeeklyEntryForm onSubmit={handleSubmit} />
      {insight && <div className="mt-4 p-2 bg-green-100 rounded">{insight}</div>}
      <HistoryView entries={entries} onSelect={setSelectedEntry} />
    </div>
  );
}
