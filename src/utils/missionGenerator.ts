import type { Mission } from '../types/mission';
import { getLocalISODate } from '../utils/dateUtils';

export const generateDefaultMissions = (): Mission[] => {
  return [
    {
      id: 'mission-1',
      title: '🛏️ Arrumar o quarto',
      description: 'Guarde seus brinquedos no lugar certo',
      xp: 10,
      coins: 5,
      completed: false,
      date: getLocalISODate()
    },
    {
      id: 'mission-2',
      title: '📚 Fazer o dever de casa',
      description: 'Complete suas tarefas escolares',
      xp: 15,
      coins: 8,
      completed: false,
      date: getLocalISODate()
    },
    {
      id: 'mission-3',
      title: '🥤 Beber água',
      description: 'Beba 5 copos de água durante o dia',
      xp: 5,
      coins: 3,
      completed: false,
      date: getLocalISODate()
    },
    {
      id: 'mission-4',
      title: '🏃‍♂️ Fazer exercício',
      description: 'Faça 15 minutos de atividade física',
      xp: 20,
      coins: 10,
      completed: false,
      date: getLocalISODate()
    },
    {
      id: 'mission-5',
      title: '😴 Dormir cedo',
      description: 'Durma antes das 21h para descansar bem',
      xp: 10,
      coins: 5,
      completed: false,
      date: getLocalISODate()
    }
  ];
};
