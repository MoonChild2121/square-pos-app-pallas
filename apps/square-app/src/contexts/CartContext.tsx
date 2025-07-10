import { createContext, useContext, useReducer, ReactNode, useEffect, useMemo, useCallback } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  taxIds?: string[]
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

const CART_STORAGE_KEY = 'square_app_cart'

const initialState: CartState = {
  items: [],
}

// Load cart from localStorage
const loadStoredCart = (): CartState => {
  if (typeof window === 'undefined') return initialState
  const storedCart = localStorage.getItem(CART_STORAGE_KEY)
  return storedCart ? JSON.parse(storedCart) : initialState
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      )

      // Ensure price is a number
      const itemToAdd = {
        ...action.payload,
        price: typeof action.payload.price === 'string' ? parseFloat(action.payload.price) : action.payload.price
      }
      // If the item already exists, update the quantity
      if (existingItemIndex > -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        }
        newState = { ...state, items: newItems }
      } else {
        // If the item does not exist, add it to the cart
        newState = { ...state, items: [...state.items, itemToAdd] }
      }
      break
    }
    
    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
      break

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
      break

    case 'CLEAR_CART':
      newState = initialState
      break

    case 'LOAD_CART':
      newState = action.payload
      break

    default:
      return state
  }

  // Save to localStorage after each change
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState))
  }

  return newState
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

// Split contexts for different parts of the cart
const CartItemsContext = createContext<CartItem[] | undefined>(undefined)
const CartActionsContext = createContext<{
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
} | undefined>(undefined)
const CartTotalsContext = createContext<{
  subtotal: number
  tax: number
  total: number
} | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = loadStoredCart()
    dispatch({ type: 'LOAD_CART', payload: storedCart })
  }, [])

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }, [removeItem])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      return sum + itemTotal
    }, 0)

    const tax = +(subtotal * 0.1).toFixed(2) // 10% tax
    const total = subtotal + tax

    return { subtotal, tax, total }
  }, [state.items])

  const actions = useMemo(() => ({
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }), [addItem, removeItem, updateQuantity, clearCart])

  return (
    <CartItemsContext.Provider value={state.items}>
      <CartActionsContext.Provider value={actions}>
        <CartTotalsContext.Provider value={totals}>
          {children}
        </CartTotalsContext.Provider>
      </CartActionsContext.Provider>
    </CartItemsContext.Provider>
  )
}

// Split hooks for different parts of the cart
export function useCartItems() {
  const context = useContext(CartItemsContext)
  if (context === undefined) {
    throw new Error('useCartItems must be used within a CartProvider')
  }
  return context
}

export function useCartActions() {
  const context = useContext(CartActionsContext)
  if (context === undefined) {
    throw new Error('useCartActions must be used within a CartProvider')
  }
  return context
}

export function useCartTotals() {
  const context = useContext(CartTotalsContext)
  if (context === undefined) {
    throw new Error('useCartTotals must be used within a CartProvider')
  }
  return context
}

// Legacy hook for backward compatibility
export function useCart() {
  const items = useCartItems()
  const actions = useCartActions()
  const totals = useCartTotals()
  
  return {
    state: { items },
    ...actions,
    calculateTotal: () => totals
  }
} 