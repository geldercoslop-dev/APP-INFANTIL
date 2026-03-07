import { useNavigate } from 'react-router-dom';
import './BackButton.css';

interface BackButtonProps {
  to?: string;
  label?: string;
}

const BackButton = ({ to, label = '← Voltar' }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="back-button" onClick={handleClick}>
      {label}
    </button>
  );
};

export default BackButton;
