// Import necessary React hooks and types
import { createContext, useContext, useReducer, ReactNode, useEffect, useMemo, useCallback } from 'react'

// Define the structure of a cart item
export interface CartItem {
  id: string        // Unique identifier for the item
  name: string      // Display name of the item
  price: number     // Price of the item
  quantity: number  // How many of this item are in the cart
  imageUrl?: string // Optional image URL
  taxIds?: string[] // Optional array of tax IDs applicable to this item
}

// Define the structure of our cart's state
interface CartState {
  items: CartItem[] // Array of items in the cart
  order?: any       // The calculated order from Square API
}

// Define all possible actions that can modify the cart
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }                              // Add a new item or increment existing
  | { type: 'REMOVE_ITEM'; payload: string }                            // Remove item by ID
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } } // Update item quantity
  | { type: 'CLEAR_CART' }                                              // Remove all items
  | { type: 'LOAD_CART'; payload: CartState }                          // Load saved cart state
  | { type: 'SET_ORDER'; payload: any }                                // Set the calculated order

// Key used for storing cart data in localStorage
const CART_STORAGE_KEY = 'square_app_cart'

// Initial empty cart state
const initialState: CartState = {
  items: [],
  order: undefined,
}

// Helper function to load cart data from localStorage
// Returns initial state if running on server or no stored cart exists
const loadStoredCart = (): CartState => {
  if (typeof window === 'undefined') return initialState
  const storedCart = localStorage.getItem(CART_STORAGE_KEY)
  return storedCart ? JSON.parse(storedCart) : initialState
}

// Cart reducer function - handles all cart state modifications
function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState

  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      )

      // Ensure price is always stored as a number
      const itemToAdd = {
        ...action.payload,
        price: typeof action.payload.price === 'string' ? parseFloat(action.payload.price) : action.payload.price
      }

      if (existingItemIndex > -1) {
        // If item exists, increment its quantity
        const newItems = [...state.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        }
        newState = { ...state, items: newItems }
      } else {
        // If item is new, add it to the cart
        newState = { ...state, items: [...state.items, itemToAdd] }
      }
      break
    }
    
    case 'REMOVE_ITEM':
      // Filter out the item with matching ID
      newState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
      break

    case 'UPDATE_QUANTITY':
      // Update quantity for specific item
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
      // Reset cart to initial empty state
      newState = initialState
      break

    case 'LOAD_CART':
      // Replace current cart with loaded state
      newState = action.payload
      break

    case 'SET_ORDER':
      // Set the calculated order
      newState = { ...state, order: action.payload }
      break

    default:
      return state
  }

  // Persist cart state to localStorage after each change
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState))
  }

  return newState
}

// Create separate contexts for different parts of the cart
const CartStateContext = createContext<CartState | undefined>(undefined)
const CartActionsContext = createContext<{
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setOrder: (order: any) => void
} | undefined>(undefined)

// Main Cart Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart reducer with empty state
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load saved cart data when component mounts
  useEffect(() => {
    const storedCart = loadStoredCart()
    dispatch({ type: 'LOAD_CART', payload: storedCart })
  }, [])

  // Memoized cart action handlers
  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)  // Remove item if quantity is 0 or negative
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }, [removeItem])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const setOrder = useCallback((order: any) => {
    dispatch({ type: 'SET_ORDER', payload: order })
  }, [])

  // Memoize actions object to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setOrder,
  }), [addItem, removeItem, updateQuantity, clearCart, setOrder])

  // Provide cart data through context hierarchy
  return (
    <CartStateContext.Provider value={state}>
      <CartActionsContext.Provider value={actions}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  )
}

// Custom hooks to access different parts of the cart
export function useCartState() {
  const context = useContext(CartStateContext)
  if (context === undefined) {
    throw new Error('useCartState must be used within a CartProvider')
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

// Legacy hook that combines all cart functionality
export function useCart() {
  const state = useCartState()
  const actions = useCartActions()
  
  return {
    state,
    ...actions
  }
} 