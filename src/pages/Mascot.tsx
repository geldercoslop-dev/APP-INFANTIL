import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getFilteredMascots, getMascotImagePath } from '../utils/mascotUtils';
import { SHOP_CATALOG } from '../data/shopCatalog';
import type { ShopCategory } from '../types/shop';
import BackButton from '../components/BackButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { requireOnline } from '../utils/offlineGuard';
import './Page.css';

const PET_MESSAGES = [
  "Estou feliz em te ver! 🐾",
  "Vamos completar mais missões hoje! ⭐",
  "Você é o melhor amigo que um pet poderia ter! ❤️",
  "Que aventura emocionante vamos ter! 🎮",
  "Estou pronto para ajudar no que precisar! 💪",
  "Você está fazendo um ótimo progresso! 🌟",
  "Vamos explorar mundos juntos! 🗺️",
  "Seu dedicação me inspira! ✨",
  "Cada dia ao seu lado é especial! 🌈",
  "Estou orgulhoso de ser seu pet! 🏆"
];

const Mascot = () => {
  const navigate = useNavigate();
  const { user, setUser, inventory, unequipCategory } = useGameStore();
  const mascots = getFilteredMascots(user.genderTheme);
  const isOnline = useOnlineStatus();
  const [petMessage, setPetMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const getEquippedItem = (category: ShopCategory) => {
    const itemId = inventory.equippedByCategory[category];
    if (!itemId) return null;
    return SHOP_CATALOG.find(item => item.id === itemId);
  };

  // Get equipped pet for special display
  const equippedPet = getEquippedItem('pet');

  // Generate random pet message on mount and when pet changes
  useEffect(() => {
    if (equippedPet) {
      const randomMessage = PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)];
      setTimeout(() => {
        setPetMessage(randomMessage);
        setShowMessage(true);
      }, 0);
      
      // Hide message after 5 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [equippedPet?.id]);

  const handleMascotSelect = (mascotId: string) => {
    if (!requireOnline(isOnline, 'selecionar mascote')) return;
    
    setUser({ selectedMascotId: mascotId });
    navigate('/home');
  };

  const handleUnequip = (category: ShopCategory) => {
    unequipCategory(category);
  };

  const categories: ShopCategory[] = ['hat', 'outfit', 'pet', 'food', 'toy'];
  
  const categoryNames = {
    hat: 'Chapéu',
    outfit: 'Roupa',
    pet: 'Pet',
    food: 'Comida',
    toy: 'Brinquedo'
  };

  return (
    <div className="page">
      {/* Shapes decorativos mágicos */}
      <div className="magic-sparkle-1"></div>
      <div className="magic-sparkle-2"></div>
      <div className="magic-sparkle-3"></div>
      <div className="magic-wand"></div>
      <div className="magic-circle"></div>
      
      <div className="page__header">
        <BackButton to="/home" />
        <h1>🎭 Trocar Mascote</h1>
        <p>Escolha um novo mascote para suas aventuras!</p>
      </div>
      
      {/* Pet Friend Section */}
      {equippedPet && (
        <div className="pet-friend-section">
          <div className="pet-friend-card">
            <div className="pet-friend-header">
              <span className="pet-emoji">{equippedPet.emoji}</span>
              <div className="pet-friend-info">
                <h3>Seu Amiguinho</h3>
                <p>{equippedPet.name}</p>
              </div>
            </div>
            <div className="pet-friend-description">
              <p>Este é seu companheiro fiel em todas as aventuras! Ele está sempre pronto para te ajudar nas missões diárias.</p>
            </div>
            {/* Pet Message */}
            {showMessage && petMessage && (
              <div className="pet-message">
                <span className="pet-message-bubble">{petMessage}</span>
                <span className="pet-message-tail"></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Equipment Section */}
      <div className="equipment-section">
        <h2>🎒 Equipamentos do Mascote</h2>
        <div className="equipment-grid">
          {categories.map(category => {
            const equippedItem = getEquippedItem(category);
            return (
              <div key={category} className="equipment-item">
                <div className="equipment-category">
                  <span className="category-icon">
                    {category === 'hat' ? '🎩' :
                     category === 'outfit' ? '👔' :
                     category === 'pet' ? '🐾' :
                     category === 'food' ? '🍎' : '🧸'}
                  </span>
                  <span className="category-name">{categoryNames[category]}</span>
                </div>
                <div className="equipment-status">
                  {equippedItem ? (
                    <div className="equipped-item">
                      <span className="item-emoji">{equippedItem.emoji}</span>
                      <span className="item-name">{equippedItem.name}</span>
                      <button 
                        className="btn-remove"
                        onClick={() => handleUnequip(category)}
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="no-item">
                      <span className="no-item-text">Nenhum item equipado</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mascot-grid">
        {mascots.map((mascot) => (
          <div
            key={mascot.id}
            className={`mascot-card ${user.selectedMascotId === mascot.id ? 'mascot-card--selected' : ''}`}
            onClick={() => handleMascotSelect(mascot.id)}
          >
            <div className="mascot-card__image">
              <img 
                src={getMascotImagePath(mascot.id)} 
                alt={mascot.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/src/assets/mascots/main/${mascot.id}.png`;
                }}
              />
              {user.selectedMascotId === mascot.id && (
                <div className="mascot-card__selected">✓</div>
              )}
            </div>
            <div className="mascot-card__name">{mascot.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mascot;
