// src/app/landing/landing.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';
import { ActiveTournamentService } from '../services/active-tournament.service';
import { TournamentEnrollmentService } from '../services/tournament-enrollment.service';

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
        
        <!-- Loading del torneo -->
        <div *ngIf="isLoadingTournament" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Cargando torneo...</p>
        </div>
        
        <!-- Anuncio del torneo activo -->
        <div *ngIf="!isLoadingTournament && activeTournament" class="card">
          <h2 class="tournament-name">{{ activeTournament.name }}</h2>
          <div class="tournament-phase">{{ activeTournament.currentPhase || 'Clasificación' }}</div>
          
          <div class="tournament-info">
            <div class="tournament-dates">
              <p class="date-label">Clasificación:</p>
              <p class="date-value">{{ activeTournament.qualificationStartDate | date:'dd-MM-yyyy' }} al {{ activeTournament.qualificationEndDate | date:'dd-MM-yyyy' }}</p>
            </div>
            
            <div class="tournament-dates">
              <p class="date-label">Torneo Principal:</p>
              <p class="date-value">{{ activeTournament.tournamentStartDate | date:'dd-MM-yyyy' }} al {{ activeTournament.tournamentEndDate | date:'dd-MM-yyyy' }}</p>
            </div>
            
            <div class="tournament-prize" *ngIf="activeTournament.prizePool">
              <p class="prize-label">Premio:</p>
              <p class="prize-value">{{ activeTournament.prizePool }} {{ activeTournament.currency || 'USD' }}</p>
            </div>
            
            <div class="tournament-players">
              <p class="players-label">Jugadores inscritos:</p>
              <p class="players-value">{{ activeTournament.totalPlayers }}</p>
            </div>
          </div>
          
          <!-- Botones de acción -->
          <div class="tournament-actions">
            <button 
              mat-raised-button 
              class="view-button"
              [routerLink]="['/active-tournament']"
            >
              <mat-icon>visibility</mat-icon>
              VER TORNEO
            </button>
            
            <ng-container *ngIf="isAuthenticated">
              <button 
                *ngIf="!isUserEnrolled"
                mat-raised-button 
                class="enter-button"
                [routerLink]="['/enroll']"
              >
                <mat-icon>how_to_reg</mat-icon>
                INSCRIBIRME
              </button>
              
              <div *ngIf="isUserEnrolled" class="already-enrolled">
                <mat-icon class="enrolled-icon">check_circle</mat-icon>
                Ya estás inscrito
              </div>
            </ng-container>
            
            <button 
              *ngIf="!isAuthenticated"
              mat-raised-button 
              class="enter-button"
              [routerLink]="['/auth']"
            >
              REGÍSTRATE PARA PARTICIPAR
            </button>
          </div>
        </div>
        
        <!-- Mensaje si no hay torneo activo -->
        <div *ngIf="!isLoadingTournament && !activeTournament" class="card">
          <p class="coming-soon">PRÓXIMAMENTE</p>
          <p class="tournament-date">Nuevo Torneo</p>
          <p class="no-tournament-message">No hay torneos activos en este momento. Vuelve pronto para más información.</p>
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
    
    /* Estilos para el menú desplegable */
    ::ng-deep .mat-mdc-menu-panel.user-menu {
      background-color: #1A1A2E !important;
      border-left: 3px solid #D52B1E !important;
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

    /* Asegurarse de que el texto dentro del menú sea visible */
    ::ng-deep .mat-mdc-menu-item span {
      color: white !important;
    }

    /* Asegurarse de que el color de fondo del panel sea visible */
    ::ng-deep .mat-mdc-menu-content {
      background-color: #1A1A2E !important;
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

    /* Estado de carga */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
    }

    .loading-spinner {
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 4px solid #D52B1E;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      color: #aaa;
      font-size: 0.9rem;
    }

    /* Card de torneo */
    .card {
      text-align: center;
      padding: 30px;
      border-radius: 8px;
      background-color: rgba(10, 10, 20, 0.7);
      border-left: 3px solid #d52b1e;
      max-width: 500px;
      width: 100%;
    }

    .tournament-name {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 10px 0;
      color: white;
    }

    .tournament-phase {
      display: inline-block;
      padding: 5px 15px;
      background-color: rgba(213, 43, 30, 0.3);
      color: white;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .tournament-info {
      margin: 20px 0;
      text-align: left;
    }

    .tournament-dates, .tournament-prize, .tournament-players {
      margin-bottom: 15px;
    }

    .date-label, .prize-label, .players-label {
      color: #aaa;
      font-size: 0.9rem;
      margin-bottom: 5px;
    }

    .date-value, .prize-value, .players-value {
      color: white;
      font-weight: bold;
      margin: 0;
      padding-left: 10px;
      border-left: 2px solid #D52B1E;
    }

    .players-value {
      color: #D52B1E;
      font-size: 1.2rem;
    }

    .tournament-actions {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 25px;
    }

    .view-button {
      background-color: #1E90FF !important;
      color: white !important;
      font-weight: bold;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .view-button mat-icon {
      margin-right: 8px;
    }

    .enter-button {
      background-color: #d52b1e !important;
      color: white !important;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 8px 16px;
    }

    .enter-button mat-icon {
      margin-right: 8px;
    }

    .already-enrolled {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
      border-radius: 4px;
      padding: 8px 16px;
      font-weight: bold;
    }

    .enrolled-icon {
      margin-right: 8px;
    }

    /* Mensaje si no hay torneo */
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
      margin-bottom: 20px;
    }

    .no-tournament-message {
      color: #aaa;
      margin-bottom: 20px;
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
  isLoadingTournament: boolean = true;
  activeTournament: any = null;
  isUserEnrolled: boolean = false;
  
  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    private activeTournamentService: ActiveTournamentService,
    private tournamentEnrollmentService: TournamentEnrollmentService
  ) {}
  
  ngOnInit() {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = !!this.authService.getToken();
    
    // Obtener información del usuario si está autenticado
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName() || 'Usuario';
      this.loadPlayerAlias();
      this.checkEnrollmentStatus();
    }
    
    // Suscribirse a cambios en el estado de autenticación
    this.authService.isAuthenticated.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.userName = this.authService.getUserName() || 'Usuario';
        this.loadPlayerAlias();
        this.checkEnrollmentStatus();
      } else {
        this.userName = '';
        this.primaryAlias = '';
        this.isUserEnrolled = false;
      }
    });
    
    // Cargar torneo activo
    this.loadActiveTournament();
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
  
  loadActiveTournament() {
    this.isLoadingTournament = true;
    this.activeTournamentService.getActiveTournamentWithPlayers().subscribe({
      next: (tournament) => {
        this.activeTournament = tournament;
        this.isLoadingTournament = false;
      },
      error: (err) => {
        // Si es 404, significa que no hay torneo activo (no es un error)
        if (err.status === 404) {
          this.activeTournament = null;
        } else {
          console.error('Error al cargar torneo activo:', err);
        }
        this.isLoadingTournament = false;
      }
    });
  }
  
  checkEnrollmentStatus() {
    if (!this.isAuthenticated) return;
    
    this.tournamentEnrollmentService.getEnrollmentStatus().subscribe({
      next: (status) => {
        this.isUserEnrolled = status.isEnrolled;
      },
      error: (err) => {
        console.error('Error al verificar estado de inscripción:', err);
      }
    });
  }
  
  logout() {
    this.authService.logout();
    // La suscripción en ngOnInit actualizará la UI
  }
}