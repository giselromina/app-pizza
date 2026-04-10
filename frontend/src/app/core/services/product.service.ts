import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuResponse, Product } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /** Public: menu grouped by category */
  getMenu(): Observable<MenuResponse> {
    return this.http.get<MenuResponse>(`${this.url}/menu`);
  }

  /** Admin: all products flat */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/admin/products`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/admin/products/${id}`);
  }

  create(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.url}/admin/products`, data);
  }

  update(id: number, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.url}/admin/products/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/admin/products/${id}`);
  }
}
