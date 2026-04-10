import { Injectable } from '@angular/core';
import { CartItem } from '../models';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  /**
   * Builds a wa.me URL with a prefilled message.
   */
  buildUrl(
    whatsappNumber: string,
    customerName: string,
    customerPhone: string,
    address: string,
    items: CartItem[],
    total: number,
    comments: string
  ): string {
    const lines: string[] = [
      `🍕 *NUEVO PEDIDO*`,
      ``,
      `👤 *Nombre:* ${customerName}`,
      `📞 *WhatsApp:* ${customerPhone}`,
    ];

    if (address.trim()) {
      lines.push(`📍 *Dirección:* ${address}`);
    }

    lines.push(``, `📋 *Detalle del pedido:*`);

    for (const item of items) {
      const subtotal = item.product.price * item.quantity;
      lines.push(`  • ${item.quantity}x ${item.product.name} — $${subtotal.toLocaleString('es-AR')}`);
    }

    lines.push(``, `💰 *Total estimado:* $${total.toLocaleString('es-AR')}`);

    if (comments.trim()) {
      lines.push(``, `💬 *Comentarios:* ${comments}`);
    }

    const message = lines.join('\n');
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }

  openWhatsapp(url: string): void {
    window.open(url, '_blank');
  }
}
