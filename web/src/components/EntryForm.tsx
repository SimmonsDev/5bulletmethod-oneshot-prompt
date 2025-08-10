import React, { useState } from 'react';
import { BulletItem } from '../types';

interface EntryFormProps {
  onSubmit: (items: BulletItem[]) => void;
  initialItems?: BulletItem[];
  isEditing?: boolean;
  onCancel?: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ onSubmit, initialItems = [], isEditing = false, onCancel }) => {
  const [items, setItems] = useState<BulletItem[]>(
    initialItems.length > 0 ? initialItems : [{ emoji: '', text: '', category: '' }]
  );

  const addItem = () => {
    if (items.length < 5) {
      setItems([...items, { emoji: '', text: '', category: '' }]);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof BulletItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty items
    const validItems = items.filter(item => item.emoji.trim() && item.text.trim());
    
    if (validItems.length === 0) {
      alert('Please add at least one bullet point with emoji and text.');
      return;
    }
    
    onSubmit(validItems);
  };

  const commonEmojiCategories = {
    work: ['💼', '📊', '💻', '📧', '🎯'],
    health: ['🏃‍♂️', '⚖️', '💅', '🧘‍♀️', '🥗'],
    social: ['👥', '🎶', '🍽️', '🎉', '☎️'],
    learning: ['📚', '🎓', '💡', '🧠', '📝'],
    home: ['🏠', '🧹', '🔧', '🛒', '👨‍🍳'],
    finance: ['💰', '📈', '💳', '🏦', '💎'],
    car: ['🚗', '⛽', '🔧', '🧽', '🛞']
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {isEditing ? 'Edit Weekly Entry' : 'Add This Week\'s Accomplishments'}
      </h2>
      
      <p className="text-gray-600 mb-6">
        Record up to 5 bullet points of what you accomplished this week:
      </p>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  value={item.emoji}
                  onChange={(e) => updateItem(index, 'emoji', e.target.value)}
                  placeholder="🎯"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-xl"
                  maxLength={2}
                />
                
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Quick picks:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(commonEmojiCategories).map(([category, emojis]) => (
                      <div key={category} className="flex gap-1">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => updateItem(index, 'emoji', emoji)}
                            className="text-lg hover:bg-gray-100 rounded px-1 py-0.5 transition-colors"
                            title={category}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-[3]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accomplishment
                </label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(index, 'text', e.target.value)}
                  placeholder="What did you accomplish?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => updateItem(index, 'category', e.target.value)}
                  placeholder="work, health, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-6 text-red-600 hover:text-red-800 p-1"
                  title="Remove item"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div>
          {items.length < 5 && (
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
            >
              + Add Another ({items.length}/5)
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {isEditing ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EntryForm;
