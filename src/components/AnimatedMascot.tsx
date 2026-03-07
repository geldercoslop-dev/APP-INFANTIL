import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getMascotImagePath } from '../utils/mascotUtils';
import { SHOP_CATALOG } from '../data/shopCatalog';
import { AudioSystem } from '../systems/audioSystem';
import type { ShopCategory } from '../types/shop';
import './AnimatedMascot.css';

interface AnimatedMascotProps {
  size?: 'small' | 'medium' | 'large';
  showReaction?: boolean;
  isCelebrating?: boolean;
  missionCompleted?: boolean;
  levelUp?: boolean;
}

const AnimatedMascot = ({ 
  size = 'medium', 
  showReaction = false, 
  isCelebrating = false,
  missionCompleted = false,
  levelUp = false
}: AnimatedMascotProps) => {
  const { user, inventory } = useGameStore();

  const sizeClasses = {
    small: 'mascot--small',
    medium: 'mascot--medium', 
    large: 'mascot--large'
  };

  // Play appropriate sound based on props
  useEffect(() => {
    const audioSystem = AudioSystem.getInstance();
    
    if (missionCompleted) {
      // Mascot reacts to mission completion
      audioSystem.playMissionComplete();
    }
    
    if (levelUp) {
      // Mascot celebrates level up
      audioSystem.playLevelUp();
    }
  }, [missionCompleted, levelUp]);

  if (!user.selectedMascotId) return null;

  // Get equipped items for visual display
  const getEquippedItem = (category: ShopCategory) => {
    const itemId = inventory.equippedByCategory[category];
    if (!itemId) return null;
    return SHOP_CATALOG.find(item => item.id === itemId);
  };

  const equippedHat = getEquippedItem('hat');
  const equippedOutfit = getEquippedItem('outfit');

  // Determine animation class based on props
  const getAnimationClass = () => {
    if (levelUp) return 'mascot--level-up';
    if (missionCompleted) return 'mascot--mission-complete';
    if (isCelebrating) return 'mascot--celebrating';
    if (showReaction) return 'mascot--show-reaction';
    return '';
  };

  return (
    <div 
      className={`animated-mascot ${sizeClasses[size]} ${getAnimationClass()}`}
    >
      <div className="mascot-container">
        {/* Hat Overlay */}
        {equippedHat && (
          <div className="mascot-overlay mascot-hat">
            <span className="overlay-emoji">{equippedHat.emoji}</span>
          </div>
        )}
        
        {/* Outfit Badge */}
        {equippedOutfit && (
          <div className="mascot-overlay mascot-outfit">
            <span className="overlay-emoji">{equippedOutfit.emoji}</span>
          </div>
        )}
        
        <img 
          src={getMascotImagePath(user.selectedMascotId)} 
          alt="Mascot"
          className="mascot-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/src/assets/mascots/main/${user.selectedMascotId}.png`;
          }}
        />
        
        {showReaction && (
          <div className="mascot-reaction">
            <span className="reaction-emoji">😊</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedMascot;
