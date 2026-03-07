import './MascotToast.css';

type Props = {
  message: string;
};

export default function MascotToast({ message }: Props) {
  return (
    <div className="mascot-toast">
      <div className="mascot-toast__content">
        <div className="mascot-toast__icon">🎉</div>
        <div className="mascot-toast__message">{message}</div>
      </div>
    </div>
  );
}
