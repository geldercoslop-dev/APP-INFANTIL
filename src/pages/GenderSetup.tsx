import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import './GenderSetup.css';

const GenderSetup = () => {
  const navigate = useNavigate();
  const { setUser } = useGameStore();

  const handleGenderSelect = (genderTheme: 'boy' | 'girl') => {
    setUser({ genderTheme });
    navigate('/setup/mascot');
  };

  return (
    <div className="gender-setup">
      <div className="gender-setup__container">
        <div className="gender-setup__header">
          <h1>👋 Olá! Seja bem-vindo!</h1>
          <p>Você é um menino ou uma menina?</p>
        </div>
        
        <div className="gender-setup__options">
          <button 
            className="gender-option gender-option--boy"
            onClick={() => handleGenderSelect('boy')}
          >
            <div className="gender-option__icon">👦</div>
            <div className="gender-option__label">Menino</div>
          </button>
          
          <button 
            className="gender-option gender-option--girl"
            onClick={() => handleGenderSelect('girl')}
          >
            <div className="gender-option__icon">👧</div>
            <div className="gender-option__label">Menina</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderSetup;
