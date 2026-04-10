import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services';
import { ProductCategory, CATEGORY_LABELS } from '../../../core/enums';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = false;
  productId: number | null = null;
  categories = Object.entries(CATEGORY_LABELS);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    category: [ProductCategory.PIZZA as string, Validators.required],
    image: [''],
    available: [1],
    sort_order: [0],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.isEdit = true;
      this.productId = Number(idParam);
      this.productService.getById(this.productId).subscribe({
        next: (p) => {
          this.form.patchValue({
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            image: p.image,
            available: p.available,
            sort_order: p.sort_order,
          });
        },
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const data = this.form.value as any;

    if (this.isEdit && this.productId) {
      this.productService.update(this.productId, data).subscribe({
        next: () => this.router.navigate(['/admin']),
      });
    } else {
      this.productService.create(data).subscribe({
        next: () => this.router.navigate(['/admin']),
      });
    }
  }
}
