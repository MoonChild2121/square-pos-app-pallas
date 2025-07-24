import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState } from '@/shared/types/cart'

type CartStore = CartState & {
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateItemTaxes: (id: string, taxIds: string[]) => void
  updateItemDiscounts: (id: string, discountIds: string[]) => void
  updateOrderTaxes: (taxIds: string[]) => void
  updateOrderDiscounts: (discountIds: string[]) => void
  clearCart: () => void
  setOrder: (order: any) => void
  increaseQuantity: (id: string) => void
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