// Sistema centralizado de mensagens do mascote

interface MessageCategory {
  greetings: string[];
  encouragement: string[];
  missionComplete: string[];
  streak: string[];
  weekendBonus: string[];
  achievement: string[];
}

const messages: MessageCategory = {
  greetings: [
    "Olá, aventureiro! 🌟",
    "Bem-vindo de volta! 🚀",
    "Oi! Vamos conquistar hoje? ⭐",
    "E aí, campeão? 🏆",
    "Boa missão! 💪",
    "Hora de brilhar! ✨",
    "Tudo pronto pra hoje? 🎯",
    "Vamos nessa! 🌈"
  ],
  encouragement: [
    "Você está indo muito bem! 🌟",
    "Continue assim, campeão! 🏆",
    "Cada missão te torna mais forte! 💪",
    "Nada pode te parar! 🚀",
    "Você é incrível! ⭐",
    "Força e coragem! ✨",
    "Acredite em você! 🎯",
    "Você consegue! 🌈"
  ],
  missionComplete: [
    "Missão conquistada! 🎉",
    "Boa! Você conseguiu! ⭐",
    "Mais uma vitória! 🏆",
    "Arrasou! 💪",
    "Perfeito! 🚀",
    "Isso aí! ✨",
    "Parabéns! 🎯",
    "Excelente trabalho! 🌈"
  ],
  streak: [
    "Sequência mantida! 🔥",
    "Você está imbatível! ⭐",
    "Dias seguidos de sucesso! 🏆",
    "Que força! 💪",
    "Nada te detém! 🚀",
    "Consistência é poder! ✨",
    "Seu esforço valeu! 🎯",
    "Continue firme! 🌈"
  ],
  weekendBonus: [
    "Bônus de fim de semana! 🎊",
    "Recompensa dobrada! ✨",
    "Fim de semana especial! 🌟",
    "Super bônus! 💎",
    "Dobradinho! 🎉",
    "Sorte do fim de semana! 🍀",
    "Recompensa extra! ⭐",
    "Power-up de fim de semana! 🚀"
  ],
  achievement: [
    "Conquista desbloqueada! 🏅",
    "Você é lendário! 🌟",
    "Marco alcançado! ⭐",
    "Incrível! 🏆",
    "Perfeição! 💪",
    "Você brilha! ✨",
    "História feita! 🎯",
    "Lenda! 🌈"
  ]
};

// Helpers para obter mensagens aleatórias
function getRandomMessage(category: keyof MessageCategory): string {
  const categoryMessages = messages[category];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
}

export function getGreetingMessage(): string {
  return getRandomMessage('greetings');
}

export function getEncouragementMessage(): string {
  return getRandomMessage('encouragement');
}

export function getMissionCompleteMessage(): string {
  return getRandomMessage('missionComplete');
}

export function getStreakMessage(): string {
  return getRandomMessage('streak');
}

export function getWeekendBonusMessage(): string {
  return getRandomMessage('weekendBonus');
}

export function getAchievementMessage(): string {
  return getRandomMessage('achievement');
}
