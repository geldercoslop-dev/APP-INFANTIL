export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface SchoolSubject {
  id: string;
  name: string;
  emoji: string;
  time?: string;
}

export interface SchoolSchedule {
  id: string;
  dayOfWeek: DayOfWeek;
  subjects: SchoolSubject[];
}

export interface SchoolScheduleState {
  schedules: SchoolSchedule[];
}

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira'
};

export const COMMON_SUBJECTS = [
  { name: 'Matemática', emoji: '🔢' },
  { name: 'Português', emoji: '📖' },
  { name: 'Geografia', emoji: '🌍' },
  { name: 'História', emoji: '📚' },
  { name: 'Inglês', emoji: '🇬🇧' },
  { name: 'Ciências', emoji: '🔬' },
  { name: 'Artes', emoji: '🎨' },
  { name: 'Educação Física', emoji: '⚽' },
  { name: 'Música', emoji: '🎵' },
  { name: 'Tecnologia', emoji: '💻' }
];
