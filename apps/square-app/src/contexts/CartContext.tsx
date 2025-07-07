import { createContext, useContext, useReducer, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  selectedModifier?: {
    id: string
    name: string
    price: number
  }
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.id === action.payload.id && 
          (!item.selectedModifier || !action.payload.selectedModifier || 
            item.selectedModifier.id === action.payload.selectedModifier.id)
      )

      // Ensure price is a number
      const itemToAdd = {
        ...action.payload,
        price: typeof action.payload.price === 'string' ? parseFloat(action.payload.price) : action.payload.price,
        selectedModifier: action.payload.selectedModifier ? {
          ...action.payload.selectedModifier,
          price: typeof action.payload.selectedModifier.price === 'string' 
            ? parseFloat(action.payload.selectedModifier.price) 
            : action.payload.selectedModifier.price
        } : undefined
      }

      if (existingItemIndex > -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        }
        return { ...state, items: newItems }
      }

      return { ...state, items: [...state.items, itemToAdd] }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }

    case 'CLEAR_CART':
      return initialState

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  calculateTotal: () => { subtotal: number; tax: number; total: number }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const calculateTotal = () => {
    const subtotal = state.items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      const modifierTotal = item.selectedModifier ? item.selectedModifier.price * item.quantity : 0
      return sum + itemTotal + modifierTotal
    }, 0)

    const tax = +(subtotal * 0.1).toFixed(2) // 10% tax
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 