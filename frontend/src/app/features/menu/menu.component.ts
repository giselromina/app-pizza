import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService, CartService, SettingsService } from '../../core/services';
import { Product, AppSettings, MenuResponse } from '../../core/models';
import { CATEGORY_LABELS, ProductCategory } from '../../core/enums';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatProgressSpinnerModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  menu: MenuResponse = {};
  categories: string[] = [];
  settings: AppSettings | null = null;
  loading = true;
  error = '';

  readonly categoryLabels = CATEGORY_LABELS;

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsService.getPublic().subscribe({
      next: (s) => (this.settings = s),
    });

    this.productService.getMenu().subscribe({
      next: (menu) => {
        this.menu = menu;
        this.categories = Object.keys(menu);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el menú. Verificá que el servidor esté corriendo.';
        this.loading = false;
      },
    });
  }

  getCategoryLabel(key: string): string {
    return this.categoryLabels[key as ProductCategory] || key;
  }

  addToCart(product: Product): void {
    this.cartService.add(product);
  }

  getQuantityInCart(productId: number): number {
    const item = this.cartService.cartItems().find((i) => i.product.id === productId);
    return item?.quantity ?? 0;
  }

  removeFromCart(productId: number): void {
    const item = this.cartService.cartItems().find((i) => i.product.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    } else {
      this.cartService.remove(productId);
    }
  }
}
