// Mensagens motivacionais diárias baseadas no período do dia

export function getGreetingTime(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Bom dia";
  } else if (hour < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
}

export function getMotivationalMessage(): string {
  const messages = [
    "Vamos completar algumas missões hoje?",
    "Pronto para novas aventuras? 🚀",
    "Hoje tem missões emocionantes! ⭐",
    "Vamos conquistar o dia juntos? 💪",
    "Que tal começar com uma missão? 🎯",
    "Seu mascote está esperando por você! 🌟",
    "Novo dia, novas conquistas! 🏆",
    "Vamos fazer hoje especial? ✨",
    "Missões te esperam, campeão! 🎮",
    "Hora de brilhar hoje! 🌈"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getDailyReminderMessage(): string {
  const messages = [
    "Uma missão hoje mantém seu mascote feliz! 🎭",
    "Seu mascote está com saudade! 🌟",
    "Que tal uma missão rápida? 🚀",
    "Seu mascote acredita em você! 💪",
    "Só uma missão para manter o ritmo! ⭐",
    "Seu mascote está te esperando! 🎯",
    "Uma missão faz toda diferença! ✨",
    "Seu mascote sabe que você consegue! 🏆",
    "Vamos fazer seu mascote feliz? 🌈",
    "Só mais uma missão, campeão! 🎮"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}
