import React, { useState } from 'react';
import { BulletEntry } from '../types';
import { entriesApi } from '../api';

interface HistoryListProps {
  entries: BulletEntry[];
  onEntryUpdate: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ entries, onEntryUpdate }) => {
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [insights, setInsights] = useState<{ [key: number]: string }>({});
  const [loadingInsights, setLoadingInsights] = useState<{ [key: number]: boolean }>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatWeekRange = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const handleDelete = async (entry: BulletEntry) => {
    if (!entry.id) return;
    
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await entriesApi.delete(entry.id);
        onEntryUpdate();
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry. Please try again.');
      }
    }
  };

  const handleGetInsight = async (entry: BulletEntry) => {
    if (!entry.id) return;
    
    setLoadingInsights(prev => ({ ...prev, [entry.id!]: true }));
    
    try {
      const result = await entriesApi.getInsight(entry.id);
      setInsights(prev => ({ ...prev, [entry.id!]: result.insight }));
    } catch (error) {
      console.error('Error getting insight:', error);
      alert('Failed to get insight. Please try again.');
    } finally {
      setLoadingInsights(prev => ({ ...prev, [entry.id!]: false }));
    }
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No entries yet</h3>
        <p className="text-gray-500">Start by adding your first weekly accomplishments above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your History</h2>
      
      {entries.map((entry, index) => (
        <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Week of {formatWeekRange(entry.week_start_date)}
              </h3>
              {entry.created_at && (
                <p className="text-sm text-gray-500">
                  Added on {formatDate(entry.created_at)}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleGetInsight(entry)}
                disabled={loadingInsights[entry.id!]}
                className="px-3 py-1 text-sm text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                {loadingInsights[entry.id!] ? '...' : '🔮 Insight'}
              </button>
              
              <button
                onClick={() => handleDelete(entry)}
                className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {entry.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-start gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <p className="text-gray-800">{item.text}</p>
                  {item.category && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {insights[entry.id!] && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-purple-600">🔮</span>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-1">AI Insight</h4>
                  <p className="text-purple-700">{insights[entry.id!]}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
