import type { CartItem } from '@/types/types';

/**
 * Formatea los items del carrito en un mensaje legible para WhatsApp
 * @param items Items del carrito
 * @param customMessage Mensaje personalizado opcional que se agregará al final
 */
export function formatCartMessage(items: CartItem[], customMessage?: string): string {
  if (items.length === 0) {
    return 'El carrito está vacío';
  }

  let message = 'Hola, quiero realizar el siguiente pedido:\n\n';

  items.forEach((item) => {
    // Nombre del producto
    let variantInfo = '';
    if (item.attributes && item.attributes.length > 0) {
      variantInfo = ` (${item.attributes.map(attr => attr.value).join('/')})`;
    }

    message += `- ${item.productName}${variantInfo}\n`;
    message += `  Cant: ${item.quantity} | Precio: $${item.price.toFixed(2)}\n\n`;
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  message += `Total: $${total.toFixed(2)}\n\n`;

  // Links de los productos
  message += 'Link(s):\n';
  const baseUrl = window.location.origin;

  // Usar un Set para evitar links duplicados si hay variantes del mismo producto
  const productLinks = new Set<string>();
  items.forEach(item => {
    if (item.productSlug) {
      productLinks.add(`- ${baseUrl}/producto/${item.productSlug}`);
    }
  });

  productLinks.forEach(link => {
    message += `${link}\n`;
  });

  // Mensaje personalizado opcional
  if (customMessage && customMessage.trim()) {
    message += `\n${customMessage}`;
  }

  return message;
}

/**
 * Genera la URL de WhatsApp con el mensaje del carrito codificado
 * @param phoneNumber Número de teléfono (formato: 5491123456789)
 * @param items Items del carrito
 * @param customMessage Mensaje personalizado opcional
 * @returns URL de WhatsApp lista para usar
 */
export function generateWhatsAppUrl(
  phoneNumber: string,
  items: CartItem[],
  customMessage?: string
): string {
  const message = formatCartMessage(items, customMessage);
  const encodedMessage = encodeURIComponent(message);

  // ✅ Formatear número de teléfono (remover espacios, guiones, etc.)
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // ✅ URL de WhatsApp Web/App
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Abre WhatsApp en una nueva ventana/pestaña
 * @param phoneNumber Número de teléfono
 * @param items Items del carrito
 * @param customMessage Mensaje personalizado opcional
 */
export function openWhatsApp(
  phoneNumber: string,
  items: CartItem[],
  customMessage?: string
): void {
  const url = generateWhatsAppUrl(phoneNumber, items, customMessage);
  window.open(url, '_blank', 'noopener,noreferrer');
}

