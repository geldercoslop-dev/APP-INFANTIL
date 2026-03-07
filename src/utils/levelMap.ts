// Sistema de mapa de níveis com títulos

export interface LevelTier {
  minLevel: number;
  maxLevel: number;
  title: string;
  emoji: string;
  color: string;
  description: string;
  rewards: {
    coins: number;
    xp: number;
  };
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    minLevel: 1,
    maxLevel: 5,
    title: 'Explorador',
    emoji: '🗺️',
    color: '#10b981',
    description: 'Iniciando sua grande aventura!',
    rewards: { coins: 10, xp: 5 }
  },
  {
    minLevel: 6,
    maxLevel: 10,
    title: 'Aventureiro',
    emoji: '🧭',
    color: '#3b82f6',
    description: 'Descobrindo novos mundos!',
    rewards: { coins: 15, xp: 8 }
  },
  {
    minLevel: 11,
    maxLevel: 15,
    title: 'Herói',
    emoji: '⚔️',
    color: '#8b5cf6',
    description: 'Tornando-se um verdadeiro herói!',
    rewards: { coins: 20, xp: 12 }
  },
  {
    minLevel: 16,
    maxLevel: 20,
    title: 'Mestre',
    emoji: '👑',
    color: '#f59e0b',
    description: 'Dominando todas as habilidades!',
    rewards: { coins: 25, xp: 15 }
  },
  {
    minLevel: 21,
    maxLevel: 30,
    title: 'Lendário',
    emoji: '🌟',
    color: '#ef4444',
    description: 'Uma lenda viva!',
    rewards: { coins: 30, xp: 20 }
  },
  {
    minLevel: 31,
    maxLevel: 50,
    title: 'Mítico',
    emoji: '🔮',
    color: '#ec4899',
    description: 'Poderes além da imaginação!',
    rewards: { coins: 40, xp: 25 }
  },
  {
    minLevel: 51,
    maxLevel: 100,
    title: 'Divino',
    emoji: '✨',
    color: '#fbbf24',
    description: 'Toque de divindade!',
    rewards: { coins: 50, xp: 30 }
  }
];

export const getCurrentLevelTier = (level: number): LevelTier => {
  const tier = LEVEL_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel);
  return tier || LEVEL_TIERS[LEVEL_TIERS.length - 1];
};

export const getLevelTierByTitle = (title: string): LevelTier | undefined => {
  return LEVEL_TIERS.find(t => t.title === title);
};

export const getNextLevelTier = (level: number): LevelTier | null => {
  const currentTier = getCurrentLevelTier(level);
  const currentIndex = LEVEL_TIERS.indexOf(currentTier);
  return currentIndex < LEVEL_TIERS.length - 1 ? LEVEL_TIERS[currentIndex + 1] : null;
};

export const getProgressToNextTier = (level: number): {
  currentTier: LevelTier;
  nextTier: LevelTier | null;
  progress: number;
} => {
  const currentTier = getCurrentLevelTier(level);
  const nextTier = getNextLevelTier(level);
  
  if (!nextTier) {
    return { currentTier, nextTier: null, progress: 100 };
  }
  
  const tierProgress = ((level - currentTier.minLevel) / (currentTier.maxLevel - currentTier.minLevel)) * 100;
  
  return {
    currentTier,
    nextTier,
    progress: Math.min(tierProgress, 100)
  };
};

export const getLevelTitle = (level: number): string => {
  return getCurrentLevelTier(level).title;
};

export const getLevelEmoji = (level: number): string => {
  return getCurrentLevelTier(level).emoji;
};

export const getLevelColor = (level: number): string => {
  return getCurrentLevelTier(level).color;
};

export const getLevelDescription = (level: number): string => {
  return getCurrentLevelTier(level).description;
};

export const getTierRewards = (level: number): { coins: number; xp: number } => {
  return getCurrentLevelTier(level).rewards;
};

export const isMaxTier = (level: number): boolean => {
  return getCurrentLevelTier(level) === LEVEL_TIERS[LEVEL_TIERS.length - 1];
};

export const getLevelCompletionBonus = (level: number): { coins: number; xp: number } => {
  const tier = getCurrentLevelTier(level);
  const isTierComplete = level === tier.maxLevel;
  
  if (isTierComplete && !isMaxTier(level)) {
    return {
      coins: tier.rewards.coins * 2, // Double bonus for completing tier
      xp: tier.rewards.xp * 2
    };
  }
  
  return { coins: 0, xp: 0 };
};
