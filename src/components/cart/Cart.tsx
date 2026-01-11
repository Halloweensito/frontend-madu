// components/cart/Cart.tsx
// Componente principal del carrito - Orquesta los subcomponentes

import { ShoppingCart, X, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useCartCheckout } from '@/hooks/useCartCheckout';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

import { CartItem } from './CartItem';
import { CartEmptyState } from './CartEmptyState';
import { CartFooter } from './CartFooter';
import { CartValidationErrors } from './CartValidationErrors';
import { CheckoutForm } from './CheckoutForm';

export function Cart() {
  // Store del carrito (datos)
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isCartOpen,
    openCart,
    closeCart
  } = useCartStore();

  // Hook de checkout (lógica)
  const {
    checkoutStep,
    validationErrors,
    isValidating,
    isCreatingOrder,
    handleCheckout,
    handleCreateOrder,
    handleGoToShop,
    handleBackToCart
  } = useCartCheckout();

  const itemCount = getTotalItems();
  const isCheckoutView = checkoutStep === 'form';

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="group relative p-2 hover:bg-black/5 rounded-full transition-colors"
          aria-label="Ver carrito"
        >
          <ShoppingCart
            className="text-stone-500 group-hover:text-black transition-colors"
            strokeWidth={1.5}
            size={22}
          />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white">

        {/* HEADER */}
        <SheetHeader className="px-6 py-4 border-b border-stone-100 flex flex-row items-center justify-between shrink-0">
          <SheetTitle className="flex items-center justify-between flex-1">
            {isCheckoutView ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToCart}
                  className="p-1 -ml-1 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} strokeWidth={1.5} />
                </button>
                <span className="font-light text-xl tracking-wide">Datos del Pedido</span>
              </div>
            ) : (
              <>
                <span className="font-light text-xl tracking-wide uppercase">Tu Carrito</span>
                <Badge variant="secondary" className="font-normal">
                  {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                </Badge>
              </>
            )}
          </SheetTitle>

          <SheetDescription className="sr-only">
            {isCheckoutView
              ? 'Completa tus datos para finalizar la compra por WhatsApp.'
              : 'Resumen de productos agregados al carrito para compra por WhatsApp.'
            }
          </SheetDescription>

          <SheetClose asChild>
            <button className="text-stone-400 hover:text-black transition-colors p-1 ml-4">
              <X size={24} strokeWidth={1.5} />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* BODY - Scrolleable */}
        <ScrollArea className="flex-1">
          {isCheckoutView ? (
            /* Vista de Checkout */
            <div className="px-6 py-4">
              <CheckoutForm
                onSubmit={handleCreateOrder}
                onCancel={handleBackToCart}
                isSubmitting={isCreatingOrder}
              />
            </div>
          ) : (
            /* Vista del Carrito */
            <>
              {items.length === 0 ? (
                <CartEmptyState onGoToShop={handleGoToShop} />
              ) : (
                <div className="px-6 divide-y divide-stone-100">
                  {items.map((item) => (
                    <CartItem
                      key={item.variantId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </ScrollArea>

        {/* ERRORES DE VALIDACIÓN (solo en vista carrito) */}
        {!isCheckoutView && <CartValidationErrors errors={validationErrors} />}

        {/* FOOTER (solo en vista carrito con items) */}
        {!isCheckoutView && items.length > 0 && (
          <CartFooter
            totalPrice={getTotalPrice()}
            isValidating={isValidating}
            onCheckout={handleCheckout}
            onClearCart={clearCart}
          />
        )}

      </SheetContent>
    </Sheet>
  );
}
