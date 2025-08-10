export function getUserId(): string {
  // Simulated auth
  return 'test-user';
}

export function mondayOfWeek(date = new Date()): string {
  // Returns YYYY-MM-DD UTC for Monday of the given date's week
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // adjust to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}
