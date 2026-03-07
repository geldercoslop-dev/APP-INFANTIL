import { useNavigate } from 'react-router-dom';
import { APP_VERSION, APP_BUILD_DATE } from '../constants/appVersion';
import './More.css';

const More = () => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/mascot', icon: '🎭', label: 'Mascote', description: 'Troque seu mascote' },
    { path: '/music', icon: '🎵', label: 'Músicas', description: 'Ouça músicas divertidas' },
    { path: '/effects', icon: '✨', label: 'Efeitos', description: 'Efeitos sonoros e visuais' },
    { path: '/rules', icon: '📋', label: 'Regras', description: 'Como jogar' },
    { path: '/school', icon: '📚', label: 'Escola', description: 'Atividades escolares' },
    { path: '/rewards', icon: '🏆', label: 'Recompensas', description: 'Resgate prêmios' },
    { path: '/profile', icon: '👤', label: 'Perfil', description: 'Seus dados' },
    { path: '/achievements', icon: '🏅', label: 'Conquistas', description: 'Seus prêmios e marcos' },
    { path: '/challenges', icon: '🎯', label: 'Desafios', description: 'Desafios semanais' },
    { path: '/backup', icon: '💾', label: 'Backup', description: 'Exportar/importar dados' },
    { path: '/parent', icon: '👨‍👩‍👧‍👦', label: 'Pais', description: 'Área dos responsáveis' },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="text-3xl font-bold">⭐ Mais</h1>
        <p className="text-muted">Descubra mais aventuras!</p>
      </div>
      
      <div className="more-grid">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className="card more-item"
            onClick={() => handleItemClick(item.path)}
          >
            <div className="more-item__icon">{item.icon}</div>
            <div className="more-item__content">
              <h3 className="more-item__title">{item.label}</h3>
              <p className="more-item__description">{item.description}</p>
            </div>
            <div className="more-item__arrow">→</div>
          </div>
        ))}
      </div>
      
      <div className="app-version">
        <p className="text-xs text-muted">
          Kids Mission v{APP_VERSION}
        </p>
        <p className="text-xs text-muted">
          Build: {new Date(APP_BUILD_DATE).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};

export default More;
