import { useCartStore } from '@/stores/cartStore';
import type { ProductResponse, ProductVariantResponse } from '@/types/types';
import type { CartItem } from '@/types/types';

/**
 * Helper para agregar un producto al carrito desde las páginas de productos
 */
export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem);

  const addProductToCart = (
    product: ProductResponse,
    variant: ProductVariantResponse,
    quantity: number = 1
  ) => {
    // ✅ Obtener la primera imagen de la variante o del producto
    const imageUrl = variant.images?.[0]?.url || product.images?.[0]?.url;

    // ✅ Mapear atributos de la variante
    const attributes = variant.attributeValues?.map((attrValue) => ({
      attributeName: attrValue.attribute.name,
      value: attrValue.value,
    })) || [];

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: variant.id,
      variantSku: variant.sku,
      price: variant.price,
      quantity,
      attributes,
      imageUrl,
    };

    addItem(cartItem);
  };

  return { addProductToCart };
}

