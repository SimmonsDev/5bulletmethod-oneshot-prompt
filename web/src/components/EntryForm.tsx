import { useMemo, useState } from 'react';

type Item = { emoji: string; text: string; category?: string };

export default function EntryForm({ onSubmit, latestEntry }: { onSubmit: (items: Item[]) => Promise<void> | void; latestEntry: any | null }) {
  const [items, setItems] = useState<Item[]>(() => Array.from({ length: 5 }, () => ({ emoji: '', text: '', category: '' })));

  const canSubmit = useMemo(() => items.filter(i => i.emoji.trim() && i.text.trim()).length > 0, [items]);

  function updateItem(idx: number, field: keyof Item, value: string) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  }

  const lastWeek = latestEntry?.items ?? [];

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">Add up to 5 bullets for this week.</div>
      <div className="grid gap-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input className="col-span-2 border rounded p-2" placeholder="Emoji" value={it.emoji} onChange={e => updateItem(i, 'emoji', e.target.value)} />
            <input className="col-span-8 border rounded p-2" placeholder="Short description" value={it.text} onChange={e => updateItem(i, 'text', e.target.value)} />
            <input className="col-span-2 border rounded p-2" placeholder="Category" value={it.category || ''} onChange={e => updateItem(i, 'category', e.target.value)} />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-300"
          onClick={() => onSubmit(items.filter(i => i.emoji.trim() && i.text.trim()).slice(0,5))}
          disabled={!canSubmit}
        >Submit</button>
        {lastWeek.length > 0 && (
          <button
            className="px-4 py-2 rounded border"
            onClick={() => setItems(lastWeek.map((i: any) => ({ emoji: i.emoji, text: i.text, category: i.category || '' })).concat(Array.from({length: Math.max(0, 5 - lastWeek.length)}, () => ({ emoji:'', text:'', category:'' }))))}
          >Use last week</button>
        )}
      </div>
    </div>
  );
}
