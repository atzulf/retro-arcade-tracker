export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

// Get dates for the current week (Sunday to Saturday)
export function getWeekDates(date: Date = new Date()): Date[] {
  const current = new Date(date);
  const week = [];
  // Starting Sunday
  current.setDate((current.getDate() - current.getDay()));
  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return week;
}
