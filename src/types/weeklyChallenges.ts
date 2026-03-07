export type WeeklyChallengeKey = 
  | 'complete_5_missions'
  | 'register_mood_3_times'
  | 'complete_3_days_1_mission'
  | 'earn_100_coins'
  | 'complete_15_missions'
  | 'earn_200_xp'
  | 'buy_2_items'
  | 'maintain_5_day_streak';

export interface WeeklyChallenge {
  key: WeeklyChallengeKey;
  title: string;
  description: string;
  emoji: string;
  goal: number;
  rewardCoins: number;
  rewardXp: number;
  rewardSpecialItem?: string; // ID de item especial da shop
  weekId: string;
  completed: boolean;
  claimedAt?: string;
  progress?: number;
}

export interface WeeklyChallengeProgress {
  current: number;
  completed: boolean;
  claimedAt?: string;
}

export interface WeeklyChallengesState {
  [weekId: string]: {
    challenges: {
      [key in WeeklyChallengeKey]: WeeklyChallengeProgress;
    };
    lastUpdated: string;
  };
}
