import React, { useMemo } from 'react';
import './Confetti.css';

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
}

const STATIC_PARTICLES = Array.from({ length: 50 }, (_, i) => {
  const colors = ['#22c55e', '#fbbf24', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
  return {
    id: i + 1,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
});

const Confetti: React.FC<ConfettiProps> = ({ trigger, duration = 3000 }) => {
  const particles = useMemo(() => (trigger ? STATIC_PARTICLES : []), [trigger]);

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
