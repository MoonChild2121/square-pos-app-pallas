import { ModifierData } from '@/shared/types/modifiers'

export interface ItemVariation {
  id: string;
  itemVariationData: {
    name: string;
    priceMoney: {
      amount: number;
      currency: string;
    };
    imageIds?: string[];
  };
}

export interface Modifier {
  id: string;
  type: string;
  modifierData: ModifierData;
}

export interface ModifierListInfo {
  modifierListId: string;
  minSelectedModifiers: number;
  maxSelectedModifiers: number;
  enabled: boolean;
}

export interface CatalogItem {
  id: string;
  type: string;
  itemData: {
    name: string;
    categoryId?: string;
    variations: ItemVariation[];
    imageIds?: string[];
    taxIds?: string[];
    modifierListInfo?: ModifierListInfo[];
  };
}

export interface TaxItem {
  id: string;
  type: string;
  taxData: {
    name: string;
    calculationPhase: string;
    inclusionType: string;
    percentage: string;
    appliesToCustomAmounts: boolean;
    enabled: boolean;
  };
}

export interface DiscountItem {
  id: string;
  type: string;
  discountData: {
    name: string;
    discountType: string;
    percentage?: string;
    amountMoney?: {
      amount: number;
      currency: string;
    };
    pinRequired: boolean;
    modifyTaxBasis: boolean;
  };
}

export interface CatalogResponse {
  items: CatalogItem[];
  taxes: TaxItem[];
  discounts: DiscountItem[];
  images: Record<string, string>;
  modifiers: Modifier[];
}
