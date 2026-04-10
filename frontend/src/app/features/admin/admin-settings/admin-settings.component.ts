import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SettingsService } from '../../../core/services';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
  ],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
})
export class AdminSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  saved = false;
  form = this.fb.group({
    whatsapp_number: [''],
    restaurant_name: [''],
    restaurant_address: [''],
    restaurant_hours: [''],
    welcome_message: [''],
  });

  ngOnInit(): void {
    this.settingsService.getAll().subscribe({
      next: (s) => this.form.patchValue(s),
    });
  }

  save(): void {
    const data = this.form.value as Record<string, string>;
    this.settingsService.update(data).subscribe({
      next: () => {
        this.saved = true;
        setTimeout(() => (this.saved = false), 3000);
      },
    });
  }
}
