import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { AudioSystem } from '../systems/audioSystem';
import './SoundToggle.css';

interface SoundToggleProps {
  className?: string;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ className = '' }) => {
  const { parentSettings, toggleSound } = useGameStore();
  const isSoundEnabled = parentSettings.soundEnabled;

  const handleToggle = async () => {
    // Play click sound before toggling
    const audioSystem = AudioSystem.getInstance();
    await audioSystem.playClick();
    
    // Toggle sound state
    toggleSound();
  };

  return (
    <button 
      className={`sound-toggle ${isSoundEnabled ? 'sound-toggle--on' : 'sound-toggle--off'} ${className}`}
      onClick={handleToggle}
      aria-label={isSoundEnabled ? 'Desativar som' : 'Ativar som'}
      title={isSoundEnabled ? 'Som ativado' : 'Som desativado'}
    >
      <span className="sound-toggle__icon">
        {isSoundEnabled ? '🔊' : '🔇'}
      </span>
    </button>
  );
};

export default SoundToggle;
