import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'gold';
  size?: 'small' | 'medium' | 'large';
}

const ProgressBar = ({ 
  current, 
  max, 
  label, 
  showPercentage = false,
  color = 'blue',
  size = 'medium'
}: ProgressBarProps) => {
  const percentage = max > 0 ? (current / max) * 100 : 0;
  
  const colorClasses = {
    blue: 'progress--blue',
    green: 'progress--green',
    purple: 'progress--purple',
    gold: 'progress--gold'
  };

  const sizeClasses = {
    small: 'progress--small',
    medium: 'progress--medium',
    large: 'progress--large'
  };

  return (
    <div className={`progress-bar ${colorClasses[color]} ${sizeClasses[size]}`}>
      {label && (
        <div className="progress__label">
          <span>{label}</span>
          {showPercentage && (
            <span className="progress__percentage">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="progress__track">
        <div 
          className="progress__fill"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
