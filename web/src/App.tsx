import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE = (import.meta as any).env.VITE_API_BASE || 'http://localhost:7072/api';

type Item = { order: number; emoji: string; text: string; category?: string };

type Entry = {
  id: string;
  week_start_date: string;
  created_at: string;
  items?: Item[];
};

function useStreak() {
  const [streak, setStreak] = useState<number>(0);
  useEffect(() => {
    axios.get(`${API_BASE}/streak`).then((res) => setStreak(res.data.streak)).catch(() => setStreak(0));
  }, []);
  return streak;
}

function EntryForm({ onCreated }: { onCreated: (id: string) => void }) {
  const [items, setItems] = useState<Item[]>([{ order: 1, emoji: '', text: '' }]);
  const canAdd = items.length < 5;

  const addItem = () => {
    if (items.length >= 5) return;
    setItems((prev) => [...prev, { order: prev.length + 1, emoji: '', text: '' }]);
  };
  const update = (idx: number, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const remove = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, order: i + 1 })));
  };

  const submit = async () => {
    const cleaned = items.filter((i) => i.text.trim().length > 0).map((it, i) => ({ ...it, order: i + 1 }));
    if (cleaned.length === 0) return;
    const res = await axios.post(`${API_BASE}/entries`, { items: cleaned }).catch((e) => e.response);
    if (res?.status === 201) onCreated(res.data.id);
    else if (res?.status === 409) onCreated(res.data.id);
  };

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="w-12 border rounded px-2 py-1"
            placeholder="😀"
            value={it.emoji}
            onChange={(e) => update(i, { emoji: e.target.value })}
          />
          <input
            className="flex-1 border rounded px-2 py-1"
            placeholder="What did you accomplish?"
            value={it.text}
            onChange={(e) => update(i, { text: e.target.value })}
          />
          <input
            className="w-40 border rounded px-2 py-1"
            placeholder="category"
            value={it.category || ''}
            onChange={(e) => update(i, { category: e.target.value })}
          />
          <button className="text-red-600" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded bg-zinc-900 text-white disabled:opacity-50"
          onClick={submit}
        >
          Save this week
        </button>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={addItem}
          disabled={!canAdd}
        >
          Add bullet ({items.length}/5)
        </button>
      </div>
    </div>
  );
}

function EntryView({ entry }: { entry: Entry }) {
  return (
    <div className="border rounded p-3">
      <div className="text-sm text-zinc-500">Week starting {entry.week_start_date}</div>
      <ul className="list-disc pl-6">
        {entry.items?.map((it) => (
          <li key={it.order}>
            <span className="mr-2">{it.emoji}</span>
            <span>{it.text}</span>
            {it.category ? <span className="ml-2 text-zinc-500">[{it.category}]</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [insight, setInsight] = useState<string>('');
  const streak = useStreak();

  const load = async () => {
    const res = await axios.get(`${API_BASE}/entries`);
    setEntries(res.data);
  };
  useEffect(() => { load(); }, []);

  const onCreated = async (id: string) => {
    await load();
    const res = await axios.get(`${API_BASE}/entries/${id}`);
    const full = res.data as Entry;
    setEntries((prev) => [full, ...prev.filter((e) => e.id !== id)]);

    const ins = await axios.get(`${API_BASE}/entries/${id}/insight`).then((r) => r.data.insight);
    setInsight(ins);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">5BulletMethod</h1>
      <div className="text-sm text-zinc-600">Current streak: {streak} week(s)</div>

      <section>
        <h2 className="font-medium mb-2">This week</h2>
        <EntryForm onCreated={onCreated} />
      </section>

      {insight && (
        <div className="p-3 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
          Insight: {insight}
        </div>
      )}

      <section>
        <h2 className="font-medium mb-2">History</h2>
        <div className="space-y-3">
          {entries.map((e) => (
            <EntryView key={e.id} entry={e} />
          ))}
        </div>
      </section>
    </div>
  );
}
