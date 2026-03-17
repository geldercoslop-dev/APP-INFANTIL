import { useState, useEffect, useCallback } from 'react';
import Confetti from './Confetti';
import './LevelUpCelebration.css';

interface LevelUpCelebrationProps {
  newLevel: number;
  onComplete: () => void;
}

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ newLevel, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setShowConfetti(false);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  useEffect(() => {
    // Iniciar animação
    const visibleTimer = setTimeout(() => setIsVisible(true), 100);
    const confettiTimer = setTimeout(() => setShowConfetti(true), 300);
    
    // Auto-fechar após 5 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(confettiTimer);
      clearTimeout(timer);
    };
  }, [handleClose]);

  return (
    <>
      {showConfetti && <Confetti trigger={true} duration={4000} />}
      <div className={`level-up-overlay ${isVisible ? 'visible' : ''}`}>
        <div className="level-up-card">
          <div className="level-up-header">
            <div className="level-up-icon">🎉</div>
            <h2 className="level-up-title">LEVEL UP!</h2>
          </div>
          
          <div className="level-up-content">
            <div className="level-display">
              <span className="level-number">{newLevel}</span>
              <span className="level-label">Nível</span>
            </div>
            
            <div className="level-up-message">
              <p>Parabéns! Você alcançou um novo nível!</p>
              <p>Continue assim para desbloquear mais conquistas! 🏆</p>
            </div>

            <div className="level-up-achievements">
              <div className="achievement-item">
                <span className="achievement-icon">⭐</span>
                <span className="achievement-text">+100 XP Bonus</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">🪙</span>
                <span className="achievement-text">Moedas Extras</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">🎯</span>
                <span className="achievement-text">Novas Missões</span>
              </div>
            </div>
          </div>

          <button className="level-up-close-btn" onClick={handleClose}>
            Continuar Jogando! 🚀
          </button>
        </div>
      </div>
    </>
  );
};

export default LevelUpCelebration;
