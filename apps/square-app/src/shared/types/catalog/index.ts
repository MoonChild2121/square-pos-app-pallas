import { ItemVariation, ModifierData, TaxItem, DiscountItem } from '@/shared/types/base'

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
  id: string
  type: string
  itemData?: {
    name: string
    categoryId?: string
    variations: ItemVariation[]
    imageIds?: string[]
    taxIds?: string[]
    modifierListInfo?: ModifierListInfo[]
  }
  itemVariationData?: {
    name: string
    priceMoney: {
      amount: number
      currency: string
    }
    imageIds?: string[]
    itemId: string
  }
  imageData?: {
    url: string
    name?: string
  }
  modifierData?: ModifierData
  taxData?: any
  discountData?: any
}

export interface CatalogResponse {
  items: CatalogItem[];
  taxes: TaxItem[];
  discounts: DiscountItem[];
  images: Record<string, string>;
  modifiers: Modifier[];
}

export interface SearchCatalogResponse {
  objects: CatalogItem[];
  relatedObjects: CatalogItem[];
  latestTime: string;
}
