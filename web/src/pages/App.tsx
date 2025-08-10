import React, { useState, useEffect } from 'react';
import { BulletEntry, BulletItem, Streak } from '../types';
import { entriesApi } from '../api';
import EntryForm from '../components/EntryForm';
import HistoryList from '../components/HistoryList';

const App: React.FC = () => {
  const [entries, setEntries] = useState<BulletEntry[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entriesData, streakData] = await Promise.all([
        entriesApi.getAll(),
        entriesApi.getStreak()
      ]);
      
      setEntries(entriesData);
      setStreak(streakData.streak);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitEntry = async (items: BulletItem[]) => {
    try {
      await entriesApi.create(items);
      await loadData(); // Refresh data
      alert('Entry saved successfully!');
    } catch (error: any) {
      console.error('Error creating entry:', error);
      
      if (error.response?.status === 409) {
        alert('You already have an entry for this week. You can edit it from the history below.');
      } else {
        alert('Failed to save entry. Please try again.');
      }
    }
  };

  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bullet journal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">5BulletMethod</h1>
              <p className="text-gray-600 mt-1">
                Week of {formatWeekRange(new Date())}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{streak}</div>
              <div className="text-sm text-gray-600">week streak</div>
              {streak > 0 && (
                <div className="mt-1 text-lg">
                  {streak === 1 ? '🔥' : streak < 4 ? '🔥🔥' : streak < 8 ? '🔥🔥🔥' : '🔥🔥🔥🔥'}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Entry Form */}
        <EntryForm onSubmit={handleSubmitEntry} />
        
        {/* History */}
        <HistoryList entries={entries} onEntryUpdate={loadData} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Track your weekly accomplishments • Stay motivated • Build streaks</p>
          <p className="text-sm mt-2">Inspired by effective productivity methods</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
