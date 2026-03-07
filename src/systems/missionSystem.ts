import type { Mission } from '../types';
import type { ParentConfig } from '../types/rewards';

export const generateDailyMissions = (
  templates: ParentConfig['dailyMissionTemplates'],
  date: string
): Mission[] => {
  // If no templates configured, use fallback
  if (templates.length === 0) {
    return generateFallbackMissions(date);
  }
  
  // Select 5 random missions from templates
  const shuffled = [...templates].sort(() => 0.5 - Math.random());
  const selectedTemplates = shuffled.slice(0, Math.min(5, templates.length));
  
  return selectedTemplates.map((template) => ({
    id: `${date}-${template.id}`,
    title: template.title,
    description: template.description,
    xp: template.xp,
    coins: template.coins,
    completed: false,
    date,
    emoji: template.emoji
  }));
};

const generateFallbackMissions = (date: string): Mission[] => {
  const fallbackTemplates = [
    { id: '1', title: 'Escovar os dentes', description: 'Escove os dentes pela manhã e à noite', xp: 10, coins: 5, emoji: '🦷' },
    { id: '2', title: 'Arrumar a cama', description: 'Arrume sua cama ao acordar', xp: 10, coins: 8, emoji: '🛏️' },
    { id: '3', title: 'Fazer lição de casa', description: 'Complete todas as tarefas escolares', xp: 20, coins: 10, emoji: '📚' },
    { id: '4', title: 'Arrumar o quarto', description: 'Mantenha seu espaço organizado', xp: 20, coins: 8, emoji: '🧹' },
    { id: '5', title: 'Ajudar em casa', description: 'Ajude seus pais com uma tarefa', xp: 40, coins: 12, emoji: '🤝' }
  ];
  
  return fallbackTemplates.map((template) => ({
    id: `${date}-${template.id}`,
    title: template.title,
    description: template.description,
    xp: template.xp,
    coins: template.coins,
    completed: false,
    date,
    emoji: template.emoji
  }));
};

export const calculateXP = (level: number): number => {
  return level * 100;
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const updateStreak = (
  currentStreak: number,
  lastActiveDate: string | null,
  today: string,
  allMissionsCompleted: boolean
): number => {
  if (!lastActiveDate) return allMissionsCompleted ? 1 : 0;
  
  const lastDate = new Date(lastActiveDate);
  const todayDate = new Date(today);
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1 && allMissionsCompleted) {
    return currentStreak + 1;
  } else if (diffDays === 0) {
    // Same day, no change
    return currentStreak;
  } else {
    // Lost streak
    return allMissionsCompleted ? 1 : 0;
  }
};
