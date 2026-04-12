import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../../core/models';

export interface ProductDialogData {
  product?: Product;
  category?: string;
  categories: string[];
}

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" />
          <mat-error>El nombre es obligatorio (mín. 2 caracteres).</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Precio</mat-label>
          <span matTextPrefix>$&nbsp;</span>
          <input matInput formControlName="price" type="number" min="0" step="10" />
          <mat-error>El precio es obligatorio.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="category">
            <mat-option *ngFor="let cat of categories" [value]="cat">
              {{ cat | titlecase }}
            </mat-option>
            <mat-option value="__new__">➕ Nueva categoría...</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field *ngIf="usingNewCategory" appearance="outline" class="full-width">
          <mat-label>Nombre de la nueva categoría</mat-label>
          <input matInput formControlName="newCategory" placeholder="ej: EMPANADAS" />
          <mat-error>El nombre de la categoría es obligatorio.</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Stock (dejar vacío = ilimitado)</mat-label>
          <input matInput formControlName="stock" type="number" min="0" step="1" />
          <mat-hint>Vacío o -1 significa sin límite</mat-hint>
        </mat-form-field>

        <div *ngIf="isEdit" class="sales-info">
          <mat-icon>trending_up</mat-icon>
          <span>Unidades vendidas: <strong>{{ data.product?.sales ?? 0 }}</strong></span>
        </div>

        <div class="toggle-row">
          <mat-slide-toggle formControlName="available" color="primary">
            Disponible
          </mat-slide-toggle>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Cancelar</button>
      <button
        mat-raised-button
        color="primary"
        type="button"
        (click)="save()"
        [disabled]="form.invalid || (usingNewCategory && !form.value.newCategory?.trim())"
      >
        {{ isEdit ? 'Guardar cambios' : 'Crear producto' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding-top: 0.5rem;
        min-width: 420px;
      }
      .full-width {
        width: 100%;
      }
      .toggle-row {
        padding: 0.5rem 0 0.25rem;
      }
      .sales-info {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.25rem 0 0.5rem;
        color: #555;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class ProductDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ProductDialogComponent>);

  isEdit: boolean;
  categories: string[];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    newCategory: [''],
    stock: [null as number | null],
    available: [true],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductDialogData) {
    this.isEdit = !!data.product;
    this.categories = [...data.categories];

    const cat = data.product?.category ?? data.category ?? '';
    this.form.patchValue({
      name: data.product?.name ?? '',
      description: data.product?.description ?? '',
      price: data.product?.price ?? 0,
      category: cat,
      stock: data.product?.stock != null && data.product.stock >= 0 ? data.product.stock : null,
      available: data.product != null ? !!data.product.available : true,
    });
  }

  get usingNewCategory(): boolean {
    return this.form.value.category === '__new__';
  }

  save(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    const category =
      val.category === '__new__'
        ? (val.newCategory ?? '').trim().toUpperCase()
        : val.category;
    if (!category) return;

    this.dialogRef.close({
      name: val.name,
      description: val.description ?? '',
      price: Number(val.price),
      category,
      available: val.available ? 1 : 0,
      stock: val.stock === null || val.stock === undefined || val.stock === ('' as any) ? -1 : Number(val.stock),
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
