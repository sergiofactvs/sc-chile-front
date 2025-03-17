import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const userRole = this.authService.getUserRole();

    if (token && userRole === 'Admin') {
      return true;
    } else {
      // Redirigir al login de admin o a página de acceso denegado
      this.router.navigate(['/auth']);
      return false;
    }
  }
}