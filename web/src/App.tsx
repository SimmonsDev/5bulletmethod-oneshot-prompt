import { useState, useEffect } from 'react'
import axios from 'axios'
import EntryForm from './components/EntryForm'
import EntryList from './components/EntryList'
import StreakDisplay from './components/StreakDisplay'

export interface BulletEntry {
  id: number
  user_id: string
  week_start_date: string
  created_at: string
  items: BulletItem[]
}

export interface BulletItem {
  id: number
  bullet_entry_id: number
  item_order: number
  emoji: string
  text: string
  category?: string
  created_at: string
}

function App() {
  const [entries, setEntries] = useState<BulletEntry[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [entriesResponse, streakResponse] = await Promise.all([
        axios.get('/api/entries'),
        axios.get('/api/streak')
      ])
      setEntries(entriesResponse.data)
      setStreak(streakResponse.data.streak)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEntrySubmit = async (entryData: { weekStartDate: string; items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[] }) => {
    try {
      const response = await axios.post('/api/entries', entryData)
      setEntries(prev => [response.data, ...prev])
      // Refresh streak
      const streakResponse = await axios.get('/api/streak')
      setStreak(streakResponse.data.streak)
    } catch (error) {
      console.error('Error creating entry:', error)
    }
  }

  const handleEntryDelete = async (id: number) => {
    try {
      await axios.delete(`/api/entries/${id}`)
      setEntries(prev => prev.filter(entry => entry.id !== id))
      // Refresh streak
      const streakResponse = await axios.get('/api/streak')
      setStreak(streakResponse.data.streak)
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">5BulletMethod</h1>
          <p className="text-gray-600">Track your weekly accomplishments</p>
        </header>

        <StreakDisplay streak={streak} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <EntryForm onSubmit={handleEntrySubmit} />
          </div>
          <div>
            <EntryList entries={entries} onDelete={handleEntryDelete} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
