import React from 'react';
import { useGameStore } from '../store/useGameStore';
import './CoinDisplay.css';

interface CoinDisplayProps {
  className?: string;
  showAnimation?: boolean;
}

const CoinDisplay: React.FC<CoinDisplayProps> = ({ className = '', showAnimation = true }) => {
  const { user } = useGameStore();

  return (
    <div
      key={showAnimation ? user.coins : 'coin-static'}
      className={`coin-display ${className} ${showAnimation ? 'coin-increase' : ''}`}
    >
      <span className="coin-icon">🪙</span>
      <span className="coin-value">{user.coins}</span>
    </div>
  );
};

export default CoinDisplay;
