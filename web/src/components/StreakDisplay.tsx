interface StreakDisplayProps {
  streak: number
}

function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 mb-8 text-white">
      <div className="text-center">
        <div className="text-6xl mb-2">🔥</div>
        <h2 className="text-2xl font-bold mb-1">Current Streak</h2>
        <div className="text-4xl font-bold">
          {streak} {streak === 1 ? 'week' : 'weeks'}
        </div>
        <p className="text-blue-100 mt-2">
          {streak === 0
            ? "Start your streak by creating your first entry!"
            : streak < 4
            ? "Keep it up! You're building momentum."
            : "Amazing! You're on fire!"}
        </p>
      </div>
    </div>
  )
}

export default StreakDisplay
