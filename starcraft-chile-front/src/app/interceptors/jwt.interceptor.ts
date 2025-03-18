import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener token de autenticación
    const token = this.authService.getToken();
    
    // Si existe token, añadirlo al header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continuar con la solicitud y manejar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si recibe un error 401 (Unauthorized)
        if (error.status === 401) {
          console.log('Error 401: Token expirado o inválido');
          
          // Cerrar sesión y limpiar datos almacenados
          this.authService.logout();
          
          // Redireccionar a la página de login
          if (!this.isAuthUrl(request.url)) {
            this.router.navigate(['/admin/login']);
          }
        }
        
        // Propagar el error
        return throwError(() => error);
      })
    );
  }

  // Método para verificar si la URL está relacionada con autenticación
  // para evitar redirecciones infinitas
  private isAuthUrl(url: string): boolean {
    return url.includes('/Auth/login') || url.includes('/admin/login');
  }
}