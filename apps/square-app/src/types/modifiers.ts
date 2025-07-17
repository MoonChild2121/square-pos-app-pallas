export interface ModifierData {
  id: string;
  name: string;
  priceMoney: {
    amount: number;
    currency: string;
  };
  onByDefault: boolean;
  modifierListId: string;
  ordinal: number;
  hiddenOnline: boolean;
}

export interface SelectedModifier {
  id: string;
  name: string;
  price: number;
} 