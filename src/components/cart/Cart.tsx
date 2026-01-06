import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, MessageCircle, ShoppingBag
} from 'lucide-react';

import { useCartStore } from '@/stores/cartStore';
import { openWhatsApp } from '@/utils/whatsapp';
import { WHATSAPP_CONFIG } from '@/config/whatsapp';
import type { CartItem as CartItemType } from '@/types/types';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose
} from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X, AlertCircle } from 'lucide-react';
import { useState } from 'react';

// ==========================================
// 1. SUB-COMPONENTE: CART ITEM
// ==========================================
interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex gap-4 py-4">
      {/* IMAGEN: Corregido flex-shrink-0 -> shrink-0 */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-stone-300">
            <ShoppingBag size={24} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="grid gap-1">
          {/* TÍTULO Y PRECIO */}
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-stone-900 line-clamp-2 pr-4">
              {item.productName}
            </h3>
            <p className="text-sm font-semibold text-stone-900 whitespace-nowrap">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          {/* VARIANTES / ATRIBUTOS */}
          {item.attributes && item.attributes.length > 0 && (
            <div className="flex flex-wrap gap-1 text-xs text-stone-500">
              {item.attributes.map((attr, idx) => (
                <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  {attr.value}
                </span>
              ))}
            </div>
          )}

          <div className="text-xs text-stone-400">
            Unitario: ${item.price.toFixed(2)}
          </div>
        </div>

        {/* CONTROLES (Cantidad y Eliminar) */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-stone-200 rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
              className="p-1 hover:bg-stone-100 disabled:opacity-50 transition-colors"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-medium tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
              className="p-1 hover:bg-stone-100 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.variantId)}
            className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPONENTE PRINCIPAL: CART
// ==========================================

import { toast } from 'sonner';
import { useCartValidation } from '@/hooks/useCartValidation';
import { Loader2 } from 'lucide-react';

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems, setItems, isCartOpen, openCart, closeCart } = useCartStore();
  const navigate = useNavigate();
  const { validateCart, isValidating } = useCartValidation();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setValidationErrors([]); // Limpiar errores previos

    try {
      const result = await validateCart(items);

      if (!result.isValid) {
        // Actualizar el carrito con la info (stock/precios) real
        setItems(result.updatedItems);

        // Mostrar feedback al usuario
        if (result.hasStockIssues) {
          toast.error("Atención: Algunos productos no tienen stock suficiente.", {
            description: "Tu carrito ha sido actualizado con el stock disponible.",
            duration: 5000,
          });
        }

        if (result.hasPriceChanges) {
          toast.warning("Atención: Algunos precios han cambiado.", {
            description: "Revisa los nuevos totales antes de continuar.",
            duration: 5000,
          });
        }

        if (result.messages.length > 0) {
          setValidationErrors(result.messages);
        }

        return; // Detener checkout para que el usuario revise
      }

      // Si todo es válido, proceder a WhatsApp
      openWhatsApp(
        WHATSAPP_CONFIG.phoneNumber,
        items,
        WHATSAPP_CONFIG.customMessage || undefined
      );
      closeCart();

    } catch (error) {
      toast.error("Error al validar el carrito. Inténtalo de nuevo.");
      setValidationErrors(["Error de conexión o validación. Intenta nuevamente."]);
    }
  };

  const handleGoToShop = () => {
    closeCart();
    navigate('/productos');
  };

  const itemCount = getTotalItems();

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
        <SheetHeader className="px-6 py-4 border-b border-stone-100 flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center justify-between flex-1">
            <span className="font-light text-xl tracking-wide uppercase">Tu Carrito</span>
            <Badge variant="secondary" className="font-normal">
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
            </Badge>
          </SheetTitle>

          <SheetDescription className="sr-only">
            Resumen de productos agregados al carrito para compra por WhatsApp.
          </SheetDescription>

          <SheetClose asChild>
            <button className="text-stone-400 hover:text-black transition-colors p-1 ml-4">
              <X size={24} strokeWidth={1.5} />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* BODY */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {items.length === 0 ? (
            /* EMPTY STATE MEJORADO */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="bg-stone-50 p-6 rounded-full">
                <ShoppingBag className="h-12 w-12 text-stone-300" strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-stone-900">El carrito está vacío</h3>
                <p className="text-sm text-stone-500 max-w-xs mx-auto">
                  Parece que aún no has agregado nada. Explora nuestra colección y encuentra algo que te encante.
                </p>
              </div>
              <Button onClick={handleGoToShop} variant="outline" className="mt-4">
                Ir a la Tienda
              </Button>
            </div>
          ) : (
            /* LISTA DE ITEMS */
            <ScrollArea className="flex-1 px-6">
              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <CartItem
                    key={item.variantId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* ERRORES DE VALIDACIÓN */}
        {validationErrors.length > 0 && (
          <div className="px-6 py-2 bg-red-50/50">
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="ml-2">Atención</AlertTitle>
              <AlertDescription className="ml-2 mt-2">
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  {validationErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 bg-stone-50/50 p-6 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-base font-medium text-stone-900">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <p className="text-xs text-stone-500">
                El envío y los impuestos se calculan al coordinar por WhatsApp.
              </p>
            </div>

            <div className="grid gap-3">
              <Button
                onClick={handleCheckout}
                disabled={isValidating}
                className="w-full bg-black hover:bg-stone-800 text-white shadow-sm transition-colors"
                size="lg"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Validando stock...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Completar pedido por WhatsApp
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 h-auto py-2"
              >
                Vaciar carrito
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}