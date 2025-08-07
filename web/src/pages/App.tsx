import { useEffect, useMemo, useState } from 'react';
import type { Entry } from '../types';
import api from '../api';
import EntryForm from '../components/EntryForm';
import HistoryList from '../components/HistoryList';


export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [insightText, setInsightText] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const [e, s] = await Promise.all([
      api.get<Entry[]>('/entries').then((r) => r.data),
      api.get<{streak:number}>('/streak').then((r) => r.data.streak),
    ]);
    setEntries(e);
    setStreak(s);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const latestEntry = useMemo<Entry | null>(() => entries[0] || null, [entries]);

  async function handleSubmit(items: Array<{emoji:string; text:string; category?:string}>) {
    try {
  const res = await api.post<{id:number; created:boolean}>('/entries', { items }).then((r) => r.data);
      const entryId = res.id;
      await refresh();
  const insight = await api.get<{insight:string}>(`/entries/${entryId}/insight`).then((r) => r.data.insight);
      setInsightText(insight);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        const id = err.response.data?.id;
        if (id) {
          await api.put(`/entries/${id}`, { items });
          await refresh();
          const insight = await api.get<{insight:string}>(`/entries/${id}/insight`).then((r) => r.data.insight);
          setInsightText(insight);
          return;
        }
      }
      throw err;
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">5BulletMethod</h1>
        <div className="text-sm text-gray-600">Streak: <span className="font-semibold">{streak}</span> weeks</div>
      </header>

      {insightText && (
        <div className="p-3 rounded bg-green-50 text-green-800 border border-green-200">{insightText}</div>
      )}

      <section className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-3">This Week</h2>
        <EntryForm onSubmit={handleSubmit} latestEntry={latestEntry} />
      </section>

      <section className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-3">History</h2>
        {loading ? <div>Loading…</div> : <HistoryList entries={entries} />}
      </section>
    </div>
  );
}
