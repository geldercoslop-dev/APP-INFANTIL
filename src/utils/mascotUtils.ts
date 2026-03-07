export interface Mascot {
  id: string;
  name: string;
  imagePath: string;
  gender: 'boy' | 'girl' | 'neutral';
}

export const loadMascots = (): Mascot[] => {
  const mascotFiles = [
    { id: 'bear_flower', gender: 'girl' as const },
    { id: 'bear_superhero', gender: 'boy' as const },
    { id: 'bunny_bow', gender: 'girl' as const },
    { id: 'bunny_helmet', gender: 'boy' as const },
    { id: 'bunny_hero', gender: 'boy' as const },
    { id: 'cat_hero', gender: 'boy' as const },
    { id: 'cat_star', gender: 'girl' as const },
    { id: 'dog_superhero', gender: 'boy' as const },
    { id: 'fox_explorer', gender: 'boy' as const },
    { id: 'fox_magic', gender: 'girl' as const },
    { id: 'panda_astronaut', gender: 'boy' as const },
    { id: 'panda_pink', gender: 'girl' as const },
    { id: 'pig_glasses', gender: 'neutral' as const },
    { id: 'pig_superhero', gender: 'boy' as const },
    { id: 'puppy_bow', gender: 'girl' as const },
    { id: 'unicorn_hero', gender: 'boy' as const },
    { id: 'unicorn_princess', gender: 'girl' as const }
  ];

  return mascotFiles.map((mascot) => {
    const name = mascot.id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: mascot.id,
      name,
      gender: mascot.gender,
      imagePath: `/src/assets/mascots/main/${mascot.id}.png`
    };
  });
};

export const getMascotImagePath = (mascotId: string): string => {
  const mascots = loadMascots();
  const mascot = mascots.find(m => m.id === mascotId);
  return mascot?.imagePath || '';
};

export const getFilteredMascots = (genderTheme: 'boy' | 'girl'): Mascot[] => {
  const allMascots = loadMascots();
  
  if (genderTheme === 'girl') {
    // Para meninas: mostrar femininos primeiro, depois neutros, depois masculinos
    return [
      ...allMascots.filter(m => m.gender === 'girl'),
      ...allMascots.filter(m => m.gender === 'neutral'),
      ...allMascots.filter(m => m.gender === 'boy')
    ];
  } else {
    // Para meninos: mostrar masculinos primeiro, depois neutros, depois femininos
    return [
      ...allMascots.filter(m => m.gender === 'boy'),
      ...allMascots.filter(m => m.gender === 'neutral'),
      ...allMascots.filter(m => m.gender === 'girl')
    ];
  }
};
