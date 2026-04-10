import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<CartItem[]>([]);

  readonly cartItems = computed(() => this.items());
  readonly total = computed(() =>
    this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );
  readonly itemCount = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0)
  );
  readonly isEmpty = computed(() => this.items().length === 0);

  add(product: Product): void {
    this.items.update(current => {
      const existing = current.find(i => i.product.id === product.id);
      if (existing) {
        return current.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  }

  remove(productId: number): void {
    this.items.update(current => current.filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.items.update(current =>
      current.map(i => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }

  clear(): void {
    this.items.set([]);
  }
}
