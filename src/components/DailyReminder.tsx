import { useState, useEffect } from 'react';
import { getDailyReminderMessage } from '../utils/dailyMessages';
import './DailyReminder.css';

interface DailyReminderProps {
  onComplete: () => void;
}

const DailyReminder: React.FC<DailyReminderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const reminderMessage = getDailyReminderMessage();

  useEffect(() => {
    // Animar entrada
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto-fechar após 3 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

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
