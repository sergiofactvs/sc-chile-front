import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { PlayerService } from '../services/player.service';
import { PlayerPublicProfileDto } from '../models/player-public-profile.model';

@Component({
  selector: 'app-player-public-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    DatePipe
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <img 
          src="/assets/logo.png" 
          alt="Comunidad Starcraft CHILE Logo" 
          class="header-logo"
        />
        <h1>Perfil de Jugador</h1>
      </div>

      <div class="back-link">
        <a [routerLink]="['/active-tournament']" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Volver al Torneo
        </a>
      </div>

      <div *ngIf="profile" class="profile-content">
        <mat-card class="player-summary-card">
          <mat-card-header>
            <div class="player-avatar">
              <div class="avatar-placeholder">
                <mat-icon>person</mat-icon>
              </div>
            </div>
            <mat-card-title>{{ profile.name }}</mat-card-title>
            <mat-card-subtitle>
              <span class="player-country">{{ profile.country }}</span>
              <span *ngIf="profile.aliases" class="player-aliases">Alias: {{ profile.aliases }}</span>
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="player-description" *ngIf="profile.description">
              <h3>Sobre el jugador</h3>
              <p>{{ profile.description }}</p>
            </div>
          </mat-card-content>
        </mat-card>
        
        <!-- Información del torneo actual -->
        <div *ngIf="profile.currentTournament" class="current-tournament-section">
          <h2 class="section-title">Torneo Actual</h2>
          
          <mat-card class="tournament-card">
            <mat-card-header>
              <mat-card-title>{{ profile.currentTournament.tournamentName }}</mat-card-title>
              <mat-card-subtitle>
                <span class="tournament-phase">{{ profile.currentTournament.currentPhase || 'Fase de Clasificación' }}</span>
              </mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <div class="tournament-dates">
                <div class="date-section">
                  <h3>Clasificación:</h3>
                  <p>{{ profile.currentTournament.qualificationStartDate | date:'dd-MM-yyyy' }} al {{ profile.currentTournament.qualificationEndDate | date:'dd-MM-yyyy' }}</p>
                </div>
                <div class="date-section">
                  <h3>Torneo Principal:</h3>
                  <p>{{ profile.currentTournament.tournamentStartDate | date:'dd-MM-yyyy' }} al {{ profile.currentTournament.tournamentEndDate | date:'dd-MM-yyyy' }}</p>
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="player-performance">
                <h3>Rendimiento en el Torneo</h3>
                
                <div class="player-info">
                  <div class="info-row">
                    <span class="info-label">Alias:</span>
                    <span class="info-value">{{ profile.currentTournament.alias }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Gateway:</span>
                    <span class="info-value">{{ profile.currentTournament.gatewayName }}</span>
                  </div>
                  <div class="info-row" *ngIf="profile.currentTournament.race">
                    <span class="info-label">Raza:</span>
                    <span class="info-value race-value">
                      <img *ngIf="profile.currentTournament.race" 
                        [src]="getRaceIcon(profile.currentTournament.race)" 
                        [alt]="profile.currentTournament.race" 
                        class="race-icon">
                      {{ profile.currentTournament.race }}
                    </span>
                  </div>
                </div>
                
                <div class="stats-container">
                  <div class="stat-card" *ngIf="profile.currentTournament.rating">
                    <div class="stat-title">MMR</div>
                    <div class="stat-value mmr">{{ profile.currentTournament.rating }}</div>
                  </div>
                  <div class="stat-card" *ngIf="profile.currentTournament.rank">
                    <div class="stat-title">Rango</div>
                    <div class="stat-value rank">{{ profile.currentTournament.rank }}</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-title">Victorias</div>
                    <div class="stat-value wins">{{ profile.currentTournament.wins }}</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-title">Derrotas</div>
                    <div class="stat-value losses">{{ profile.currentTournament.losses }}</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-title">Partidas</div>
                    <div class="stat-value">{{ profile.currentTournament.totalMatches }}</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-title">% Victoria</div>
                    <div class="stat-value win-rate">{{ profile.currentTournament.winRate.toFixed(1) }}%</div>
                  </div>
                </div>
              </div>
              
              <!-- Perfil de juego actual si existe -->
              <div *ngIf="profile.currentTournament.currentProfile" class="current-profile">
                <h3>Perfil de Juego Actual</h3>
                
                <div class="profile-detail">
                  <div class="profile-header-info">
                    <div class="profile-race-icon" *ngIf="profile.currentTournament.currentProfile.race">
                      <img [src]="getRaceIcon(profile.currentTournament.currentProfile.race)" 
                        [alt]="profile.currentTournament.currentProfile.race" 
                        class="race-icon">
                    </div>
                    <div class="profile-name-gateway">
                      <div class="profile-name">{{ profile.currentTournament.currentProfile.alias }}</div>
                      <div class="profile-gateway">{{ profile.currentTournament.currentProfile.gatewayName }}</div>
                    </div>
                  </div>
                  
                  <div class="profile-stats">
                    <div class="profile-stat-row">
                      <div class="profile-stat">
                        <span class="stat-label">MMR:</span>
                        <span class="stat-value mmr">{{ profile.currentTournament.currentProfile.rating || 'N/A' }}</span>
                      </div>
                      <div class="profile-stat">
                        <span class="stat-label">Rango:</span>
                        <span class="stat-value rank">{{ profile.currentTournament.currentProfile.rank || 'N/A' }}</span>
                      </div>
                    </div>
                    <div class="profile-stat-row">
                      <div class="profile-stat">
                        <span class="stat-label">V/D:</span>
                        <span class="stat-value">
                          <span class="wins">{{ profile.currentTournament.currentProfile.wins }}</span> / 
                          <span class="losses">{{ profile.currentTournament.currentProfile.losses }}</span>
                        </span>
                      </div>
                      <div class="profile-stat">
                        <span class="stat-label">Actualizado:</span>
                        <span class="stat-value date">{{ profile.currentTournament.currentProfile.lastUpdated | date:'dd-MM-yyyy' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <!-- Mensaje si no está en ningún torneo actualmente -->
        <div *ngIf="!profile.currentTournament" class="no-tournament">
          <mat-card class="info-card">
            <mat-card-content class="center-content">
              <mat-icon class="info-icon">emoji_events_off</mat-icon>
              <h2>Sin torneo activo</h2>
              <p>Este jugador no está participando en ningún torneo actualmente.</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading && !error" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando perfil del jugador...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-container">
        <mat-icon class="error-icon">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="loadProfile()">Reintentar</button>
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

    .profile-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .header-logo {
      height: 70px;
      width: auto;
      margin-right: 20px;
    }

    .profile-header h1 {
      margin: 0;
      font-size: 2rem;
      color: white;
      font-family: 'Orbitron', sans-serif;
    }

    .back-link {
      margin-bottom: 20px;
    }

    .back-button {
      display: flex;
      align-items: center;
      color: white;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;
    }

    .back-button:hover {
      color: #D52B1E;
    }

    .back-button mat-icon {
      margin-right: 8px;
    }

    /* Card de resumen del jugador */
    .player-summary-card {
      background-color: rgba(10, 10, 20, 0.7);
      color: white;
      border-left: 3px solid #d52b1e;
      margin-bottom: 20px;
    }

    .player-avatar {
      width: 64px;
      height: 64px;
      margin-right: 16px;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(30, 30, 50, 0.5);
      border-radius: 50%;
    }

    .avatar-placeholder mat-icon {
      font-size: 36px;
      height: 36px;
      width: 36px;
      color: #aaa;
    }

    /* Overrides para estilos de Material */
    ::ng-deep .mat-mdc-card-header {
      padding: 16px;
    }

    ::ng-deep .mat-mdc-card-title {
      color: white !important;
      font-size: 1.5rem !important;
      margin-bottom: 8px !important;
    }

    ::ng-deep .mat-mdc-card-subtitle {
      color: #aaa !important;
    }

    ::ng-deep .mat-mdc-card-content {
      padding: 16px !important;
    }

    .player-country {
      margin-right: 16px;
    }

    .player-aliases {
      font-style: italic;
    }

    .player-description {
      margin-top: 16px;
    }

    .player-description h3 {
      color: #aaa;
      font-size: 1rem;
      margin-bottom: 8px;
    }

    .player-description p {
      margin: 0;
      line-height: 1.6;
    }

    /* Sección de torneo actual */
    .section-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      color: white;
      margin-bottom: 16px;
      text-align: center;
    }

    .tournament-card {
      background-color: rgba(10, 10, 20, 0.7);
      color: white;
      border-left: 3px solid #d52b1e;
      margin-bottom: 20px;
    }

    .tournament-phase {
      display: inline-block;
      padding: 3px 8px;
      background-color: rgba(213, 43, 30, 0.3);
      color: white;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
    }

    .tournament-dates {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
    }

    .date-section {
      flex: 1;
      min-width: 200px;
    }

    .date-section h3 {
      color: #aaa;
      font-size: 1rem;
      margin-bottom: 5px;
    }

    .date-section p {
      margin: 0;
      padding-left: 10px;
      border-left: 2px solid #D52B1E;
    }

    ::ng-deep .mat-divider {
      margin: 16px 0;
      border-top-color: rgba(255, 255, 255, 0.1);
    }

    .player-performance {
      margin-top: 20px;
    }

    .player-performance h3 {
      color: #D52B1E;
      font-size: 1.2rem;
      margin-bottom: 16px;
      text-align: center;
    }

    .player-info {
      margin-bottom: 20px;
    }

    .info-row {
      display: flex;
      margin-bottom: 8px;
    }

    .info-label {
      width: 100px;
      color: #aaa;
      font-weight: bold;
    }

    .info-value {
      color: white;
    }

    .race-value {
      display: flex;
      align-items: center;
    }

    .race-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-card {
      background-color: rgba(30, 30, 50, 0.5);
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }

    .stat-title {
      color: #aaa;
      font-size: 0.8rem;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .mmr, .rank {
      color: #1E90FF;
    }

    .wins {
      color: #4CAF50;
    }

    .losses {
      color: #F44336;
    }

    .win-rate {
      color: #FFC107;
    }

    /* Perfil actual de juego */
    .current-profile {
      margin-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
    }

    .current-profile h3 {
      color: #D52B1E;
      font-size: 1.2rem;
      margin-bottom: 16px;
      text-align: center;
    }

    .profile-detail {
      background-color: rgba(30, 30, 50, 0.5);
      border-radius: 8px;
      padding: 16px;
    }

    .profile-header-info {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .profile-race-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(50, 50, 70, 0.5);
      border-radius: 50%;
      margin-right: 16px;
    }

    .profile-name-gateway {
      display: flex;
      flex-direction: column;
    }

    .profile-name {
      font-size: 1.2rem;
      font-weight: bold;
      color: white;
    }

    .profile-gateway {
      font-size: 0.9rem;
      color: #aaa;
    }

    .profile-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .profile-stat-row {
      display: flex;
      justify-content: space-between;
    }

    .profile-stat {
      display: flex;
      align-items: center;
    }

    .stat-label {
      color: #aaa;
      margin-right: 8px;
    }

    .date {
      font-size: 0.9rem;
      color: #aaa;
    }

    /* Estado sin torneo */
    .no-tournament, .loading-container, .error-container {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    .info-card {
      background-color: rgba(10, 10, 20, 0.7);
      color: white;
      border-left: 3px solid #d52b1e;
      width: 100%;
    }

    .center-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 30px 0;
    }

    .info-icon, .error-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .info-icon {
      color: #aaa;
    }

    .error-icon {
      color: #F44336;
    }

    /* Estados de carga y error */
    .loading-container, .error-container {
      flex-direction: column;
      align-items: center;
      padding: 40px 0;
      text-align: center;
    }

    .loading-spinner {
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 4px solid #D52B1E;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .tournament-dates {
        flex-direction: column;
        gap: 10px;
      }
      
      .stats-container {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .profile-stat-row {
        flex-direction: column;
        gap: 8px;
      }
    }

    @media (max-width: 480px) {
      .stats-container {
        grid-template-columns: 1fr;
      }
    }
       /* Overrides para estilos de Material */
    ::ng-deep .mat-mdc-card-header {
      padding: 16px;
      display: flex;
      justify-content: flex-end; /* Alinea los elementos al lado derecho */
      flex-direction: row-reverse; /* Invierte el orden de los elementos */
    }

    ::ng-deep .mat-mdc-card-header-text {
      flex: 1;
      margin-right: 0; /* Quita el margen derecho predeterminado */
      margin-left: 16px; /* Añade margen izquierdo para separar del avatar */
    }

    .player-avatar {
      width: 80px;
      height: 80px;
      margin-right: 0; /* Quita el margen derecho que tenía */
      margin-left: 16px; /* Añade margen izquierdo para separar del borde */
    }
  `]
})
export class PlayerPublicProfileComponent implements OnInit {
  profile: PlayerPublicProfileDto | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = null;
    
    this.route.paramMap.subscribe(params => {
      const playerId = params.get('id');
      
      if (playerId) {
        this.playerService.getPlayerPublicProfile(Number(playerId)).subscribe({
          next: (data) => {
            this.profile = data;
            this.isLoading = false;
          },
          error: (err: any) => {
            console.error('Error al cargar el perfil público:', err);
            this.error = 'No se pudo cargar el perfil del jugador. Por favor, intenta de nuevo más tarde.';
            this.isLoading = false;
          }
        });
      } else {
        this.error = 'ID de jugador no proporcionado';
        this.isLoading = false;
      }
    });
  }

  getRaceIcon(race: string): string {
    const normalizedRace = race.toLowerCase();
    
    if (normalizedRace.includes('terran')) {
      return 'assets/races/terran.svg';
    } else if (normalizedRace.includes('zerg')) {
      return 'assets/races/zerg.svg';
    } else if (normalizedRace.includes('protoss')) {
      return 'assets/races/protoss.svg';
    } else if (normalizedRace.includes('random')) {
      return 'assets/races/random.svg';
    }
    
    return '';
  }
}