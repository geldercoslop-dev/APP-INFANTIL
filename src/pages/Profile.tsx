import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { getMascotImagePath } from '../utils/mascotUtils';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { requireOnline } from '../utils/offlineGuard';
import LevelProgress from '../components/LevelProgress';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useGameStore();
  const isOnline = useOnlineStatus();

  const handleChangeMascot = () => {
    if (!requireOnline(isOnline, 'trocar mascote')) return;
    
    setUser({ selectedMascotId: '' });
    navigate('/setup/mascot');
  };

  return (
    <div className="page">
      <h1>👤 Perfil</h1>
      
      <div className="profile-section">
        <h2>Mascote Atual</h2>
        {user.selectedMascotId && (
          <div className="current-mascot">
            <img 
              src={getMascotImagePath(user.selectedMascotId)} 
              alt="Mascot"
              className="current-mascot__image"
            />
            <button 
              className="change-mascot-btn"
              onClick={handleChangeMascot}
            >
              🔄 Trocar Mascote
            </button>
          </div>
        )}
      </div>
      
      <div className="profile-section">
        <h2>Estatísticas</h2>
        <LevelProgress compact={true} showCoins={false} showStreak={false} />
      </div>
      
      <div className="profile-section">
        <h2>Estatísticas Detalhadas</h2>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Moedas</span>
            <span className="stat-value">{user.coins}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Sequência</span>
            <span className="stat-value">{user.streak} dias 🔥</span>
          </div>
          <div className="stat">
            <span className="stat-label">XP Total</span>
            <span className="stat-value">{user.xp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
