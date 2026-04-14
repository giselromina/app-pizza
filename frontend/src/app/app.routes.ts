import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  {
    path: 'menu',
    loadComponent: () =>
      import('./features/menu/menu.component').then((m) => m.MenuComponent),
  },
  {
    path: 'order',
    loadComponent: () =>
      import('./features/order/order.component').then((m) => m.OrderComponent),
  },
  {
    path: 'admin/login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/admin/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/admin/admin-dashboard/admin-dashboard.component'
      ).then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'admin/products/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'admin/products/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'admin/settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/admin/admin-settings/admin-settings.component'
      ).then((m) => m.AdminSettingsComponent),
  },
  {
    path: 'admin/menu',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-menu/admin-menu.component').then(
        (m) => m.AdminMenuComponent
      ),
  },
  { path: '**', redirectTo: 'menu' },
];
