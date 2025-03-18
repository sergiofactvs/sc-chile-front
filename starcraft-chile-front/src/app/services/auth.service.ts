// Actualización del AuthService (src/app/services/auth.service.ts)
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import environment from '../../environments/environment';
import { LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';

// Definimos las interfaces necesarias basadas en el Swagger
export interface UserRegistrationRequest {
  firstName: string;
  lastName: string;
  birthDate: string; // Fecha en formato ISO string
  country: string;
  description?: string;
  email: string;
  password: string;
  confirmPassword: string;
  alias: string;
  gateway: number;
  playerId?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public isAuthenticated = new BehaviorSubject<boolean>(false);
  
  // Tiempo de expiración del token en milisegundos (por defecto 1 hora)
  private tokenExpirationTime = 3600000; 
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Recuperar token almacenado al inicializar
    this.checkStoredAuth();
  }

  /**
   * Verifica si hay un token almacenado y actualiza el estado de autenticación
   */
  private checkStoredAuth(): void {
    const storedToken = localStorage.getItem('jwt_token');
    const expirationDate = localStorage.getItem('token_expiration');
    
    if (storedToken && expirationDate) {
      // Verificar si el token ha expirado
      const now = new Date().getTime();
      const expiration = new Date(expirationDate).getTime();
      
      if (expiration > now) {
        // Token válido, configurar timer para expiración
        this.tokenSubject.next(storedToken);
        this.isAuthenticated.next(true);
        this.setTokenExpirationTimer(expiration - now);
      } else {
        // Token expirado, limpiar
        this.clearAuthData();
      }
    } else {
      this.clearAuthData();
    }
  }

  /**
   * Autenticar usuario con credenciales
   */
  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.handleAuthentication(
            response.token, 
            response.tokenExpiration,
            response.user.email,
            `${response.user.firstName} ${response.user.lastName}`
          );
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Registrar un nuevo usuario
   */
  register(registrationData: UserRegistrationRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/register`, registrationData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja el proceso de autenticación exitosa
   */
  private handleAuthentication(
    token: string, 
    expirationDate: string, 
    email: string, 
    name: string
  ): void {
    // Extraer rol del token
    const role = this.extractUserRole(token);
    
    // Guardar datos en localStorage
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('token_expiration', expirationDate);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_name', name);
    
    // Actualizar BehaviorSubjects
    this.tokenSubject.next(token);
    this.isAuthenticated.next(true);
    
    // Configurar temporizador para expiración del token
    const expirationTime = new Date(expirationDate).getTime() - new Date().getTime();
    this.setTokenExpirationTimer(expirationTime);
  }

  /**
   * Configura un temporizador para limpiar la autenticación cuando expire el token
   */
  private setTokenExpirationTimer(expirationDuration: number): void {
    // Limpiar temporizador existente si hay uno
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    
    // Configurar nuevo temporizador
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Obtener el rol del usuario desde localStorage
   */
  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  /**
   * Obtener el email del usuario desde localStorage
   */
  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  /**
   * Obtener el nombre del usuario desde localStorage
   */
  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated.value;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Cerrar sesión y limpiar datos de autenticación
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Limpiar todos los datos de autenticación
   */
  private clearAuthData(): void {
    // Limpiar localStorage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    
    // Actualizar BehaviorSubjects
    this.tokenSubject.next(null);
    this.isAuthenticated.next(false);
    
    // Limpiar temporizador
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  /**
   * Extraer el rol del usuario a partir del JWT
   */
  private extractUserRole(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch {
      return '';
    }
  }

  /**
   * Manejar errores de la API
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifique los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Credenciales incorrectas.';
          break;
        case 403:
          errorMessage = 'Acceso prohibido. No tiene permiso para esta acción.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intente más tarde.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}