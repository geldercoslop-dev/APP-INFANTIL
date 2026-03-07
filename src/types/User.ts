export interface User {
  name: string;
  genderTheme: 'boy' | 'girl';
  selectedMascotId: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActiveDate: string | null;
  dailyStreak: number;
  dailyMissionCompleted: boolean;
}
