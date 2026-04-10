import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppSettings } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getPublic(): Observable<AppSettings> {
    return this.http.get<AppSettings>(`${this.url}/settings`);
  }

  getAll(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.url}/admin/settings`);
  }

  update(settings: Record<string, string>): Observable<Record<string, string>> {
    return this.http.put<Record<string, string>>(`${this.url}/admin/settings`, settings);
  }
}
