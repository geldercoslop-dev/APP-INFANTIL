export function getRewardMultiplier(date = new Date()): number {
  const day = date.getDay();
  // Saturday = 6, Sunday = 0
  return day === 0 || day === 6 ? 2 : 1;
}
