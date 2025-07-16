'use client'

// React + context hooks
import { createContext, useContext, useReducer, ReactNode, useEffect, useMemo, useCallback } from 'react'

// Define a cart item structure
export interface CartItem {
  id: string
  name: string
  price: number // already divided from cents
  quantity: number
  imageUrl?: string
  taxIds?: string[]
  discountIds?: string[]
}

// Define what the entire cart state looks like
interface CartState {
  items: CartItem[]
  order: any | null // will be filled after tax/discount calculations
  orderTaxIds: string[]
  orderDiscountIds: string[]
}

// All possible actions you can perform on the cart
type CartAction =
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

// LocalStorage key used for persistence
const CART_STORAGE_KEY = 'square_app_cart'

// Default initial state
const initialState: CartState = {
  items: [],
  order: null,
  orderTaxIds: [],
  orderDiscountIds: []
}

// Reducer: defines how state updates based on action type
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        // If item exists, increase quantity
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      } else {
        // Add new item with quantity 1
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        }
      }
      break
    }

    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      }
      break

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        // Remove item if quantity drops to 0
        newState = {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        }
      } else {
        // Update item quantity
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        }
      }
      break
    }

    case 'UPDATE_ITEM_TAXES':
      // add taxIds to the item
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, taxIds: action.payload.taxIds }
            : item
        ),
      }
      break

    case 'UPDATE_ITEM_DISCOUNTS':
      // add discountIds to the item
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, discountIds: action.payload.discountIds }
            : item
        ),
      }
      break

    case 'UPDATE_ORDER_TAXES':
      // add taxIds to the order
      newState = {
        ...state,
        orderTaxIds: action.payload,
      }
      break

    case 'UPDATE_ORDER_DISCOUNTS':
      // add discountIds to the order
      newState = {
        ...state,
        orderDiscountIds: action.payload,
      }
      break

    case 'SET_ORDER':
      // set the order
      newState = {
        ...state,
        order: action.payload,
      }
      break

    case 'LOAD_CART':
      // load the cart from localStorage
      newState = action.payload
      break

    case 'CLEAR_CART':
      // clear the cart
      newState = initialState
      break

    default:
      return state
  }

  // Sync updated state to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState))
  }

  return newState
}

// Contexts to provide cart state and actions separately
const CartStateContext = createContext<CartState | undefined>(undefined)

const CartActionsContext = createContext<{
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateItemTaxes: (id: string, taxIds: string[]) => void
  updateItemDiscounts: (id: string, discountIds: string[]) => void
  updateOrderTaxes: (taxIds: string[]) => void
  updateOrderDiscounts: (discountIds: string[]) => void
  clearCart: () => void
  setOrder: (order: any) => void
} | undefined>(undefined)

// Load cart from localStorage on first render (client-only)
function loadStoredCart(): CartState {
  if (typeof window === 'undefined') return initialState
  const storedCart = localStorage.getItem(CART_STORAGE_KEY)
  return storedCart ? JSON.parse(storedCart) : initialState
}

// React context provider to wrap the app
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage when the app mounts
  useEffect(() => {
    const storedCart = loadStoredCart()
    dispatch({ type: 'LOAD_CART', payload: storedCart })
  }, [])

  // All dispatch wrappers are memoized for stable identity
  const addItem = useCallback((item: CartItem) => 
    dispatch({ type: 'ADD_ITEM', payload: item }), [])

  const removeItem = useCallback((id: string) => 
    dispatch({ type: 'REMOVE_ITEM', payload: id }), [])

  const updateQuantity = useCallback((id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }), [])

  const updateItemTaxes = useCallback((id: string, taxIds: string[]) =>
    dispatch({ type: 'UPDATE_ITEM_TAXES', payload: { id, taxIds } }), [])

  const updateItemDiscounts = useCallback((id: string, discountIds: string[]) =>
    dispatch({ type: 'UPDATE_ITEM_DISCOUNTS', payload: { id, discountIds } }), [])

  const updateOrderTaxes = useCallback((taxIds: string[]) =>
    dispatch({ type: 'UPDATE_ORDER_TAXES', payload: taxIds }), [])

  const updateOrderDiscounts = useCallback((discountIds: string[]) =>
    dispatch({ type: 'UPDATE_ORDER_DISCOUNTS', payload: discountIds }), [])

  const clearCart = useCallback(() => 
    dispatch({ type: 'CLEAR_CART' }), [])

  const setOrder = useCallback((order: any) => 
    dispatch({ type: 'SET_ORDER', payload: order }), [])

  // Bundle actions in one memoized object
  const actions = useMemo(() => ({
    addItem,
    removeItem,
    updateQuantity,
    updateItemTaxes,
    updateItemDiscounts,
    updateOrderTaxes,
    updateOrderDiscounts,
    clearCart,
    setOrder,
  }), [ 
    addItem,
    removeItem, 
    updateQuantity,
    updateItemTaxes,
    updateItemDiscounts,
    updateOrderTaxes,
    updateOrderDiscounts,
    clearCart,
    setOrder,
  ])

  return (
    <CartStateContext.Provider value={state}>
      <CartActionsContext.Provider value={actions}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  )
}

// Hook to access cart state (readonly)
export function useCartState() {
  const state = useContext(CartStateContext)
  if (state === undefined) {
    throw new Error('useCartState must be used within a CartProvider')
  }
  return state
}

// Hook to access cart actions (mutations)
export function useCartActions() {
  const actions = useContext(CartActionsContext)
  if (actions === undefined) {
    throw new Error('useCartActions must be used within a CartProvider')
  }
  return actions
}

// Optional helper to access everything in one object
export function useCart() {
  const state = useCartState()
  const actions = useCartActions()
  return { state, ...actions }
}
