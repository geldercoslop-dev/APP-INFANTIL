import React from 'react';
import LevelProgress from './LevelProgress';
import ProgressBar from './ProgressBar';
import AnimatedCounter from './AnimatedCounter';
import { useGameStore } from '../store/useGameStore';
import { getLocalISODate } from '../utils/dateUtils';
import './ProgressSystem.css';

interface ProgressSystemProps {
  compact?: boolean;
  showDaily?: boolean;
  showWeekly?: boolean;
}

const ProgressSystem: React.FC<ProgressSystemProps> = ({ compact = false, showDaily = true, showWeekly = false }) => {
  const { user, missions, getWeeklyChallenges } = useGameStore();
  
  const today = getLocalISODate();
  const todayMissions = missions[today] || [];
  const completedMissionsCount = todayMissions.filter(m => m.completed).length;
  const totalMissionsCount = todayMissions.length;

  // Weekly challenges progress
  const weeklyChallenges = getWeeklyChallenges();
  const completedWeeklyChallenges = weeklyChallenges.filter(c => c.completed).length;
  const totalWeeklyChallenges = weeklyChallenges.length;

  return (
    <div className={`progress-system ${compact ? 'progress-system--compact' : ''}`}>
      {/* Level Progress */}
      <div className="progress-system__level">
        <LevelProgress 
          compact={compact} 
          showCoins={true} 
          showStreak={true} 
        />
      </div>

      {/* Daily Progress */}
      {showDaily && totalMissionsCount > 0 && (
        <div className="progress-system__daily">
          <div className="daily-progress__header">
            <span className="daily-progress__title">Progresso Diário</span>
            <span className="daily-progress__count">
              <AnimatedCounter 
                value={completedMissionsCount} 
                duration={800}
              />/{totalMissionsCount}
            </span>
          </div>
          <ProgressBar 
            current={completedMissionsCount}
            max={totalMissionsCount}
            color="green"
            size={compact ? "small" : "medium"}
            showPercentage={true}
          />
        </div>
      )}

      {/* Weekly Challenges Progress */}
      {showWeekly && totalWeeklyChallenges > 0 && (
        <div className="progress-system__weekly">
          <div className="weekly-progress__header">
            <span className="weekly-progress__title">Desafios Semanais</span>
            <span className="weekly-progress__count">
              <AnimatedCounter 
                value={completedWeeklyChallenges} 
                duration={800}
              />/{totalWeeklyChallenges}
            </span>
          </div>
          <ProgressBar 
            current={completedWeeklyChallenges}
            max={totalWeeklyChallenges}
            color="purple"
            size={compact ? "small" : "medium"}
            showPercentage={true}
          />
        </div>
      )}

      {/* Daily Streak */}
      <div className="progress-system__streak">
        <div className="streak-info">
          <span className="streak-icon">🔥</span>
          <div className="streak-details">
            <span className="streak-label">Sequência Diária</span>
            <AnimatedCounter 
              value={user.dailyStreak || 0} 
              duration={600}
              className="streak-value"
            />
            <span className="streak-days">dias</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {!compact && (
        <div className="progress-system__stats">
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <div className="stat-info">
              <span className="stat-label">XP Total</span>
              <AnimatedCounter 
                value={user.xp} 
                duration={1000}
                className="stat-value"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSystem;
