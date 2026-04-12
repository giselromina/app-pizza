import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../core/services';
import { Product } from '../../../core/models';
import {
  ProductDialogComponent,
  ProductDialogData,
} from './product-dialog/product-dialog.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss',
})
export class AdminMenuComponent implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  grouped: Record<string, Product[]> = {};
  categories: string[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.productService.getCategories().subscribe({
      next: (cats) => {
        const allCategories = [...cats];
        this.productService.getAll().subscribe({
          next: (products) => {
            this.grouped = {};
            for (const p of products) {
              if (!this.grouped[p.category]) this.grouped[p.category] = [];
              this.grouped[p.category].push(p);
            }
            // Merge: categories from backend + those from products
            const fromProducts = Object.keys(this.grouped);
            this.categories = [...new Set([...allCategories, ...fromProducts])].sort();
            this.loading = false;
          },
        });
      },
    });
  }

  openCreate(category?: string): void {
    const ref = this.dialog.open(ProductDialogComponent, {
      width: '520px',
      data: { category, categories: this.categories } as ProductDialogData,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.create(result).subscribe({
          next: () => {
            this.snack.open('Producto creado', 'OK', { duration: 2500 });
            this.load();
          },
        });
      }
    });
  }

  openEdit(product: Product): void {
    const ref = this.dialog.open(ProductDialogComponent, {
      width: '520px',
      data: { product, categories: this.categories } as ProductDialogData,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.update(product.id, result).subscribe({
          next: () => {
            this.snack.open('Producto actualizado', 'OK', { duration: 2500 });
            this.load();
          },
        });
      }
    });
  }

  openNewCategory(): void {
    const ref = this.dialog.open(CategoryDialogComponent, { width: '400px' });
    ref.afterClosed().subscribe((name: string | null) => {
      if (name) {
        this.productService.createCategory(name).subscribe({
          next: () => {
            this.snack.open(`Categoría "${name}" creada`, 'OK', { duration: 2500 });
            this.load();
          },
          error: () => {
            this.snack.open('La categoría ya existe', 'OK', { duration: 2500 });
          },
        });
      }
    });
  }

  delete(product: Product): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.snack.open('Producto eliminado', 'OK', { duration: 2500 });
        this.load();
      },
    });
  }

  stockLabel(stock: number): string {
    return stock === -1 || stock == null ? 'Ilimitado' : String(stock);
  }
}
