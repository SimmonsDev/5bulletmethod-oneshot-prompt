export default function HistoryList({ entries }: { entries: any[] }) {
  if (!entries.length) return <div className="text-gray-500">No entries yet.</div>;
  return (
    <ul className="space-y-3">
      {entries.map(e => (
        <li key={e.id} className="border rounded p-3">
          <div className="text-sm text-gray-500">Week of {e.week_start_date}</div>
          <ul className="mt-2 space-y-1">
            {e.items.map((i:any) => (
              <li key={i.id} className="flex items-center gap-2">
                <span className="text-xl">{i.emoji}</span>
                <span>{i.text}</span>
                {i.category && <span className="text-xs text-gray-500">[{i.category}]</span>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
