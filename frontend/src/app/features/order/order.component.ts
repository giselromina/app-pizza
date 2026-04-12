import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CartService, SettingsService, WhatsappService, ProductService } from '../../core/services';
import { AppSettings } from '../../core/models';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDividerModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  private settingsService = inject(SettingsService);
  private whatsappService = inject(WhatsappService);
  private productService = inject(ProductService);

  settings: AppSettings | null = null;
  orderSent = false;

  form = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    customerPhone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
    address: [''],
    comments: [''],
  });

  ngOnInit(): void {
    this.settingsService.getPublic().subscribe({
      next: (s) => (this.settings = s),
    });
  }

  sendToWhatsapp(): void {
    if (this.form.invalid || this.cartService.isEmpty()) return;

    const { customerName, customerPhone, address, comments } = this.form.value;

    const url = this.whatsappService.buildUrl(
      this.settings?.whatsappNumber || '',
      customerName!,
      customerPhone!,
      address || '',
      this.cartService.cartItems(),
      this.cartService.total(),
      comments || ''
    );

    this.whatsappService.openWhatsapp(url);

    // Register the sale: decrement stock, increment sales
    const items = this.cartService.cartItems().map(i => ({ id: i.product.id, quantity: i.quantity }));
    this.productService.recordOrder(items).subscribe({ error: () => {} });

    this.orderSent = true;
    this.cartService.clear();
    this.form.reset();
  }
}
