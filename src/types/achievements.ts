export type AchievementKey = 
  | 'first_mission' 
  | 'streak_3' 
  | 'streak_7' 
  | 'missions_10' 
  | 'level_5' 
  | 'level_10'
  | 'coins_50'
  | 'coins_500'
  | 'weekend_warrior'
  | 'mood_master'
  | 'shop_lover'
  | 'reward_hunter'
  | 'challenge_champion'
  | 'coins_100'
  | 'buy_3_items'
  | 'equip_accessory'
  | 'streak_3_days'
  | 'weekly_warrior';

export type Achievement = {
  key: AchievementKey;
  title: string;
  description: string;
  emoji: string;
  unlockedAt: string;
};

export type DailyProgress = {
  completed: number;
  total: number;
};
