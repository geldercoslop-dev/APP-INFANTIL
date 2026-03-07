export interface MoodEntry {
  date: string; // YYYY-MM-DD format
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'angry';
  timestamp: string; // ISO string
}
