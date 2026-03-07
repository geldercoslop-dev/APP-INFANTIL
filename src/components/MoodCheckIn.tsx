import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { MoodKey } from '../types';
import './MoodCheckIn.css';

interface MoodCheckInProps {
  onComplete: () => void;
}

const MoodCheckIn = ({ onComplete }: MoodCheckInProps) => {
  const { setMoodForToday } = useGameStore();
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);

  const moods: Array<{ id: MoodKey; emoji: string; label: string }> = [
    { id: 'happy', emoji: '😀', label: 'Feliz' },
    { id: 'tired', emoji: '😴', label: 'Cansado' },
    { id: 'sad', emoji: '😢', label: 'Triste' },
    { id: 'angry', emoji: '😠', label: 'Bravo' },
    { id: 'excited', emoji: '🤩', label: 'Animado' },
  ];

  const handleMoodSelect = (moodId: MoodKey) => {
    setSelectedMood(moodId);
    setMoodForToday(moodId);
    
    // Auto-close after selection
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="mood-checkin">
      <div className="mood-checkin__modal">
        <h2>Como você está hoje?</h2>
        <div className="mood-checkin__options">
          {moods.map((mood) => (
            <button
              key={mood.id}
              className={`mood-option ${selectedMood === mood.id ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood.id)}
              disabled={selectedMood !== null}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>
        {selectedMood && (
          <div className="mood-checkin__success">
            <span className="success-emoji">✅</span>
            <span className="success-text">Humor registrado!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCheckIn;
