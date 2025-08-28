import { BulletEntry } from '../App'

interface EntryListProps {
  entries: BulletEntry[]
  onDelete: (id: number) => void
}

function EntryList({ entries, onDelete }: EntryListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Previous Entries</h2>
        <p className="text-gray-500">No entries yet. Create your first weekly entry!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Previous Entries</h2>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Week of {formatDate(entry.week_start_date)}
              </h3>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>

            <div className="space-y-2">
              {entry.items.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className="text-lg">{item.emoji}</span>
                  <div className="flex-1">
                    <span className="text-gray-900">{item.text}</span>
                    {item.category && (
                      <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              Created: {formatDate(entry.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EntryList
