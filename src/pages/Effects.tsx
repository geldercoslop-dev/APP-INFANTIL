import { useNavigate } from 'react-router-dom';
import './Page.css';

const Effects = () => {
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
        <h1>✨ Efeitos</h1>
        <p>Descubra efeitos sonoros e visuais incríveis!</p>
      </div>
      
      <div className="page__content">
        <div className="page__icon">🎆</div>
        <p className="page__coming-soon">Efeitos em desenvolvimento...</p>
        <button className="btn btn-primary" disabled>
          Em breve
        </button>
      </div>
    </div>
  );
};

export default Effects;
