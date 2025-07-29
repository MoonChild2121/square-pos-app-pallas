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
  isRedirecting?: boolean;
}
