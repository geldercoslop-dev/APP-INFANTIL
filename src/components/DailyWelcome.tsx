import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getGreetingTime, getMotivationalMessage } from '../utils/dailyMessages';
import './DailyWelcome.css';

interface DailyWelcomeProps {
  onComplete: () => void;
}

const DailyWelcome: React.FC<DailyWelcomeProps> = ({ onComplete }) => {
  const { user } = useGameStore();
  const [isVisible, setIsVisible] = useState(false);

  const greetingTime = getGreetingTime();
  const motivationalMessage = getMotivationalMessage();

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  useEffect(() => {
    // Animar entrada
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-fechar após 4 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timer);
    };
  }, [handleClose]);

  return (
    <div className={`daily-welcome-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="daily-welcome-card">
        <div className="welcome-header">
          <span className="welcome-emoji">🌟</span>
          <h2 className="welcome-title">{greetingTime}!</h2>
        </div>
        
        <div className="welcome-message">
          <p>{motivationalMessage}</p>
        </div>

        <div className="welcome-stats">
          <div className="stat-item">
            <span className="stat-emoji">🪙</span>
            <div className="stat-info">
              <span className="stat-value">{user.coins}</span>
              <span className="stat-label">Moedas</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-emoji">🔥</span>
            <div className="stat-info">
              <span className="stat-value">{user.dailyStreak || 0}</span>
              <span className="stat-label">Dias seguidos</span>
            </div>
          </div>
        </div>

        <button className="welcome-close-btn" onClick={handleClose}>
          Vamos lá! 🚀
        </button>
      </div>
    </div>
  );
};

export default DailyWelcome;
