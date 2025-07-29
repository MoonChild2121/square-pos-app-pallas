import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState } from '@/shared/types/cart'

type CartStore = CartState & {
  addItem: (item: CartItem) => void // Add item to cart
  removeItem: (id: string) => void // Remove item from cart
  updateQuantity: (id: string, quantity: number) => void // Update item quantity
  updateItemTaxes: (id: string, taxIds: string[]) => void // Update item taxes
  updateItemDiscounts: (id: string, discountIds: string[]) => void // Update item discounts
  updateOrderTaxes: (taxIds: string[]) => void // Update order taxes
  updateOrderDiscounts: (discountIds: string[]) => void // Update order discounts
  clearCart: () => void // Clear cart
  setOrder: (order: any) => void // Set order
  increaseQuantity: (id: string) => void // Increase item quantity
  decreaseQuantity: (id: string) => void
}

const initialState: CartState = {
  items: [],
  order: null,
  orderTaxIds: [],
  orderDiscountIds: [],
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      addItem: (item) => {
        const itemId = item.selectedModifier ? `${item.id}-${item.selectedModifier.id}` : item.id
        const existing = get().items.find(i => i.id === itemId)
        if (existing) {
          set({
            items: get().items.map(i =>
              i.id === itemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, id: itemId }] })
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter(i => i.id !== id) })
        } else {
          set({
            items: get().items.map(i =>
              i.id === id ? { ...i, quantity } : i
            ),
          })
        }
      },
      updateItemTaxes: (id, taxIds) =>
        set({
          items: get().items.map(i =>
            i.id === id ? { ...i, taxIds } : i
          ),
        }),
      updateItemDiscounts: (id, discountIds) =>
        set({
          items: get().items.map(i =>
            i.id === id ? { ...i, discountIds } : i
          ),
        }),
      updateOrderTaxes: (taxIds) => set({ orderTaxIds: taxIds }),
      updateOrderDiscounts: (discountIds) => set({ orderDiscountIds: discountIds }),
      clearCart: () => set(initialState),
      setOrder: (order) => set({ order }),
      increaseQuantity: (id) => {
        const item = get().items.find(i => i.id === id)
        if (item) get().updateQuantity(id, item.quantity + 1)
      },
      decreaseQuantity: (id) => {
        const item = get().items.find(i => i.id === id)
        if (item) get().updateQuantity(id, item.quantity - 1)
      },
    }),
    {
      name: 'square_app_cart', // localStorage key
      partialize: (state) => ({
        items: state.items,
        order: state.order,
        orderTaxIds: state.orderTaxIds,
        orderDiscountIds: state.orderDiscountIds,
      }),
    }
  )
)