import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Nueva categoría</h2>
    <mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="save()" style="padding-top:0.5rem">
        <mat-form-field appearance="outline" style="width:100%;min-width:320px">
          <mat-label>Nombre de la categoría</mat-label>
          <input matInput formControlName="name" placeholder="ej: EMPANADAS" />
          <mat-error>El nombre es obligatorio.</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close(null)">Cancelar</button>
      <button mat-raised-button color="primary" type="button" (click)="save()" [disabled]="form.invalid">
        Crear
      </button>
    </mat-dialog-actions>
  `,
})
export class CategoryDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<CategoryDialogComponent>);

  form = this.fb.group({
    name: ['', Validators.required],
  });

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value.name!.trim().toUpperCase());
  }
}
