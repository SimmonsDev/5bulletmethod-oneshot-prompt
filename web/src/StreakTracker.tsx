import React from 'react';

export default function StreakTracker({ streak }) {
  return (
    <div className="mb-4 p-2 bg-yellow-100 rounded text-yellow-800 font-semibold">
      Current Streak: {streak} week{streak === 1 ? '' : 's'}
    </div>
  );
}
