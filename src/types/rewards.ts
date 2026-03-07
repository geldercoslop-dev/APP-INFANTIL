export interface RealReward {
  id: string;
  title: string;
  description?: string;
  emoji: string;
  cost: number; // coins
  unlocked?: boolean; // opcional, pode ignorar agora
  redeemedAt?: string; // ISO date
}

export interface ParentConfig {
  dailyMissionTemplates: Array<{
    id: string;
    title: string;
    description?: string;
    xp: number;
    coins: number;
    emoji: string;
  }>;
  realRewards: RealReward[];
}
