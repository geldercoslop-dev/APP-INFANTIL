import './AchievementToast.css';

type Props = {
  title: string;
  description?: string;
};

export default function AchievementToast({ title, description }: Props) {
  return (
    <div className="achievement-toast">
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}
