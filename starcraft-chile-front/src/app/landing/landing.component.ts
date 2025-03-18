import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="landing-container">
      <div class="login-section">
        <!-- Mostrar botón de login si no está autenticado -->
        <button 
          *ngIf="!isAuthenticated"
          mat-raised-button 
          class="login-button"
          [routerLink]="['/auth']"
        >
          Iniciar Sesión / Registro
        </button>
        
        <!-- Mostrar perfil del usuario si está autenticado -->
        <div *ngIf="isAuthenticated" class="user-profile-section">
          <button 
            mat-raised-button
            class="profile-button"
            [matMenuTriggerFor]="userMenu"
          >
            <span class="user-alias">{{ primaryAlias || userName }}</span>
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu" class="user-menu">
            <a mat-menu-item [routerLink]="['/profile']">
              <mat-icon>person</mat-icon>
              <span>Mi Perfil</span>
            </a>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <div class="container">
        <!-- Logo -->
        <img 
          src="/assets/logo.png" 
          alt="Chilean StarCraft Championship Logo" 
          class="logo"
        >
        
        <!-- Título -->
        <h1 class="title">Chilean StarCraft</h1>
        <p class="subtitle">CHAMPIONSHIP</p>
        
        <!-- Anuncio del torneo -->
        <div class="card">
          <p class="coming-soon">PRÓXIMAMENTE</p>
          <p class="tournament-date">Fase final</p>
         
        </div>
        
        <!-- Footer -->
        <footer class="footer">
          © 2025 Chilean StarCraft Championship
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #000000;
      color: white;
      font-family: 'Roboto', sans-serif;
    }

    .landing-container {
      background-color: #000000;
      position: relative;
      width: 100%;
      min-height: 100vh;
    }

    .login-section {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }

    .login-button {
      background-color: #D52B1E !important;
      color: white !important;
      font-weight: bold;
      text-transform: uppercase;
      border: none;
      padding: 8px 16px;
    }
    
    .user-profile-section {
      display: flex;
      align-items: center;
    }
    
    .profile-button {
      background-color: #D52B1E !important;
      color: white !important;
      font-weight: bold;
      text-transform: uppercase;
      border: none;
      padding: 8px 16px;
      display: flex;
      align-items: center;
    }
    
    .user-alias {
      margin-right: 8px;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    ::ng-deep .user-menu {
      background-color: #1A1A2E;
      border-left: 3px solid #D52B1E;
    }
    
    ::ng-deep .mat-mdc-menu-item {
      color: white !important;
    }
    
    ::ng-deep .mat-mdc-menu-item:hover {
      background-color: rgba(213, 43, 30, 0.2) !important;
    }
    
    ::ng-deep .mat-mdc-menu-item .mat-icon {
      color: #D52B1E !important;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px 20px;
      box-sizing: border-box;
      text-align: center;
    }

    .logo {
      width: auto;
      height: 350px;
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .title {
      font-family: 'Orbitron', sans-serif;
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0 0 10px 0;
    }

    .subtitle {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 6px;
      margin: 10px 0 40px 0;
    }

    .card {
      text-align: center;
      padding: 30px;
      border-radius: 8px;
      background-color: rgba(10, 10, 20, 0.7);
      border-left: 3px solid #d52b1e;
      max-width: 500px;
      width: 100%;
    }

    .coming-soon {
      font-size: 1.2rem;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 10px;
    }

    .tournament-date {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 30px;
    }

    .enter-button {
      background-color: #d52b1e;
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .footer {
      margin-top: auto;
      padding: 20px;
      color: #666;
      font-size: 0.9rem;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .logo {
        height: 250px;
      }
      
      .title {
        font-size: 2.5rem;
      }
      
      .subtitle {
        font-size: 1.2rem;
        letter-spacing: 4px;
      }
      
      .tournament-date {
        font-size: 2rem;
      }

      .login-section {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 10;
      }
    }

    @media (max-width: 480px) {
      .logo {
        height: 180px;
      }
      
      .title {
        font-size: 1.8rem;
      }
      
      .subtitle {
        font-size: 1rem;
        letter-spacing: 2px;
      }
      
      .tournament-date {
        font-size: 1.6rem;
      }
    }
  `]
})
export class LandingComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = '';
  primaryAlias: string = '';
  
  constructor(
    private authService: AuthService,
    private playerService: PlayerService
  ) {}
  
  ngOnInit() {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = !!this.authService.getToken();
    
    // Obtener información del usuario si está autenticado
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName() || 'Usuario';
      this.loadPlayerAlias();
    }
    
    // Suscribirse a cambios en el estado de autenticación
    this.authService.isAuthenticated.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.userName = this.authService.getUserName() || 'Usuario';
        this.loadPlayerAlias();
      } else {
        this.userName = '';
        this.primaryAlias = '';
      }
    });
  }
  
  loadPlayerAlias() {
    this.playerService.getGameProfiles().subscribe({
      next: (profiles) => {
        if (profiles && profiles.length > 0) {
          // Usar el primer alias como principal
          this.primaryAlias = profiles[0].alias || '';
        }
      },
      error: (err) => {
        console.error('Error al cargar perfiles de juego:', err);
      }
    });
  }
  
  logout() {
    this.authService.logout();
    // La suscripción en ngOnInit actualizará la UI
  }
}