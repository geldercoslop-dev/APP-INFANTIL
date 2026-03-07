export type ShopCategory = 'hat' | 'outfit' | 'pet' | 'food' | 'toy';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  category: ShopCategory;
  price: number;
  rarity: ItemRarity;
}

export interface InventoryState {
  ownedItemIds: Record<string, boolean>;
  equippedByCategory: Partial<Record<ShopCategory, string>>; // category -> itemId
}

export const RARITY_CONFIG = {
  common: {
    color: '#9ca3af',
    bgColor: '#f3f4f6',
    label: 'Comum',
    multiplier: 1
  },
  rare: {
    color: '#3b82f6',
    bgColor: '#eff6ff',
    label: 'Raro',
    multiplier: 1.5
  },
  epic: {
    color: '#8b5cf6',
    bgColor: '#f3e8ff',
    label: 'Épico',
    multiplier: 2
  },
  legendary: {
    color: '#f59e0b',
    bgColor: '#fef3c7',
    label: 'Lendário',
    multiplier: 3
  }
} as const;

export const getRarityColor = (rarity: ItemRarity): string => {
  return RARITY_CONFIG[rarity].color;
};

export const getRarityBgColor = (rarity: ItemRarity): string => {
  return RARITY_CONFIG[rarity].bgColor;
};

export const getRarityLabel = (rarity: ItemRarity): string => {
  return RARITY_CONFIG[rarity].label;
};

export const getRarityMultiplier = (rarity: ItemRarity): number => {
  return RARITY_CONFIG[rarity].multiplier;
};
