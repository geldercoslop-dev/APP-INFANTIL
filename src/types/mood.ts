export type MoodKey = 'happy' | 'tired' | 'sad' | 'angry' | 'excited';

export interface DailyMood {
  date: string;       // YYYY-MM-DD
  mood: MoodKey;
  note?: string;
}

export interface UserProfile {
  name: string;
  nickname?: string;
  avatar?: string;
  useNickname: boolean; // true = usa nickname na saudação, false = usa name
}
