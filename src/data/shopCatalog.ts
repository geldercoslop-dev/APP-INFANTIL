import type { ShopItem } from '../types/shop';

export const SHOP_CATALOG: ShopItem[] = [
  // Hats - Preços balanceados para progressão
  { id: 'hat-magic', name: 'Chapéu Mágico', emoji: '🎩', category: 'hat', price: 15, rarity: 'common' },
  { id: 'hat-radical', name: 'Boné Radical', emoji: '🧢', category: 'hat', price: 12, rarity: 'common' },
  { id: 'hat-crown', name: 'Coroa de Princesa', emoji: '👑', category: 'hat', price: 35, rarity: 'rare' },
  { id: 'hat-captain', name: 'Chapéu de Capitão', emoji: '🧑', category: 'hat', price: 20, rarity: 'common' },
  { id: 'hat-wizard', name: 'Chapéu de Mago', emoji: '🎓', category: 'hat', price: 28, rarity: 'rare' },
  
  // Outfits - Preços médios para progressão
  { id: 'outfit-hero', name: 'Roupa de Herói', emoji: '🦸', category: 'outfit', price: 45, rarity: 'rare' },
  { id: 'outfit-wizard', name: 'Roupa de Mago', emoji: '🧙', category: 'outfit', price: 40, rarity: 'rare' },
  { id: 'outfit-princess', name: 'Vestido de Princesa', emoji: '👗', category: 'outfit', price: 42, rarity: 'rare' },
  { id: 'outfit-super', name: 'Roupa de Super-Herói', emoji: '🦸‍♂️', category: 'outfit', price: 55, rarity: 'epic' },
  { id: 'outfit-fairy', name: 'Roupa de Fada', emoji: '🧚', category: 'outfit', price: 38, rarity: 'rare' },
  
  // Pets - Preços mais altos para objetivo de longo prazo
  { id: 'pet-dog', name: 'Cachorrinho Amigo', emoji: '🐶', category: 'pet', price: 60, rarity: 'common' },
  { id: 'pet-cat', name: 'Gatinho Fofinho', emoji: '🐱', category: 'pet', price: 60, rarity: 'common' },
  { id: 'pet-bunny', name: 'Coelhinho Fofo', emoji: '🐰', category: 'pet', price: 75, rarity: 'rare' },
  { id: 'pet-bird', name: 'Pássaro Colorido', emoji: '🦜', category: 'pet', price: 70, rarity: 'rare' },
  { id: 'pet-dragon', name: 'Dragãozinho', emoji: '🐉', category: 'pet', price: 90, rarity: 'epic' },
  { id: 'pet-unicorn', name: 'Unicórnio Mágico', emoji: '🦄', category: 'pet', price: 120, rarity: 'legendary' },
  
  // Food - Itens baratos para consumo rápido
  { id: 'food-apple', name: 'Maçã Docinha', emoji: '🍎', category: 'food', price: 5, rarity: 'common' },
  { id: 'food-cookie', name: 'Biscoito Sortudo', emoji: '🍪', category: 'food', price: 6, rarity: 'common' },
  { id: 'food-candy', name: 'Doce Mágico', emoji: '🍬', category: 'food', price: 4, rarity: 'common' },
  { id: 'food-icecream', name: 'Sorvete Especial', emoji: '🍦', category: 'food', price: 8, rarity: 'common' },
  { id: 'food-cake', name: 'Bolo de Aniversário', emoji: '🎂', category: 'food', price: 15, rarity: 'rare' },
  { id: 'food-potion', name: 'Poção Mágica', emoji: '🧪', category: 'food', price: 25, rarity: 'epic' },
  
  // Toys - Faixa de preços diversificada
  { id: 'toy-bear', name: 'Ursinho de Pelúcia', emoji: '🧸', category: 'toy', price: 18, rarity: 'common' },
  { id: 'toy-ball', name: 'Bola Colorida', emoji: '⚽', category: 'toy', price: 12, rarity: 'common' },
  { id: 'toy-gamepad', name: 'Mini Gamepad', emoji: '🎮', category: 'toy', price: 30, rarity: 'rare' },
  { id: 'toy-car', name: 'Carrinho de Corrida', emoji: '🏎️', category: 'toy', price: 25, rarity: 'common' },
  { id: 'toy-rocket', name: 'Foguete Espacial', emoji: '🚀', category: 'toy', price: 40, rarity: 'rare' },
  { id: 'toy-robot', name: 'Robô Amigo', emoji: '🤖', category: 'toy', price: 50, rarity: 'epic' },
  { id: 'toy-diamond', name: 'Diamante Brilhante', emoji: '💎', category: 'toy', price: 80, rarity: 'legendary' },
];
