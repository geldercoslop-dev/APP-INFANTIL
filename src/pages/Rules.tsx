import { useNavigate } from 'react-router-dom';
import './Page.css';

const Rules = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="page">
      <div className="page__header">
        <button onClick={handleBack} className="back-button">
          ← Voltar
        </button>
        <h1>📋 Regras</h1>
        <p>Conheça as regras e como jogar!</p>
      </div>
      
      <div className="page__content">
        <div className="page__icon">📜</div>
        <div className="rules-content">
          <h2>Como Jogar</h2>
          <ul>
            <li>Complete as missões diárias para ganhar moedas</li>
            <li>Use as moedas na loja para comprar itens</li>
            <li>Mantenha sua sequência de dias perfeitos</li>
            <li>Suba de nível ganhando XP</li>
          </ul>
          
          <h2>Dicas</h2>
          <ul>
            <li>Registre seu humor todos os dias</li>
            <li>Complete todas as missões para bônus</li>
            <li>Visite o app diariamente para não perder a sequência</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rules;
