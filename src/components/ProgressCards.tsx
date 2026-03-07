import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { getLocalISODate } from '../utils/dateUtils';
import AnimatedCounter from './AnimatedCounter';
import './ProgressCards.css';

const ProgressCards: React.FC = () => {
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
    <div className="progress-cards">
      {/* Coins Card */}
      <div className="progress-card coins-card">
        <div className="card-header">
          <span className="card-icon">🪙</span>
          <span className="card-title">Moedas</span>
        </div>
        <div className="card-content">
          <AnimatedCounter 
            value={user.coins} 
            duration={1000}
            className="card-value"
          />
        </div>
      </div>

      {/* Level Card */}
      <div className="progress-card level-card">
        <div className="card-header">
          <span className="card-icon">⭐</span>
          <span className="card-title">Nível</span>
        </div>
        <div className="card-content">
          <AnimatedCounter 
            value={user.level} 
            duration={800}
            className="card-value"
          />
        </div>
      </div>

      {/* Streak Card */}
      <div className="progress-card streak-card">
        <div className="card-header">
          <span className="card-icon">🔥</span>
          <span className="card-title">Sequência</span>
        </div>
        <div className="card-content">
          <AnimatedCounter 
            value={user.dailyStreak || 0} 
            duration={600}
            className="card-value"
          />
          <span className="card-unit">dias</span>
        </div>
      </div>

      {/* Daily Missions Card */}
      {totalMissionsCount > 0 && (
        <div className="progress-card missions-card">
          <div className="card-header">
            <span className="card-icon">📋</span>
            <span className="card-title">Missões</span>
          </div>
          <div className="card-content">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${(completedMissionsCount / totalMissionsCount) * 100}%` 
                }}
              />
            </div>
            <div className="progress-text">
              <AnimatedCounter value={completedMissionsCount} duration={400} />
              <span>/{totalMissionsCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Challenges Card */}
      {totalWeeklyChallenges > 0 && (
        <div className="progress-card challenges-card">
          <div className="card-header">
            <span className="card-icon">🏆</span>
            <span className="card-title">Desafios</span>
          </div>
          <div className="card-content">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${(completedWeeklyChallenges / totalWeeklyChallenges) * 100}%` 
                }}
              />
            </div>
            <div className="progress-text">
              <AnimatedCounter value={completedWeeklyChallenges} duration={400} />
              <span>/{totalWeeklyChallenges}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCards;
