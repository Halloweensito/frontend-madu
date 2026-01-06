import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartState } from '@/types/types';

interface CartStore extends CartState {
  items: CartItem[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (i) => i.variantId === item.variantId
        );

        if (existingItemIndex >= 0) {
          // ✅ Si el item ya existe, actualizar la cantidad
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity,
          };
          set({ items: updatedItems });
        } else {
          // ✅ Si es un item nuevo, agregarlo
          set({ items: [...currentItems, item] });
        }
      },

      removeItem: (variantId: number) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });
      },

      updateQuantity: (variantId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      setItems: (items: CartItem[]) => {
        set({ items });
      },

      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'cart-storage', // ✅ Nombre de la clave en localStorage
      version: 1, // ✅ Versión del schema (útil para migraciones futuras)
      partialize: (state) => ({ items: state.items }), // 🚫 No persistir isCartOpen
    }
  )
);

