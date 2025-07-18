import type { CartItem } from '../cart'
import {Money, Tax, Discount} from '@/shared/types/base'

export interface OrderDetailsProps {
  order: {
    taxes?: Array<{
      uid: string;
      name: string;
      percentage: number;
      appliedMoney: { amount: number };
    }>;
    discounts?: Array<{
      uid: string;
      name: string;
      percentage: number;
      appliedMoney: { amount: number };
    }>;
    totalMoney: { amount: number };
    totalTaxMoney: { amount: number };
    totalDiscountMoney: { amount: number };
  };
  fullWidth?: boolean;
}

export interface OrderItemCardProps {
  item: {
    name: string;
    variationName: string;
    quantity: number;
    catalogObjectId: string;
    basePriceMoney: { amount: number };
    totalTaxMoney: { amount: number };
    totalDiscountMoney: { amount: number };
    totalMoney: { amount: number };
  };
  imageUrl?: string;
}

export interface Order {
  totalMoney: Money;
  totalTaxMoney: Money;
  totalDiscountMoney: Money;
  netAmounts: {
    totalMoney: Money;
    taxMoney: Money;
    discountMoney: Money;
  };
  taxes?: Tax[];
  discounts?: Discount[];
}

export interface OrderCalc {
  order: Order;
  loading: boolean;
  error?: string;
}

export interface OrderSummaryProps {
  orderCalc: OrderCalc;
}

export interface OrderResponse {
  data: any;
  error?: string;
}

export interface UseOrderCalculationProps {
  items: CartItem[];
  debounceMs?: number;
  orderTaxIds?: string[];
  orderDiscountIds?: string[];
} 