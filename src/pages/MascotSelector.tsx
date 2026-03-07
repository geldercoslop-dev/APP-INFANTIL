import { useNavigate } from 'react-router-dom';
import { loadMascots } from '../utils/mascotUtils';
import './MascotSelector.css';

const MascotSelector = () => {
  const navigate = useNavigate();
  const mascots = loadMascots();

  const handleMascotSelect = (mascotId: string) => {
    localStorage.setItem('selectedMascot', mascotId);
    navigate('/home');
  };

  return (
    <div className="mascot-selector">
      <div className="mascot-selector__header">
        <h1>Choose Your Mascot</h1>
        <p>Select a mascot to be your companion!</p>
      </div>
      
      <div className="mascot-selector__grid">
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
  );
};

export default MascotSelector;
