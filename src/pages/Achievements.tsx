import { useGameStore } from '../store/useGameStore';
import type { AchievementKey } from '../types';
import { formatShortLocalDate } from '../utils/dateUtils';
import { calculateLevel } from '../utils/levelSystem';
import BackButton from '../components/BackButton';
import Confetti from '../components/Confetti';
import './Page.css';
import './Achievements.css';

const Achievements = () => {
  const { achievements, user, totalMissionsCompleted, achievementToast } = useGameStore();
  const currentLevel = calculateLevel(user.xp);

  const achievementList: AchievementKey[] = [
    'first_mission',
    'streak_3', 
    'streak_7',
    'missions_10',
    'level_5',
    'level_10',
    'coins_50',
    'coins_500'
  ];

  const getProgressInfo = (key: AchievementKey) => {
    switch (key) {
      case 'first_mission':
        return {
          current: totalMissionsCompleted >= 1 ? 1 : totalMissionsCompleted,
          target: 1,
          label: 'Primeira missão'
        };
      case 'missions_10':
        return {
          current: Math.min(totalMissionsCompleted, 10),
          target: 10,
          label: 'Missões completadas'
        };
      case 'streak_3':
        return {
          current: Math.min(user.streak, 3),
          target: 3,
          label: 'Sequência'
        };
      case 'streak_7':
        return {
          current: Math.min(user.streak, 7),
          target: 7,
          label: 'Sequência'
        };
      case 'level_5':
        return {
          current: Math.min(currentLevel, 5),
          target: 5,
          label: 'Nível'
        };
      case 'level_10':
        return {
          current: Math.min(currentLevel, 10),
          target: 10,
          label: 'Nível'
        };
      case 'coins_50':
        return {
          current: Math.min(user.coins, 50),
          target: 50,
          label: 'Moedas'
        };
      default:
        return { current: 0, target: 1, label: '' };
    }
  };

  return (
    <div className="achievements">
      {achievementToast && <Confetti trigger={true} />}
      
      <BackButton to="/home" />
      
      <div className="achievements__header">
        <h1>� Conquistas</h1>
        <p>Seus troféus e progresso!</p>
      </div>
      
      <div className="achievements__content">
        {achievementList.length > 0 ? (
          <div className="achievements__grid">
            {achievementList.map(key => {
              const achievement = achievements[key];
              const isUnlocked = !!achievement;
              const progress = getProgressInfo(key);
              const progressPercentage = Math.min((progress.current / progress.target) * 100, 100);
              
              return (
                <div 
                  key={key} 
                  className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-card__icon">
                    <span className="achievement-emoji">
                      {isUnlocked ? achievement.emoji : '🔒'}
                    </span>
                  </div>
                  <div className="achievement-card__content">
                    <h3 className="achievement-title">
                      {isUnlocked ? achievement.title : '???'}
                    </h3>
                    <p className="achievement-description">
                      {isUnlocked ? achievement.description : 'Complete mais missões para desbloquear'}
                    </p>
                    
                    {/* Progresso parcial */}
                    {!isUnlocked && (
                      <div className="achievement-progress">
                        <div className="achievement-progress__text">
                          <span>{progress.label}: {progress.current} / {progress.target}</span>
                        </div>
                        <div className="achievement-progress__bar">
                          <div 
                            className="achievement-progress__fill" 
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {isUnlocked && (
                      <div className="achievement-date">
                        <span>Desbloqueado em {formatShortLocalDate(achievement.unlockedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="achievements__empty">
            <div className="empty-icon">🏆</div>
            <h3>Nenhuma conquista disponível</h3>
            <p>Complete missões para desbloquear conquistas incríveis!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
