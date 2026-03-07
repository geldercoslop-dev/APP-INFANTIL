import { useGameStore } from '../store/useGameStore';
import { calculateLevel, getLevelProgress } from '../utils/levelSystem';
import './LevelProgress.css';

interface LevelProgressProps {
  compact?: boolean;
  showCoins?: boolean;
  showStreak?: boolean;
}

const LevelProgress = ({ compact = false, showCoins = true, showStreak = true }: LevelProgressProps) => {
  const { user } = useGameStore();
  const level = calculateLevel(user.xp);
  const progress = getLevelProgress(user.xp, level);

  return (
    <div className={`level-progress ${compact ? 'level-progress--compact' : ''}`}>
      <div className="level-progress__header">
        <div className="level-progress__level">
          <span className="level-progress__label">Nível</span>
          <span className="level-progress__value">{level}</span>
        </div>
        
        {showCoins && (
          <div className="level-progress__coins">
            <span className="level-progress__icon">💰</span>
            <span className="level-progress__value">{user.coins}</span>
          </div>
        )}
        
        {showStreak && (
          <div className="level-progress__streak">
            <span className="level-progress__icon">🔥</span>
            <span className="level-progress__value">{user.streak}</span>
          </div>
        )}
      </div>
      
      <div className="level-progress__xp">
        <div className="level-progress__xp-text">
          <span>XP: {progress.current} / {progress.max}</span>
        </div>
        <div className="level-progress__bar">
          <div 
            className="level-progress__fill" 
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;
