import React, { useState } from 'react';

const categories = ['health', 'car', 'relationships', 'social', 'work', 'other'];

export default function WeeklyEntryForm({ onSubmit }) {
  const [weekStart, setWeekStart] = useState('');
  const [items, setItems] = useState([
    { emoji: '', text: '', category: '' },
    { emoji: '', text: '', category: '' },
    { emoji: '', text: '', category: '' },
    { emoji: '', text: '', category: '' },
    { emoji: '', text: '', category: '' },
  ]);

  const handleChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(weekStart, items.filter(i => i.emoji && i.text));
    setWeekStart('');
    setItems(items.map(() => ({ emoji: '', text: '', category: '' })));
  };

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>
      <label className="block mb-2 font-semibold">Week Start Date</label>
      <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} className="border p-2 rounded w-full mb-4" required />
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 mb-2 items-center">
          <input type="text" placeholder="Emoji" value={item.emoji} onChange={e => handleChange(idx, 'emoji', e.target.value)} className="w-12 p-2 border rounded" maxLength={2} />
          <input type="text" placeholder="Description" value={item.text} onChange={e => handleChange(idx, 'text', e.target.value)} className="flex-1 p-2 border rounded" />
          <select value={item.category} onChange={e => handleChange(idx, 'category', e.target.value)} className="p-2 border rounded">
            <option value="">Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      ))}
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
    </form>
  );
}
