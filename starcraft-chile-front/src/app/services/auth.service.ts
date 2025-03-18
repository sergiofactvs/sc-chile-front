import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import  environment  from '../../environments/environment';
import { LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Recuperar token almacenado al inicializar
    const storedToken = localStorage.getItem('jwt_token');
    this.tokenSubject.next(storedToken);
    
    // Actualizar estado de autenticación
    this.isAuthenticated.next(!!storedToken);
  }

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          // Guardar token en localStorage
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('user_role', this.extractUserRole(response.token));
          localStorage.setItem('user_email', response.user.email);
          localStorage.setItem('user_name', `${response.user.firstName} ${response.user.lastName}`);
          
          // Actualizar behaviorSubjects
          this.tokenSubject.next(response.token);
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  logout() {
    // Limpiar información de usuario del localStorage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    
    // Actualizar behaviorSubjects
    this.tokenSubject.next(null);
    this.isAuthenticated.next(false);
    
    // También podríamos realizar una llamada al backend para invalidar el token
    // (depende de cómo está implementado el backend)
    // this.http.post(`${this.apiUrl}/Auth/logout`, {}).subscribe();
  }

  private extractUserRole(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch {
      return '';
    }
  }
}