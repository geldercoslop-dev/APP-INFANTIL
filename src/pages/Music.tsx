import { useNavigate } from 'react-router-dom';
import './Page.css';

const Music = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/more');
  };

  return (
    <div className="page">
      <div className="page__header">
        <button onClick={handleBack} className="back-button">
          ← Voltar
        </button>
        <h1>🎵 Músicas</h1>
        <p>Ouça as músicas mais divertidas das suas aventuras!</p>
      </div>
      
      <div className="page__content">
        <div className="page__icon">🎶</div>
        <p className="page__coming-soon">Músicas em desenvolvimento...</p>
        <button className="btn btn-primary" disabled>
          Em breve
        </button>
      </div>
    </div>
  );
};

export default Music;
