import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { RealReward } from '../types/rewards';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { requireOnline } from '../utils/offlineGuard';
import EmptyState from '../components/EmptyState';
import './Rewards.css';

const Rewards = () => {
  const { user, parentConfig, redeemRealReward } = useGameStore();
  const [activeTab, setActiveTab] = useState<'available' | 'redeemed'>('available');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const isOnline = useOnlineStatus();

  // Default rewards if none configured
  const defaultRewards: RealReward[] = [
    { id: 'ice_cream', title: 'Sorvete', emoji: '🍦', cost: 50 },
    { id: 'park', title: 'Passeio no parque', emoji: '�', cost: 80 },
    { id: 'toy', title: 'Brinquedo novo', emoji: '🧸', cost: 120 },
    { id: 'movie', title: 'Noite do filme', emoji: '🎬', cost: 90 }
  ];

  const rewards = parentConfig.realRewards.length > 0 ? parentConfig.realRewards : defaultRewards;
  
  const availableRewards = rewards.filter(r => !r.redeemedAt);
  const redeemedRewards = rewards.filter(r => r.redeemedAt);

  const handleRedeem = async (rewardId: string) => {
    if (!requireOnline(isOnline, 'resgatar recompensa')) return;
    
    try {
      const result = await redeemRealReward(rewardId);
      setMessage({ type: 'success', text: result.message });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao resgatar recompensa' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1>🎁 Recompensas</h1>
        <p>Use suas moedas para ganhar prêmios do mundo real!</p>
      </div>
      
      <div className="page__content">
        {/* Tabs */}
        <div className="rewards__tabs">
          <button
            className={`tab-chip ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <span className="tab-emoji">🎯</span>
            <span className="tab-name">Disponíveis</span>
          </button>
          <button
            className={`tab-chip ${activeTab === 'redeemed' ? 'active' : ''}`}
            onClick={() => setActiveTab('redeemed')}
          >
            <span className="tab-emoji">✅</span>
            <span className="tab-name">Resgatadas</span>
          </button>
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`rewards__message rewards__message--${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Rewards Grid */}
        {activeTab === 'available' && availableRewards.length > 0 ? (
          <div className="rewards__grid">
            {availableRewards.map((reward: RealReward) => {
              const canAfford = user.coins >= reward.cost;
              
              return (
                <div key={reward.id} className={`reward-card ${!canAfford ? 'disabled' : ''}`}>
                  <div className="reward-card__emoji">{reward.emoji}</div>
                  <div className="reward-card__info">
                    <h3 className="reward-card__title">{reward.title}</h3>
                    {reward.description && (
                      <p className="reward-card__description">{reward.description}</p>
                    )}
                    <div className="reward-card__cost">
                      <span className="cost-icon">🪙</span>
                      <span className="cost-amount">{reward.cost}</span>
                    </div>
                    <button
                      className="reward-redeem-btn"
                      onClick={() => handleRedeem(reward.id)}
                      disabled={!canAfford || !!reward.redeemedAt}
                    >
                      {reward.redeemedAt ? 'Resgatado' : canAfford ? 'Resgatar' : 'Moedas insuficientes'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'available' ? (
          <EmptyState
            emoji="🎁"
            title="Nenhuma Recompensa Disponível"
            description="Peça aos seus pais para adicionarem recompensas incríveis!"
            action={{
              text: "Ir para Configurações",
              onClick: () => window.location.href = '/parent'
            }}
          />
        ) : (
          <div className="rewards__grid">
            {redeemedRewards.map((reward: RealReward) => (
              <div key={reward.id} className="reward-card redeemed">
                <div className="reward-card__emoji">{reward.emoji}</div>
                <div className="reward-card__info">
                  <h3 className="reward-card__title">{reward.title}</h3>
                  {reward.description && (
                    <p className="reward-card__description">{reward.description}</p>
                  )}
                  <div className="reward-card__redeemed-at">
                    <span className="redeemed-date">
                      Resgatado em: {reward.redeemedAt && new Date(reward.redeemedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
