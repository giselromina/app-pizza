import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, AuthService } from '../../../core/services';
import { Product } from '../../../core/models';
import { CATEGORY_LABELS, ProductCategory } from '../../../core/enums';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  readonly categoryLabels = CATEGORY_LABELS;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (p) => {
        this.products = p;
        this.loading = false;
      },
    });
  }

  getCategoryLabel(cat: string): string {
    return this.categoryLabels[cat as ProductCategory] || cat;
  }

  toggleAvailability(product: Product): void {
    this.productService
      .update(product.id, { available: product.available ? 0 : 1 } as any)
      .subscribe({ next: () => this.loadProducts() });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
