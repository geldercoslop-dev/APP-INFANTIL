import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { WeeklyChallengeKey } from '../types/weeklyChallenges';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { requireOnline } from '../utils/offlineGuard';
import EmptyState from '../components/EmptyState';
import BackButton from '../components/BackButton';
import './Page.css';
import './Challenges.css';

const Challenges = () => {
  const { 
    getWeeklyChallenges, 
    claimWeeklyChallengeReward,
    parentSettings,
    user
  } = useGameStore();
  
  const [claimingChallenge, setClaimingChallenge] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const isOnline = useOnlineStatus();
  const challenges = getWeeklyChallenges();
  
  const handleClaimReward = async (challengeKey: WeeklyChallengeKey) => {
    if (!requireOnline(isOnline, 'resgatar recompensa de desafio')) return;
    
    setClaimingChallenge(challengeKey);
    
    try {
      const result = await claimWeeklyChallengeReward(challengeKey);
      setMessage({ type: 'success', text: result.message });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao resgatar recompensa' });
    }
    
    setClaimingChallenge(null);
    setTimeout(() => setMessage(null), 3000);
  };
  
  const getWeekDisplay = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `${startOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
  };
  
  if (!parentSettings.weeklyChallengesEnabled) {
    return (
      <div className="page">
        <div className="page__header">
          <h1>🎯 Desafios</h1>
          <p>Desafios semanais desativados pelos pais.</p>
        </div>
        
        <EmptyState
          emoji="🔒"
          title="Desafios Desativados"
          description="Peça aos seus pais para ativarem os desafios semanais!"
          action={{
            text: "Ir para Configurações",
            onClick: () => window.location.href = '/parent'
          }}
        />
      </div>
    );
  }
  
  return (
    <div className={`challenges challenges--${user.genderTheme}`}>
      <BackButton to="/home" />
      <div className="challenges__header">
        <h1>🏆 Desafios Semanais</h1>
        <p>Complete desafios para ganhar moedas e recompensas!</p>
      </div>
      
      <div className="page__content">
        {/* Week Summary */}
        <div className="challenges__week-summary">
          <div className="week-summary__info">
            <span className="week-label">Semana atual:</span>
            <span className="week-dates">{getWeekDisplay()}</span>
          </div>
        </div>
        
        {/* Message Toast */}
        {message && (
          <div className={`challenges__message challenges__message--${message.type}`}>
            {message.text}
          </div>
        )}
        
        {/* Challenges List */}
        {challenges.length > 0 ? (
          <div className="challenges__list">
            {challenges.map((challenge) => {
              const progress = challenge.progress || 0;
              const progressPercentage = Math.min((progress / challenge.goal) * 100, 100);
              
              return (
                <div key={challenge.key} className="challenge-card">
                  <div className="challenge-card__header">
                    <span className="challenge-emoji">{challenge.emoji}</span>
                    <div className="challenge-info">
                      <h3 className="challenge-title">{challenge.title}</h3>
                      <p className="challenge-description">{challenge.description}</p>
                    </div>
                  </div>
                  
                  <div className="challenge-card__progress">
                    <div className="progress-info">
                      <span className="progress-text">
                        Progresso: {Math.floor(progressPercentage)}%
                      </span>
                      <span className="progress-reward">
                        Recompensa: +{challenge.rewardCoins} 🪙 +{challenge.rewardXp} ⭐
                      </span>
                    </div>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="progress-current">
                      {progress}/{challenge.goal}
                    </div>
                  </div>
                  
                  <div className="challenge-card__actions">
                    {challenge.completed && !challenge.claimedAt ? (
                      <button
                        className="challenge-claim-btn"
                        onClick={() => handleClaimReward(challenge.key)}
                        disabled={claimingChallenge === challenge.key}
                      >
                        {claimingChallenge === challenge.key ? 'Resgatando...' : 'Resgatar Recompensa'}
                      </button>
                    ) : challenge.completed ? (
                      <div className="challenge-claimed">
                        <span className="claimed-icon">✅</span>
                        <span className="claimed-text">Recompensa resgatada</span>
                      </div>
                    ) : (
                      <div className="challenge-pending">
                        <span className="pending-icon">⏳</span>
                        <span className="pending-text">Em andamento...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            emoji="🎯"
            title="Nenhum Desafio Disponível"
            description="Aguarde o início da próxima semana para novos desafios!"
          />
        )}
      </div>
    </div>
  );
};

export default Challenges;
