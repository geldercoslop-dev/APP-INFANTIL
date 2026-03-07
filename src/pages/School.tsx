import './Page.css';

const School = () => {
  return (
    <div className="page">
      <div className="page__header">
        <h1>🏫 Escola</h1>
        <p>Registre suas atividades escolares e conquistas!</p>
      </div>
      
      <div className="page__content">
        <div className="page__icon">📚</div>
        <p className="page__coming-soon">Módulo escolar em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default School;
