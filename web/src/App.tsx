import React, { useState, useEffect } from 'react';
import api from './api';
import NewEntryForm from './components/NewEntryForm';

function App() {
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchEntries();
    fetchStreak();
  }, []);

  const fetchEntries = async () => {
    const response = await api.get('/entries');
    setEntries(response.data);
  };

  const fetchStreak = async () => {
    const response = await api.get('/streak');
    setStreak(response.data.streak);
  };

  const handleEntryCreated = () => {
    fetchEntries();
    fetchStreak();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">5BulletMethod</h1>
          <div className="text-2xl">🔥 {streak} Week Streak</div>
        </header>
        
        <NewEntryForm onEntryCreated={handleEntryCreated} />

        <div className="mt-8">
          <h2 className="text-3xl mb-4">History</h2>
          {entries.map((entry: any) => (
            <div key={entry.id} className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold mb-2">{new Date(entry.week_start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <ul>
                {entry.items.map((item: any) => (
                  <li key={item.id} className="flex items-center mb-1">
                    <span className="text-2xl mr-4">{item.emoji}</span>
                    <span>{item.text}</span>
                    {item.category && <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded-full">{item.category}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
