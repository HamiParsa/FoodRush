import { create } from 'zustand'
import { CartItem, Product } from '../types/index'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product) => {
    const existing = get().items.find(i => i.product.id === product.id)
    if (existing) {
      set({ items: get().items.map(i =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )})
    } else {
      set({ items: [...get().items, { product, quantity: 1 }] })
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter(i => i.product.id !== productId) })
  },

  increaseQuantity: (productId) => {
    set({ items: get().items.map(i =>
      i.product.id === productId
        ? { ...i, quantity: i.quantity + 1 }
        : i
    )})
  },

  decreaseQuantity: (productId) => {
    const item = get().items.find(i => i.product.id === productId)
    if (item && item.quantity === 1) {
      get().removeItem(productId)
    } else {
      set({ items: get().items.map(i =>
        i.product.id === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )})
    }
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    return get().items.reduce((total, i) => total + i.product.price * i.quantity, 0)
  },

  getTotalItems: () => {
    return get().items.reduce((total, i) => total + i.quantity, 0)
  },
}))