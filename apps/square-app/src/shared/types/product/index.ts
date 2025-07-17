import { ModifierData } from '@/shared/types/modifiers'

export interface Product {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  imageUrl?: string;
  taxIds?: string[];
  modifiers?: ModifierData[];
}

export interface ProductGridProps {
  products: Product[];
}

