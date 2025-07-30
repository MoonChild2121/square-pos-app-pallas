export interface ModifierModalProps {
  itemId: string;
  selectedTaxIds?: string[];
  selectedDiscountIds?: string[];
}

export interface OrderModifierModalProps {
  selectedTaxIds: string[];
  selectedDiscountIds: string[];
  onUpdateTaxes: (taxIds: string[]) => void;
  onUpdateDiscounts: (discountIds: string[]) => void;
} 