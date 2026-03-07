export interface DiaryEntry {
  date: string; // YYYY-MM-DD format
  content: string;
  mood?: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'angry';
  timestamp: string; // ISO string
}
