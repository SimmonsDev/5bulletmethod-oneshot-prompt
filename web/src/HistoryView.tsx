import React from 'react';

export default function HistoryView({ entries, onSelect }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">History</h2>
      {entries.length === 0 ? (
        <div className="text-gray-500">No entries yet.</div>
      ) : (
        <ul className="space-y-2">
          {entries.map(entry => (
            <li key={entry.id} className="bg-white p-3 rounded shadow cursor-pointer" onClick={() => onSelect(entry)}>
              <div className="font-bold">Week of {entry.week_start_date}</div>
              <ul className="ml-4 mt-1">
                {entry.items.map(item => (
                  <li key={item.id}>
                    <span className="mr-2">{item.emoji}</span>
                    {item.text} {item.category && <span className="text-xs text-gray-400">[{item.category}]</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
