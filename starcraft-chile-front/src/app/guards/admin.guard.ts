import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verificar si el usuario está autenticado y tiene rol de Admin
    const token = this.authService.getToken();
    const userRole = this.authService.getUserRole();

    if (token && userRole === 'Admin') {
      return true;
    } else if (token) {
      // El usuario está autenticado pero no es Admin
      this.router.navigate(['/']);
      return false;
    } else {
      // El usuario no está autenticado
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}