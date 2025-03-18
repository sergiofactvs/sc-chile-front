import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../../environments/environment';
import { UserAdminDto, AdminActionResponse } from '../models/user.admin.model';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener lista de usuarios
  getUsers(page: number = 1, pageSize: number = 20): Observable<UserAdminDto[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<UserAdminDto[]>(`${this.apiUrl}/Admin/users`, { params });
  }

  // Cambiar estado de usuario (activar/desactivar)
  toggleUserStatus(userId: number): Observable<AdminActionResponse> {
    return this.http.put<AdminActionResponse>(`${this.apiUrl}/Admin/users/${userId}/toggle-status`, {});
  }
}