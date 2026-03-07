export interface ShopItem {
  id: string;
  name: string;
  category: 'food' | 'clothes' | 'glasses' | 'hats' | 'bows' | 'costumes' | 'toys' | 'decor';
  cost: number;
  icon: string; // emoji or image path
  rarity: 'common' | 'rare' | 'epic';
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  equipped: boolean;
}
