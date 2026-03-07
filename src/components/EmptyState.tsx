import './EmptyState.css';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

const EmptyState = ({ emoji, title, description, action }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state__emoji">{emoji}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action && (
        <button className="empty-state__action" onClick={action.onClick}>
          {action.text}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
