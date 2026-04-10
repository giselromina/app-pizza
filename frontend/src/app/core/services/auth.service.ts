import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'pizza_admin_token';
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());

  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): void {
    this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .subscribe({
        next: (res) => {
          sessionStorage.setItem(this.TOKEN_KEY, res.token);
          this.tokenSignal.set(res.token);
          this.router.navigate(['/admin']);
        },
        error: () => {
          this.tokenSignal.set(null);
        },
      });
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.tokenSignal.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private getStoredToken(): string | null {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
}
