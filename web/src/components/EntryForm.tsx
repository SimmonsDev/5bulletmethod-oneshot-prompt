import { useState } from 'react'
import { BulletItem } from '../App'

interface EntryFormProps {
  onSubmit: (entryData: { weekStartDate: string; items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[] }) => void
}

interface FormItem {
  emoji: string
  text: string
  category: string
}

function EntryForm({ onSubmit }: EntryFormProps) {
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    return startOfWeek.toISOString().split('T')[0]
  })

  const [items, setItems] = useState<FormItem[]>([
    { emoji: '', text: '', category: '' },
    { emoji: '', text: '', category: '' },
    { emoji: '', text: '', category: '' },
    { emoji: '', text: '', category: '' },
    { emoji: '', text: '', category: '' }
  ])

  const handleItemChange = (index: number, field: keyof FormItem, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that at least one item has content
    const hasContent = items.some(item => item.emoji.trim() && item.text.trim())
    if (!hasContent) {
      alert('Please add at least one bullet item with emoji and text')
      return
    }

    const validItems = items
      .filter(item => item.emoji.trim() && item.text.trim())
      .map((item, index) => ({
        item_order: index + 1,
        emoji: item.emoji.trim(),
        text: item.text.trim(),
        category: item.category.trim() || undefined
      }))

    onSubmit({
      weekStartDate,
      items: validItems
    })

    // Reset form
    setItems([
      { emoji: '', text: '', category: '' },
      { emoji: '', text: '', category: '' },
      { emoji: '', text: '', category: '' },
      { emoji: '', text: '', category: '' },
      { emoji: '', text: '', category: '' }
    ])
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">New Weekly Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="weekStartDate" className="block text-sm font-medium text-gray-700 mb-1">
            Week Starting
          </label>
          <input
            type="date"
            id="weekStartDate"
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Bullet Items</h3>

          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="😊"
                value={item.emoji}
                onChange={(e) => handleItemChange(index, 'emoji', e.target.value)}
                className="w-12 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                maxLength={2}
              />
              <input
                type="text"
                placeholder={`Bullet item ${index + 1}`}
                value={item.text}
                onChange={(e) => handleItemChange(index, 'text', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="category"
                value={item.category}
                onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                className="w-24 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save Entry
        </button>
      </form>
    </div>
  )
}

export default EntryForm
