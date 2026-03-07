import { useGameStore } from '../store/useGameStore';

export const getMascotByLevel = (level: number, currentMascotId: string): string => {
  const mascotsByLevel = {
    // Nível 1-3: Mascotes básicos
    basic: [
      'bear_flower', 'bunny_bow', 'cat_star', 'panda_pink', 
      'puppy_bow', 'unicorn_princess', 'fox_magic', 'pig_glasses'
    ],
    // Nível 4-7: Mascotes melhorados
    improved: [
      'bunny_helmet', 'bunny_hero', 'cat_hero', 'fox_explorer'
    ],
    // Nível 8+: Mascotes heróis
    hero: [
      'bear_superhero', 'dog_superhero', 'pig_superhero', 
      'panda_astronaut', 'unicorn_hero'
    ]
  };

  let availableMascots: string[];
  
  if (level <= 3) {
    availableMascots = mascotsByLevel.basic;
  } else if (level <= 7) {
    availableMascots = [...mascotsByLevel.basic, ...mascotsByLevel.improved];
  } else {
    availableMascots = [...mascotsByLevel.basic, ...mascotsByLevel.improved, ...mascotsByLevel.hero];
  }

  // Se o mascote atual está disponível para este nível, mantém
  if (availableMascots.includes(currentMascotId)) {
    return currentMascotId;
  }

  // Senão, retorna o primeiro disponível do mesmo gênero
  const { user } = useGameStore.getState();
  const isGirlTheme = user.genderTheme === 'girl';
  
  const priorityMascot = availableMascots.find(mascot => {
    if (isGirlTheme) {
      return ['bear_flower', 'bunny_bow', 'cat_star', 'panda_pink', 'puppy_bow', 'unicorn_princess', 'fox_magic'].includes(mascot);
    } else {
      return ['bear_superhero', 'bunny_helmet', 'bunny_hero', 'cat_hero', 'dog_superhero', 'pig_superhero', 'panda_astronaut', 'unicorn_hero'].includes(mascot);
    }
  });

  return priorityMascot || availableMascots[0];
};

export const shouldEvolveMascot = (oldLevel: number, newLevel: number): boolean => {
  return (oldLevel < 4 && newLevel >= 4) || (oldLevel < 8 && newLevel >= 8);
};
