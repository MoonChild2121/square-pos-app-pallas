// Define a cart item structure
export interface CartItem {
  id: string // This will now be a composite of product ID and modifier ID
  name: string
  price: number // already divided from cents
  quantity: number
  imageUrl?: string
  taxIds?: string[]
  discountIds?: string[]
  selectedModifier?: {
    id: string;
    name: string;
    price: number;
  }
}

// Define what the entire cart state looks like
export interface CartState {
  items: CartItem[]
  order: any | null // will be filled after tax/discount calculations
  orderTaxIds: string[]
  orderDiscountIds: string[]
}

// All possible actions you can perform on the cart
export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_ITEM_TAXES'; payload: { id: string; taxIds: string[] } }
  | { type: 'UPDATE_ITEM_DISCOUNTS'; payload: { id: string; discountIds: string[] } }
  | { type: 'UPDATE_ORDER_TAXES'; payload: string[] }
  | { type: 'UPDATE_ORDER_DISCOUNTS'; payload: string[] }
  | { type: 'SET_ORDER'; payload: any }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState } 

export interface CartToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface CartContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CartViewProps extends CartContainerProps {
  items: any[];
  isEmpty: boolean;
  orderCalc: any;
  selectedTaxIds: string[];
  selectedDiscountIds: string[];
  onCheckout: () => void;
  onUpdateTaxes: (ids: string[]) => void;
  onUpdateDiscounts: (ids: string[]) => void;
}

export interface CartContainerProps {
  isOpen: boolean
  onClose: () => void
}
