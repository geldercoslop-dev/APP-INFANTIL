import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import './CoinDisplay.css';

interface CoinDisplayProps {
  className?: string;
  showAnimation?: boolean;
}

const CoinDisplay: React.FC<CoinDisplayProps> = ({ className = '', showAnimation = true }) => {
  const { user } = useGameStore();
  const [prevCoins, setPrevCoins] = useState(user.coins);
  const [isIncreasing, setIsIncreasing] = useState(false);

  useEffect(() => {
    if (user.coins > prevCoins) {
      setIsIncreasing(true);
      setPrevCoins(user.coins);
      
      // Remove animation class after animation completes
      setTimeout(() => {
        setIsIncreasing(false);
      }, 600);
    } else {
      setPrevCoins(user.coins);
    }
  }, [user.coins, prevCoins]);

  return (
    <div className={`coin-display ${className} ${isIncreasing && showAnimation ? 'coin-increase' : ''}`}>
      <span className="coin-icon">🪙</span>
      <span className="coin-value">{user.coins}</span>
    </div>
  );
};

export default CoinDisplay;
