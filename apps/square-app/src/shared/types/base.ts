export interface Money {
  amount: number;
  currency: string;
}

export interface Tax {
  uid: string;
  name: string;
  percentage: number;
  appliedMoney: Money;
}

export interface Discount {
  uid: string;
  name: string;
  percentage: number;
  appliedMoney: Money;
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
    amountMoney?: Money;
    pinRequired: boolean;
    modifyTaxBasis: boolean;
  };
}

export interface ModifierData {
  id: string;
  name: string;
  priceMoney: Money;
  onByDefault: boolean;
  modifierListId: string;
  ordinal: number;
  hiddenOnline: boolean;
}

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
  categoryId?: string;
  categoryName?: string;
}

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
