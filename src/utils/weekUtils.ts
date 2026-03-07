export function getCurrentWeekId(): string {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  return startOfWeek.toISOString().split('T')[0];
}

export function getWeekStartDate(weekId: string): Date {
  return new Date(weekId);
}

export function getWeekEndDate(weekId: string): Date {
  const startDate = getWeekStartDate(weekId);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return endDate;
}

export function getDatesInCurrentWeek(): string[] {
  const weekId = getCurrentWeekId();
  const dates: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(getWeekStartDate(weekId));
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}
