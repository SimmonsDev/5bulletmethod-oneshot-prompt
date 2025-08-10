import React, { useState } from 'react';
import api from '../api';

interface NewEntryFormProps {
  onEntryCreated: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ onEntryCreated }) => {
  const [items, setItems] = useState([{ emoji: '', text: '', category: '' }]);
  const [error, setError] = useState<string | null>(null);

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    if (items.length < 5) {
      setItems([...items, { emoji: '', text: '', category: '' }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
    const weekStartDate = new Date(today);
    weekStartDate.setDate(today.getDate() - dayOfWeek);

    try {
      await api.post('/entries', {
        week_start_date: weekStartDate.toISOString().split('T')[0],
        items: items.filter(item => item.text.trim() !== ''),
      });
      setItems([{ emoji: '', text: '', category: '' }]);
      onEntryCreated();
    } catch (err) {
      setError('Failed to create entry.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl mb-4">New Weekly Entry</h2>
      {items.map((item, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            placeholder="😀"
            value={item.emoji}
            onChange={(e) => handleItemChange(index, 'emoji', e.target.value)}
            className="bg-gray-700 text-white rounded p-2 w-16 text-center"
          />
          <input
            type="text"
            placeholder="Accomplishment..."
            value={item.text}
            onChange={(e) => handleItemChange(index, 'text', e.target.value)}
            className="bg-gray-700 text-white rounded p-2 flex-grow mx-2"
            required
          />
          <input
            type="text"
            placeholder="[category]"
            value={item.category}
            onChange={(e) => handleItemChange(index, 'category', e.target.value)}
            className="bg-gray-700 text-white rounded p-2 w-32"
          />
        </div>
      ))}
      {items.length < 5 && (
        <button type="button" onClick={addItem} className="text-blue-400 mt-2">
          + Add Item
        </button>
      )}
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full">
        Submit Entry
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default NewEntryForm;
