export function getLocalISODate(d = new Date()): string {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
}

export function parseLocalISODate(dateStr: string): Date {
  // Parse YYYY-MM-DD as local date (not UTC)
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatShortLocalDate(dateStr: string): string {
  const date = parseLocalISODate(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

export function formatRelativeLocalDate(dateStr: string): string {
  const today = getLocalISODate();
  const yesterday = getLocalISODate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  
  if (dateStr === today) {
    return 'Hoje';
  } else if (dateStr === yesterday) {
    return 'Ontem';
  } else {
    return formatShortLocalDate(dateStr);
  }
}

export function calculateStreak(lastActiveDate: string | null, today: string): number {
  if (!lastActiveDate) return 0;
  
  const yesterday = getLocalISODate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  
  // If last active was today, streak stays the same
  if (lastActiveDate === today) {
    return 0; // No change needed
  }
  
  // If last active was yesterday, increment streak
  if (lastActiveDate === yesterday) {
    return 1; // Increment by 1
  }
  
  // If gap > 1 day, reset streak to 1 (starting new streak)
  return -999; // Special value to reset to 1
}
