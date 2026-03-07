import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { getFilteredMascots } from '../utils/mascotUtils';
import './MascotSetup.css';

const MascotSetup = () => {
  const navigate = useNavigate();
  const { user, setUser } = useGameStore();
  const mascots = getFilteredMascots(user.genderTheme);

  const handleMascotSelect = (mascotId: string) => {
    setUser({ selectedMascotId: mascotId });
    navigate('/home');
  };

  return (
    <div className={`mascot-setup mascot-setup--${user.genderTheme}`}>
      <div className="mascot-setup__container">
        <div className="mascot-setup__header">
          <h1>🎉 Escolha seu Mascote!</h1>
          <p>Seu mascote vai te acompanhar em todas as aventuras!</p>
        </div>
        
        <div className="mascot-setup__grid">
          {mascots.map((mascot) => (
            <div
              key={mascot.id}
              className="mascot-card"
              onClick={() => handleMascotSelect(mascot.id)}
            >
              <div className="mascot-card__image">
                <img 
                  src={mascot.imagePath} 
                  alt={mascot.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/src/assets/mascots/main/${mascot.id}.png`;
                  }}
                />
              </div>
              <div className="mascot-card__name">
                {mascot.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MascotSetup;
