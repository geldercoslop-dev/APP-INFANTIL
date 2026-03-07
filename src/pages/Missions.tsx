import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getLocalISODate } from '../utils/dateUtils';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { requireOnline } from '../utils/offlineGuard';
import Confetti from '../components/Confetti';
import ProgressSystem from '../components/ProgressSystem';
import DailyBonusMission from '../components/DailyBonusMission';
import './Missions.css';

const Missions = () => {
  const { missions, completeMission, resetDailyMissions, user, checkAndResetWeeklyChallenges } = useGameStore();
  const [showReward, setShowReward] = useState<{ xp: number; coins: number; multiplier: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const isOnline = useOnlineStatus();

  const today = getLocalISODate();
  const todayMissions = missions[today] || [];

  useEffect(() => {
    // Generate missions for today if they don't exist
    if (todayMissions.length === 0) {
      resetDailyMissions();
    }
    
    // Check and reset weekly challenges if needed
    checkAndResetWeeklyChallenges();
  }, [today, todayMissions.length, resetDailyMissions, checkAndResetWeeklyChallenges]);

  const handleCompleteMission = async (missionId: string) => {
    if (!requireOnline(isOnline, 'completar missão')) return;
    
    const mission = todayMissions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    try {
      const result = await completeMission(missionId);
      
      // Show reward popup with actual awarded values
      setShowReward({ xp: result.awardedXp, coins: result.awardedCoins, multiplier: result.multiplier });
      
      // Show confetti
      setShowConfetti(true);
      
      // Hide reward after 3 seconds
      setTimeout(() => setShowReward(null), 3000);
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  };

  const completedCount = todayMissions.filter(m => m.completed).length;
  const totalCount = todayMissions.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={`missions missions--${user.genderTheme}`}>
      {/* Shapes decorativos de energia */}
      <div className="energy-bolt-1"></div>
      <div className="energy-bolt-2"></div>
      <div className="energy-ring"></div>
      <div className="energy-star"></div>
      
      <div className="missions__header">
        <h1>🎯 Missões Diárias</h1>
        <p>Complete suas missões para ganhar recompensas!</p>
      </div>

      <div className="missions__stats">
        <div className="stat-item">
          <span className="stat-icon">📅</span>
          <span>{completedCount}/{totalCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <span>Dia {user.streak}</span>
        </div>
      </div>

      <div className="missions__progress">
        <div className="progress-text">Progresso do dia: {Math.round(progressPercentage)}%</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <DailyBonusMission />

      {/* Weekly Progress */}
      <ProgressSystem compact={false} showDaily={false} showWeekly={true} />

      <div className="missions__list">
        {todayMissions.map((mission) => (
          <div
            key={mission.id}
            className={`mission-item card-hover ${mission.completed ? 'completed' : ''}`}
            onClick={() => !mission.completed && handleCompleteMission(mission.id)}
          >
            <div className="mission-checkbox">
              {mission.completed && <span className="checkmark">✓</span>}
            </div>
            <div className="mission-content">
              <h3>{mission.title}</h3>
              {mission.description && <p>{mission.description}</p>}
              <div className="mission-reward">
                <span className="reward-icon">💰</span>
                <span className="reward-value">+{mission.coins} moedas</span>
                <span className="reward-xp">+{mission.xp} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showConfetti && <Confetti trigger={showConfetti} />}
      
      {showReward && (
        <div className="reward-popup">
          <div className="reward-popup__content">
            <div className="reward-popup__icon">🎉</div>
            <h2>Missão Concluída!</h2>
            {showReward.multiplier > 1 && (
              <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0.5rem 0' }}>
                Fim de semana! Recompensa em dobro! ✨
              </p>
            )}
            <div className="reward-popup__stats">
              <div className="reward-stat">
                <span className="reward-icon">⭐</span>
                <span>+{showReward.xp} XP</span>
              </div>
              <div className="reward-stat">
                <span className="reward-icon">💰</span>
                <span>+{showReward.coins} moedas</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Missions;
