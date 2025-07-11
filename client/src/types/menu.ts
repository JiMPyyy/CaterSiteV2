export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'main' | 'dessert' | 'beverage';
  dietaryInfo: string[];
  image: string;
  isCustomizable?: boolean;
  pricing?: { small: number; large: number };
  flavors?: string[];
  hasMultipleSizes?: boolean;
  sizes?: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
    platters?: {
      itemCount: number;
      discount: number;
      description: string;
      piecesPerOption?: number;
      totalPieces?: number;
      type?: 'mixed' | 'nigiri' | 'sashimi';
    };
  }>;
  platters?: {
    itemCount: number;
    discount: number;
    description: string;
    piecesPerOption?: number;
    totalPieces?: number;
    type?: 'mixed' | 'nigiri' | 'sashimi';
  };
};

export type SushiItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'main';
  dietaryInfo: string[];
  image: string;
};

export type IndividualSandwich = {
  id: string;
  name: string;
  isWagyu: boolean;
  image: string;
};

export type RestaurantMenu = {
  name: string;
  items: MenuItem[];
};

export type RestaurantMenus = {
  [key: string]: RestaurantMenu;
};
