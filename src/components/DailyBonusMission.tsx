import { useGameStore } from '../store/useGameStore';
import { getLocalISODate } from '../utils/dateUtils';
import AnimatedCounter from './AnimatedCounter';
import './DailyBonusMission.css';

const DailyBonusMission = () => {
  const { dailyBonusMission, completeDailyBonusMission, missions } = useGameStore();
  
  const today = getLocalISODate();
  const todayMissions = missions[today] || [];
  const completedMissions = todayMissions.filter(m => m.completed).length;
  
  if (!dailyBonusMission || dailyBonusMission.completed) return null;
  
  const progress = Math.min(completedMissions / 3, 1);
  const canComplete = completedMissions >= 3;
  
  return (
    <div className="daily-bonus-mission">
      <div className="daily-bonus-mission__header">
        <span className="daily-bonus-mission__emoji">{dailyBonusMission.emoji}</span>
        <span className="daily-bonus-mission__title">{dailyBonusMission.title}</span>
      </div>
      
      <div className="daily-bonus-mission__description">
        {dailyBonusMission.description}
      </div>
      
      <div className="daily-bonus-mission__progress">
        <div className="progress-info">
          <span>Progresso: </span>
          <AnimatedCounter value={completedMissions} duration={300} />/3
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      
      <div className="daily-bonus-mission__rewards">
        <span className="reward-item">
          <span className="reward-icon">💰</span>
          <AnimatedCounter value={dailyBonusMission.coins} duration={400} />
        </span>
        <span className="reward-item">
          <span className="reward-icon">⭐</span>
          <AnimatedCounter value={dailyBonusMission.xp} duration={400} />
        </span>
      </div>
      
      <button 
        className={`daily-bonus-mission__button ${canComplete ? 'can-complete' : 'disabled'}`}
        onClick={completeDailyBonusMission}
        disabled={!canComplete}
      >
        {canComplete ? 'Resgatar Recompensa!' : `Complete mais ${3 - completedMissions} missões`}
      </button>
    </div>
  );
};

export default DailyBonusMission;
