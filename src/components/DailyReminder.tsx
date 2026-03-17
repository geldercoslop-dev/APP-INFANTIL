import { useState, useEffect, useCallback } from 'react';
import { getDailyReminderMessage } from '../utils/dailyMessages';
import './DailyReminder.css';

interface DailyReminderProps {
  onComplete: () => void;
}

const DailyReminder: React.FC<DailyReminderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const reminderMessage = getDailyReminderMessage();

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  useEffect(() => {
    // Animar entrada
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-fechar após 3 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timer);
    };
  }, [handleClose]);

  return (
    <div className={`daily-reminder ${isVisible ? 'visible' : ''}`}>
      <div className="reminder-content">
        <span className="reminder-mascot">🎭</span>
        <p className="reminder-message">{reminderMessage}</p>
        <button className="reminder-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default DailyReminder;
