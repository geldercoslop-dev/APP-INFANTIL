import { useState, useEffect, useRef } from 'react';
import './AnimatedCounter.css';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedCounter = ({ 
  value, 
  duration = 1000, 
  prefix = '', 
  suffix = '',
  className = ''
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const currentValueRef = useRef(value);

  useEffect(() => {
    if (currentValueRef.current === value) {
      return;
    }

    const startValue = currentValueRef.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

      currentValueRef.current = currentValue;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={`animated-counter ${displayValue !== value ? 'counter--animating' : ''} ${className}`}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

export default AnimatedCounter;
