// src/app/tournament/active-tournament.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActiveTournamentService } from '../services/active-tournament.service';
import { AuthService } from '../services/auth.service';
import { ActiveTournamentWithPlayersDto, TournamentPlayerDto } from '../models/tournament.model';
import { TournamentEnrollmentService } from '../services/tournament-enrollment.service';

@Component({
  selector: 'app-active-tournament',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  template: `
    <div class="tournament-container">
      <div class="header">
        <img 
          src="/assets/logo.png" 
          alt="Chilean StarCraft Championship Logo" 
          class="header-logo"
        />
        <h1>Torneo Activo</h1>
      </div>

      <div class="back-link">
        <a [routerLink]="['/']" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Volver al Inicio
        </a>
      </div>

      <!-- Estado de carga y error -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando información del torneo...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon class="error-icon">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="loadActiveTournament()">Reintentar</button>
      </div>

      <!-- Si no hay torneo activo -->
      <div *ngIf="!isLoading && !error && !tournament" class="no-tournament">
        <mat-card class="info-card">
          <mat-card-content>
            <mat-icon class="info-icon">event_busy</mat-icon>
            <h2>No hay torneos activos</h2>
            <p>Actualmente no hay torneos en fase de clasificación. Vuelve pronto para más información.</p>
            <button mat-raised-button color="primary" [routerLink]="['/']">Volver al Inicio</button>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Información del torneo activo -->
      <div *ngIf="!isLoading && !error && tournament" class="tournament-content">
        <mat-card class="tournament-card">
          <mat-card-header>
            <mat-card-title>{{ tournament.name }}</mat-card-title>
            <mat-card-subtitle>
              <div class="tournament-phase">
                {{ tournament.currentPhase || 'Fase de Clasificación' }}
              </div>
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="tournament-info">
              <div class="tournament-details">
                <h3>Detalles del Torneo</h3>
                
                <div class="tournament-dates">
                  <div class="date-section">
                    <h4>Clasificación:</h4>
                    <p>{{ tournament.qualificationStartDate | date:'dd-MM-yyyy' }} al {{ tournament.qualificationEndDate | date:'dd-MM-yyyy' }}</p>
                  </div>
                  <div class="date-section">
                    <h4>Torneo Principal:</h4>
                    <p>{{ tournament.tournamentStartDate | date:'dd-MM-yyyy' }} al {{ tournament.tournamentEndDate | date:'dd-MM-yyyy' }}</p>
                  </div>
                </div>
                
                <div class="tournament-meta">
                  <div class="meta-item" *ngIf="tournament.prizePool">
                    <span class="meta-label">Premio:</span>
                    <span class="meta-value">{{ tournament.prizePool }} {{ tournament.currency || 'USD' }}</span>
                  </div>
                  <div class="meta-item" *ngIf="tournament.location">
                    <span class="meta-label">Ubicación:</span>
                    <span class="meta-value">{{ tournament.location }}</span>
                  </div>
                  <div class="meta-item" *ngIf="tournament.format">
                    <span class="meta-label">Formato:</span>
                    <span class="meta-value">{{ tournament.format }}</span>
                  </div>
                  <div class="meta-item" *ngIf="tournament.organizedBy">
                    <span class="meta-label">Organizado por:</span>
                    <span class="meta-value">{{ tournament.organizedBy }}</span>
                  </div>
                  <div class="meta-item" *ngIf="tournament.streamingPlatform">
                    <span class="meta-label">Plataforma de Streaming:</span>
                    <span class="meta-value">{{ tournament.streamingPlatform }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Jugadores Registrados:</span>
                    <span class="meta-value highlight-value">{{ tournament.totalPlayers }}</span>
                  </div>
                </div>
                
                <div class="tournament-description" *ngIf="tournament.description">
                  <h4>Descripción</h4>
                  <p>{{ tournament.description }}</p>
                </div>

                <!-- Botón de inscripción si el usuario está autenticado y no está inscrito -->
                <div class="enrollment-actions" *ngIf="isAuthenticated">
                  <div *ngIf="!isUserEnrolled">
                    <button 
                      mat-raised-button 
                      color="primary" 
                      class="enroll-button"
                      [routerLink]="['/enroll']"
                    >
                      <mat-icon>how_to_reg</mat-icon>
                      Inscribirme al Torneo
                    </button>
                  </div>
                  <div *ngIf="isUserEnrolled" class="already-enrolled">
                    <div class="enrolled-badge">
                      <mat-icon>check_circle</mat-icon>
                      Ya estás inscrito en este torneo
                    </div>
                    <button 
                      mat-raised-button 
                      class="profile-button"
                      [routerLink]="['/profile']"
                    >
                      Ver mi Perfil
                    </button>
                  </div>
                </div>
                
                <!-- Mensaje para usuarios no autenticados -->
                <div class="enrollment-actions" *ngIf="!isAuthenticated">
                  <button 
                    mat-raised-button 
                    color="primary" 
                    class="login-button"
                    [routerLink]="['/auth']"
                  >
                    <mat-icon>login</mat-icon>
                    Inicia Sesión para Inscribirte
                  </button>
                </div>
              </div>
            </div>

            <!-- Lista de jugadores inscritos -->
            <div class="players-section">
              <h3>Jugadores Inscritos <span class="player-count">({{ tournament.totalPlayers }})</span></h3>
              
              <div class="filter-sort">
                <input 
                  type="text" 
                  placeholder="Buscar jugador..." 
                  class="search-input"
                  (input)="applyFilter($event)"
                >
              </div>

              <!-- Tabla de jugadores -->
              <div class="table-responsive">
                <table 
                  mat-table 
                  [dataSource]="displayedPlayers" 
                  matSort 
                  (matSortChange)="sortData($event)"
                  class="players-table"
                >
                  <!-- Posición Column -->
                  <ng-container matColumnDef="position">
                    <th mat-header-cell *matHeaderCellDef>Pos</th>
                    <td mat-cell *matCellDef="let player">{{ player.rankingPosition || 'N/A' }}</td>
                  </ng-container>

                  <!-- Alias Column -->
                  <ng-container matColumnDef="alias">
                    <th mat-header-cell *matHeaderCellDef >Alias</th>
                    <td mat-cell *matCellDef="let player">{{ player.alias || 'N/A' }}</td>
                  </ng-container>

                  <!-- Race Column -->
                  <ng-container matColumnDef="race">
                    <th mat-header-cell *matHeaderCellDef >Raza</th>
                    <td mat-cell *matCellDef="let player">
                      <div class="race-cell">
                        <img 
                          *ngIf="player.race" 
                          [src]="getRaceIcon(player.race)" 
                          [alt]="player.race" 
                          class="race-icon"
                        >
                        {{ player.race || 'N/A' }}
                      </div>
                    </td>
                  </ng-container>

                  <!-- Gateway Column -->
                  <ng-container matColumnDef="gateway">
                    <th mat-header-cell *matHeaderCellDef>Gateway</th>
                    <td mat-cell *matCellDef="let player">{{ player.gatewayName || getGatewayName(player.gateway) }}</td>
                  </ng-container>

                  <!-- Rank Column -->
                  <ng-container matColumnDef="rank">
                    <th mat-header-cell *matHeaderCellDef>Rango</th>
                    <td mat-cell *matCellDef="let player">{{ player.rank || 'N/A' }}</td>
                  </ng-container>

                  <!-- Rating Column -->
                  <ng-container matColumnDef="rating">
                    <th mat-header-cell *matHeaderCellDef>MMR</th>
                    <td mat-cell *matCellDef="let player">{{ player.rating || 'N/A' }}</td>
                  </ng-container>

                  <!-- Win/Loss Column -->
                  <ng-container matColumnDef="record">
                    <th mat-header-cell *matHeaderCellDef>Victoria/Derrota</th>
                    <td mat-cell *matCellDef="let player">
                      <span class="win">{{ player.wins }}</span> - <span class="loss">{{ player.losses }}</span>
                    </td>
                  </ng-container>

                  <!-- Win Rate Column -->
                  <ng-container matColumnDef="winRate">
                    <th mat-header-cell *matHeaderCellDef>% Victoria</th>
                    <td mat-cell *matCellDef="let player">{{ player.winRate.toFixed(1) }}%</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
                
                <!-- Mensaje si no hay jugadores o no hay resultados de búsqueda -->
                <div *ngIf="displayedPlayers.length === 0" class="no-players">
                  <p *ngIf="allPlayers.length === 0">No hay jugadores inscritos en el torneo todavía.</p>
                  <p *ngIf="allPlayers.length > 0">No se encontraron jugadores con ese criterio de búsqueda.</p>
                </div>
              </div>
              
              <!-- Paginador -->
              <mat-paginator
                *ngIf="allPlayers.length > 0"
                [length]="filteredPlayers.length"
                [pageSize]="pageSize"
                [pageSizeOptions]="[10, 25, 50]"
                (page)="onPageChange($event)"
                showFirstLastButtons
              ></mat-paginator>
            </div>
          </mat-card-content>
        </mat-card>
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

    .tournament-container {
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .header-logo {
      height: 60px;
      width: auto;
      margin-right: 20px;
    }

    .header h1 {
      color: white;
      font-family: 'Orbitron', sans-serif;
      margin: 0;
      font-size: 2rem;
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

    /* Estados de carga y error */
    .loading-container, .error-container, .no-tournament {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
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

    .error-icon, .info-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .error-icon {
      color: #F44336;
    }

    .info-icon {
      color: #2196F3;
    }

    /* Cards */
    .tournament-card, .info-card {
      background-color: rgba(10, 10, 20, 0.7);
      color: white;
      border-left: 3px solid #d52b1e;
      margin-bottom: 20px;
    }

    .tournament-card {
      max-width: 1200px;
      margin: 0 auto 20px;
    }

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

    /* Fase del torneo */
    .tournament-phase {
      display: inline-block;
      padding: 3px 8px;
      background-color: rgba(213, 43, 30, 0.3);
      color: white;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
    }

    /* Información del torneo */
    .tournament-info {
      margin-bottom: 30px;
    }

    .tournament-details h3 {
      margin-top: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 10px;
      margin-bottom: 20px;
      color: #D52B1E;
    }

    .tournament-dates {
      margin: 20px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .date-section {
      flex: 1;
      min-width: 200px;
    }

    .date-section h4 {
      color: #aaa;
      font-size: 1rem;
      margin-bottom: 5px;
    }

    .date-section p {
      margin: 0;
      padding-left: 10px;
      border-left: 2px solid #D52B1E;
    }

    .tournament-meta {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      color: #aaa;
      font-size: 0.9rem;
    }

    .meta-value {
      font-size: 1.1rem;
      font-weight: bold;
    }

    .highlight-value {
      color: #D52B1E;
    }

    .tournament-description {
      margin-top: 20px;
    }

    .tournament-description h4 {
      color: #aaa;
      margin-bottom: 10px;
    }

    .tournament-description p {
      margin: 0;
      line-height: 1.6;
    }

    /* Acciones de inscripción */
    .enrollment-actions {
      margin-top: 30px;
      text-align: center;
    }

    .enroll-button, .login-button {
      background-color: #D52B1E !important;
      color: white !important;
      font-weight: bold;
      padding: 8px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .enroll-button mat-icon, .login-button mat-icon {
      margin-right: 8px;
    }

    .already-enrolled {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    .enrolled-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background-color: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
      border-radius: 4px;
      font-weight: bold;
    }

    .profile-button {
      background-color: #444 !important;
      color: white !important;
    }

    /* Sección de jugadores */
    .players-section {
      margin-top: 40px;
    }

    .players-section h3 {
      margin-top: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 10px;
      margin-bottom: 20px;
      color: #D52B1E;
      display: flex;
      align-items: center;
    }

    .player-count {
      margin-left: 10px;
      color: #aaa;
      font-size: 0.9rem;
      font-weight: normal;
    }

    .filter-sort {
      margin-bottom: 20px;
    }

    .search-input {
      width: 100%;
      max-width: 300px;
      padding: 12px;
      background-color: rgba(30, 30, 50, 0.5);
      border: none;
      color: white;
      font-size: 1rem;
      border-radius: 4px;
    }

    /* Tabla de jugadores */
    .table-responsive {
      overflow-x: auto;
    }

    .players-table {
      width: 100%;
      min-width: 800px;
      background-color: transparent;
    }

    /* Estilos de tabla */
    ::ng-deep .mat-mdc-table {
      background-color: transparent !important;
    }

    ::ng-deep .mat-mdc-header-row {
      background-color: rgba(30, 30, 50, 0.5) !important;
    }

    ::ng-deep .mat-mdc-header-cell {
      color: white !important;
      background-color: transparent !important;
      font-weight: bold !important;
      border-bottom: none !important;
    }

    ::ng-deep .mat-mdc-row {
      background-color: transparent !important;
    }

    ::ng-deep .mat-mdc-cell {
      color: white !important;
      background-color: transparent !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    ::ng-deep .mat-mdc-row:hover {
      background-color: rgba(255,255,255,0.1) !important;
    }

    ::ng-deep .mat-sort-header-arrow {
      color: white !important;
    }

    /* Celda de raza */
    .race-cell {
      display: flex;
      align-items: center;
    }

    .race-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    /* Win/Loss */
    .win {
      color: #4CAF50;
    }

    .loss {
      color: #F44336;
    }

    /* Mensaje cuando no hay jugadores */
    .no-players {
      text-align: center;
      padding: 20px;
      color: #aaa;
    }

    /* Paginador */
    ::ng-deep .mat-mdc-paginator {
      background-color: transparent !important;
      color: white !important;
    }

    ::ng-deep .mat-mdc-paginator-container {
      color: white !important;
    }

    ::ng-deep .mat-mdc-paginator-range-label {
      color: white !important;
    }

    ::ng-deep .mat-mdc-paginator-icon {
      fill: white !important;
    }

    ::ng-deep .mat-mdc-select-value-text {
      color: white !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .tournament-dates, .tournament-meta {
        flex-direction: column;
      }

      .table-responsive {
        margin: 0 -20px;
        padding: 0 20px;
      }

      .players-table {
        min-width: 600px;
      }
    }
  `]
})
export class ActiveTournamentComponent implements OnInit {
  isLoading: boolean = true;
  error: string | null = null;
  tournament: ActiveTournamentWithPlayersDto | null = null;
  
  // Estado de autenticación y usuario
  isAuthenticated: boolean = false;
  isUserEnrolled: boolean = false;
  
  // Datos para la tabla de jugadores
  allPlayers: TournamentPlayerDto[] = [];
  filteredPlayers: TournamentPlayerDto[] = [];
  displayedPlayers: TournamentPlayerDto[] = [];
  displayedColumns: string[] = ['position', 'alias', 'race', 'gateway', 'rank', 'rating', 'record', 'winRate'];
  
  // Paginación
  pageIndex: number = 0;
  pageSize: number = 10;
  
  // Ordenación actual
  currentSort: Sort = { active: '', direction: '' };
  
  // Filtro de búsqueda
  searchFilter: string = '';

  constructor(
    private activeTournamentService: ActiveTournamentService,
    private tournamentEnrollmentService: TournamentEnrollmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar estado de autenticación
    this.isAuthenticated = !!this.authService.getToken();
    
    // Cargar datos
    this.loadActiveTournament();
    
    // Si el usuario está autenticado, verificar si está inscrito
    if (this.isAuthenticated) {
      this.checkEnrollmentStatus();
    }
  }

  loadActiveTournament(): void {
    this.isLoading = true;
    this.error = null;
    
    this.activeTournamentService.getActiveTournamentWithPlayers().subscribe({
      next: (data) => {
        this.tournament = data;
        
        // Preparar datos de jugadores
        if (data.players && data.players.length > 0) {
          this.allPlayers = data.players;
          this.filteredPlayers = [...this.allPlayers];
          this.updateDisplayedPlayers();
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        
        // Si es 404, significa que no hay torneo activo (no es un error)
        if (err.status === 404) {
          this.tournament = null;
        } else {
          this.error = 'Error al cargar el torneo activo. Por favor, intenta más tarde.';
          console.error('Error cargando torneo activo:', err);
        }
      }
    });
  }

  checkEnrollmentStatus(): void {
    this.tournamentEnrollmentService.getEnrollmentStatus().subscribe({
      next: (status) => {
        this.isUserEnrolled = status.isEnrolled;
      },
      error: (err) => {
        console.error('Error verificando estado de inscripción:', err);
        // No mostramos error al usuario para no bloquear la vista
      }
    });
  }

  // Métodos para manejar la tabla de jugadores
  updateDisplayedPlayers(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedPlayers = this.filteredPlayers.slice(startIndex, endIndex);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchFilter = filterValue;
    
    this.filteredPlayers = this.allPlayers.filter(player => {
      const playerAlias = (player.alias || '').toLowerCase();
      const playerName = (player.playerName || '').toLowerCase();
      const playerRace = (player.race || '').toLowerCase();
      const playerGateway = (player.gatewayName || this.getGatewayName(player.gateway)).toLowerCase();
      
      return playerAlias.includes(filterValue) ||
             playerName.includes(filterValue) ||
             playerRace.includes(filterValue) ||
             playerGateway.includes(filterValue);
    });
    
    // Reordenar según la ordenación actual
    this.sortPlayers();
    
    // Resetear a la primera página
    this.pageIndex = 0;
    this.updateDisplayedPlayers();
  }

  sortData(sort: Sort): void {
    this.currentSort = sort;
    this.sortPlayers();
    this.updateDisplayedPlayers();
  }

  sortPlayers(): void {
    if (!this.currentSort.active || this.currentSort.direction === '') {
      return;
    }

    this.filteredPlayers = this.filteredPlayers.sort((a, b) => {
      const isAsc = this.currentSort.direction === 'asc';
      switch (this.currentSort.active) {
        case 'alias':
          return this.compare(a.alias || '', b.alias || '', isAsc);
        case 'race':
          return this.compare(a.race || '', b.race || '', isAsc);
        case 'gateway':
          return this.compare(
            a.gatewayName || this.getGatewayName(a.gateway),
            b.gatewayName || this.getGatewayName(b.gateway),
            isAsc
          );
        case 'rank':
          return this.compare(a.rank || '', b.rank || '', isAsc);
        case 'rating':
          return this.compare(a.rating || 0, b.rating || 0, isAsc);
        case 'winRate':
          return this.compare(a.winRate, b.winRate, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedPlayers();
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

  getGatewayName(gatewayId: number): string {
    switch (gatewayId) {
      case 30: return 'Korea';
      case 45: return 'Asia';
      case 11: return 'U.S. East';
      case 10: return 'U.S. West';
      case 20: return 'Europe';
      default: return `Gateway ${gatewayId}`;
    }
  }
}