import React, { useMemo } from 'react';
import './Confetti.css';

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger, duration = 3000 }) => {
  const particles = useMemo(() => {
    if (!trigger) {
      return [];
    }

    const colors = ['#22c55e', '#fbbf24', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [trigger]);

  if (!trigger || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${duration}ms`,
            backgroundColor: particle.color
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
