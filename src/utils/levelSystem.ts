// Sistema de níveis centralizado
export function getXpForNextLevel(level: number): number {
  return level * 100;
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getLevelProgress(xp: number, level: number): {
  current: number;
  max: number;
  percentage: number;
} {
  const currentLevelXp = (level - 1) * 100;
  const nextLevelXp = level * 100;
  const currentXpInLevel = xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  
  return {
    current: currentXpInLevel,
    max: xpNeededForNextLevel,
    percentage: (currentXpInLevel / xpNeededForNextLevel) * 100
  };
}
