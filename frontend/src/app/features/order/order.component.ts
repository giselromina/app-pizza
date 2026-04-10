import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, SettingsService, WhatsappService } from '../../core/services';
import { AppSettings } from '../../core/models';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  private settingsService = inject(SettingsService);
  private whatsappService = inject(WhatsappService);

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
    this.orderSent = true;
    this.cartService.clear();
    this.form.reset();
  }
}
