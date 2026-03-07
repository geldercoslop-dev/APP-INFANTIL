import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SHOP_CATALOG } from '../data/shopCatalog';
import type { ShopCategory } from '../types/shop';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { requireOnline } from '../utils/offlineGuard';
import Confetti from '../components/Confetti';
import './Shop.css';

const Shop = () => {
  const { user, inventory, buyItem, equipItem, unequipCategory } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'all'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const isOnline = useOnlineStatus();

  const categories: (ShopCategory | 'all')[] = ['all', 'hat', 'outfit', 'pet', 'food', 'toy'];
  
  const categoryEmojis = {
    all: '🛍️',
    hat: '🎩',
    outfit: '👔',
    pet: '🐾',
    food: '🍎',
    toy: '🧸'
  };

  const filteredItems = selectedCategory === 'all' 
    ? SHOP_CATALOG 
    : SHOP_CATALOG.filter(item => item.category === selectedCategory);

  const handleBuyItem = async (itemId: string) => {
    if (!requireOnline(isOnline, 'comprar item')) return;
    
    const result = await buyItem(itemId);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEquipItem = async (itemId: string) => {
    if (!requireOnline(isOnline, 'equipar item')) return;
    
    const result = await equipItem(itemId);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const isOwned = (itemId: string) => inventory.ownedItemIds[itemId];
  const isEquipped = (itemId: string) => {
    const item = SHOP_CATALOG.find(i => i.id === itemId);
    return item && inventory.equippedByCategory[item.category] === itemId;
  };

  return (
    <div className={`shop shop--${user.genderTheme}`}>
      {showConfetti && <Confetti trigger={showConfetti} />}
      
      {/* Shapes decorativos divertidos */}
      <div className="shop-balloon-1"></div>
      <div className="shop-balloon-2"></div>
      <div className="shop-star-1"></div>
      <div className="shop-star-2"></div>
      <div className="shop-circle"></div>
      
      <div className="shop__header">
        <h1>🛍️ Loja do Mascote</h1>
        <div className="shop__coins">
          <span className="coins-icon">🪙</span>
          <span className="coins-amount">{user.coins}</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="shop__categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            <span className="category-emoji">{categoryEmojis[category]}</span>
            <span className="category-name">
              {category === 'all' ? 'Todos' : 
               category === 'hat' ? 'Chapéus' :
               category === 'outfit' ? 'Roupas' :
               category === 'pet' ? 'Pets' :
               category === 'food' ? 'Comidas' : 'Brinquedos'}
            </span>
          </button>
        ))}
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`shop__message shop__message--${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Equipped Items Section */}
      <div className="shop__equipped">
        <h2>� Itens Equipados</h2>
        <div className="equipped-items">
          {Object.entries(inventory.equippedByCategory).map(([category, itemId]) => {
            const item = SHOP_CATALOG.find(i => i.id === itemId);
            if (!item) return null;
            
            return (
              <div key={category} className="equipped-item">
                <span className="equipped-category">{categoryEmojis[category as ShopCategory]}</span>
                <div className="equipped-item-info">
                  <span className="equipped-emoji">{item.emoji}</span>
                  <span className="equipped-name">{item.name}</span>
                </div>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => unequipCategory(category as ShopCategory)}
                >
                  Remover
                </button>
              </div>
            );
          })}
          {Object.keys(inventory.equippedByCategory).length === 0 && (
            <div className="equipped-empty">Nenhum item equipado</div>
          )}
        </div>
      </div>

      {/* Items Grid Melhorado */}
      <div className="shop__items">
        <h2>🛒 Todos os Itens</h2>
        <div className="shop-items-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="shop-item card-hover">
              <div className="shop-item__emoji">{item.emoji}</div>
              <div className="shop-item__info">
                <div className="shop-item__name">{item.name}</div>
                <div className="shop-item__price">
                  <span className="price-icon">🪙</span>
                  <span className="price-amount">{item.price}</span>
                </div>
              </div>
              <div className="shop-item__actions">
                {isOwned(item.id) ? (
                  isEquipped(item.id) ? (
                    <button
                      className="btn btn-disabled btn-large"
                      disabled
                    >
                      Equipado
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-large"
                      onClick={() => handleEquipItem(item.id)}
                    >
                      Equipar
                    </button>
                  )
                ) : (
                  <button
                    className={`btn ${user.coins < item.price ? 'btn-disabled' : 'btn-primary'} btn-large`}
                    onClick={() => handleBuyItem(item.id)}
                    disabled={user.coins < item.price}
                  >
                    {user.coins < item.price ? 'Sem moedas' : 'Comprar'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="shop__empty">
            <div className="empty-emoji">🔍</div>
            <p>Nenhum item encontrado nesta categoria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
