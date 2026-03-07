export interface Mission {
  id: string;
  title: string;
  description?: string;
  xp: number;
  coins: number;
  completed: boolean;
  date: string;
  emoji?: string;
  isBonus?: boolean;
}

export interface MissionTemplate {
  id: string;
  title: string;
  description: string;
  xp: number;
  coins: number;
  isActive: boolean;
}

export interface DailyMissions {
  date: string;
  missions: Mission[];
}
