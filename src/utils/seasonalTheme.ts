export interface SeasonalTheme {
  message?: string;
  emoji?: string;
  isWeekend: boolean;
  isDecember: boolean;
  isJune: boolean;
}

export function getSeasonalTheme(): SeasonalTheme {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = domingo, 6 = sábado
  const month = today.getMonth(); // 11 = dezembro, 5 = junho
  
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isDecember = month === 11;
  const isJune = month === 5;
  
  // Mensagens especiais baseadas na data
  if (isDecember) {
    return {
      message: 'Clima especial de festa! 🎉',
      emoji: '🎄',
      isWeekend,
      isDecember: true,
      isJune: false
    };
  }
  
  if (isJune) {
    return {
      message: 'Mês de festas juninas! 🎊',
      emoji: '🎆',
      isWeekend,
      isDecember: false,
      isJune: true
    };
  }
  
  if (isWeekend) {
    return {
      message: 'Fim de semana divertido! ✨',
      emoji: '🎉',
      isWeekend: true,
      isDecember: false,
      isJune: false
    };
  }
  
  return {
    message: undefined,
    emoji: undefined,
    isWeekend: false,
    isDecember: false,
    isJune: false
  };
}
