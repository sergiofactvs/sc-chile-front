// src/app/tournament/qualified-players.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { QualifiedPlayer, QualifiedPlayersResponse } from '../services/tournament.service';
import { HttpClient } from '@angular/common/http';
import environment from '../../environments/environment';

@Component({
  selector: 'app-qualified-players',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="qualified-players-container">
      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Cargando jugadores clasificados...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon class="error-icon">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="loadQualifiedPlayers()">Reintentar</button>
      </div>

      <div *ngIf="!isLoading && !error && qualifiedPlayersData">
        <div class="tournament-info" *ngIf="showTournamentInfo">
          <h2>{{ qualifiedPlayersData.tournamentName }}</h2>
          <div class="tournament-phase-badge">{{ qualifiedPlayersData.currentPhase }}</div>
          <p class="tournament-requirement">Requisito para clasificación: {{ qualifiedPlayersData.minimumGames }} partidas jugadas</p>
        </div>

        <div class="table-container" *ngIf="displayedPlayers.length > 0">
          <table mat-table [dataSource]="displayedPlayers" matSort (matSortChange)="sortData($event)" class="qualified-players-table">
            <!-- Position Column -->
            <ng-container matColumnDef="position">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let player" [class.position-top]="player.rankingPosition <= 3" [class.position-qualified]="player.rankingPosition <= 8">
                {{ player.rankingPosition }}
              </td>
            </ng-container>

            <!-- Alias Column -->
            <ng-container matColumnDef="alias">
              <th mat-header-cell *matHeaderCellDef>Jugador</th>
              <td mat-cell *matCellDef="let player">
                <div class="player-cell">
                  <a [routerLink]="['/player', player.playerId]" class="player-link">{{ player.alias }}</a>
                </div>
              </td>
            </ng-container>

            <!-- Race Column -->
            <ng-container matColumnDef="race">
              <th mat-header-cell *matHeaderCellDef>Raza</th>
              <td mat-cell *matCellDef="let player">
                <div class="race-cell">
                  <img 
                    *ngIf="player.race" 
                    [src]="getRaceIcon(player.race)" 
                    [alt]="player.race" 
                    class="race-icon"
                  >
                  <span class="race-name" [ngClass]="{
                    'terran': player.race?.toLowerCase().includes('terran'),
                    'protoss': player.race?.toLowerCase().includes('protoss'),
                    'zerg': player.race?.toLowerCase().includes('zerg')
                  }">{{ player.race || 'N/A' }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Gateway Column -->
            <ng-container matColumnDef="gateway">
              <th mat-header-cell *matHeaderCellDef>Gateway</th>
              <td mat-cell *matCellDef="let player">{{ player.gatewayName }}</td>
            </ng-container>

            <!-- Rating Column -->
            <ng-container matColumnDef="rating">
              <th mat-header-cell *matHeaderCellDef>MMR</th>
              <td mat-cell *matCellDef="let player" class="rating-cell">{{ player.rating }}</td>
            </ng-container>

            <!-- Record Column -->
            <ng-container matColumnDef="record">
              <th mat-header-cell *matHeaderCellDef>W-L</th>
              <td mat-cell *matCellDef="let player">
                <span class="wins">{{ player.wins }}</span>-<span class="losses">{{ player.losses }}</span>
                <span class="win-rate">({{ calculateWinRate(player.wins, player.losses) }}%)</span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [class.qualified-row]="row.rankingPosition <= 8"
                [class.top-row]="row.rankingPosition <= 3"></tr>
          </table>

          <mat-paginator 
            *ngIf="showPaginator && qualifiedPlayersData.players.length > pageSize"
            [length]="qualifiedPlayersData.players.length"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 20]"
            (page)="onPageChange($event)"
            showFirstLastButtons
            class="custom-paginator"
          ></mat-paginator>
        </div>

        <div *ngIf="displayedPlayers.length === 0" class="no-players">
          <p>No hay jugadores clasificados en este momento.</p>
        </div>

        <div *ngIf="showViewMoreButton && qualifiedPlayersData.players.length > displayLimit" class="view-more-container">
          <button mat-raised-button [routerLink]="['/active-tournament']" class="view-more-button">
            Ver Ranking Completo
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Variables (Asegurarse que coincidan con el landing) */
    :host {
      --primary-color: #0B3D91;
      --secondary-color: #DA291C;
      --bg-dark: #0A0C1B;
      --bg-darker: #070810;
      --bg-card: #111326;
      --text-primary: #ffffff;
      --text-secondary: #aaaaaa;
      --text-tertiary: #666666;
      --border-color: rgba(255, 255, 255, 0.1);
      
      --terran-color: #57B5E7;
      --protoss-color: #8DD3C7;
      --zerg-color: #FBBF72;
      
      --font-main: 'Roboto', sans-serif;
      --font-special: 'Orbitron', sans-serif;
      
      display: block;
      width: 100%;
    }
    
    .qualified-players-container {
      width: 100%;
      margin-bottom: 20px;
      background-color: var(--bg-card);
      border-radius: 0.5rem;
      
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
    }

    .loading-spinner {
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 4px solid var(--secondary-color);
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-icon {
      font-size: 36px;
      height: 36px;
      width: 36px;
      color: #F44336;
      margin-bottom: 10px;
    }

    .tournament-info {
      text-align: center;
      margin-bottom: 20px;
    }

    .tournament-info h2 {
      margin-top: 0;
      margin-bottom: 10px;
      color: var(--text-primary);
      font-family: var(--font-special);
      font-size: 1.5rem;
    }

    .tournament-phase-badge {
      display: inline-block;
      padding: 3px 8px;
      background-color: rgba(213, 43, 30, 0.3);
      color: var(--text-primary);
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .tournament-requirement {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 15px;
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 1rem;
      background-color: rgba(30, 30, 50, 0.2);
      border-radius: 0.5rem;
      padding: 0.5rem;
    }

    .qualified-players-table {
      width: 100%;
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
      color: var(--text-primary) !important;
      background-color: transparent !important;
      font-weight: bold !important;
      border-bottom: none !important;
      text-align: center !important;
      font-size: 0.85rem !important;
      letter-spacing: 0.05em !important;
    }

    ::ng-deep .mat-mdc-row {
      background-color: transparent !important;
      transition: background-color 0.2s ease !important;
    }

    ::ng-deep .mat-mdc-row:hover {
      background-color: rgba(255,255,255,0.05) !important;
    }

    ::ng-deep .mat-mdc-row.qualified-row {
      background-color: rgba(11, 61, 145, 0.1) !important;
    }

    ::ng-deep .mat-mdc-row.qualified-row:hover {
      background-color: rgba(11, 61, 145, 0.15) !important;
    }

    ::ng-deep .mat-mdc-row.top-row {
      background-color: rgba(11, 61, 145, 0.2) !important;
    }

    ::ng-deep .mat-mdc-row.top-row:hover {
      background-color: rgba(11, 61, 145, 0.25) !important;
    }

    ::ng-deep .mat-mdc-cell {
      color: var(--text-primary) !important;
      background-color: transparent !important;
      border-bottom: 1px solid var(--border-color) !important;
      text-align: center !important;
      font-size: 0.95rem !important;
    }

    .player-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .player-link {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
    }

    .player-link:hover {
      color: var(--secondary-color);
      text-decoration: underline;
    }

    .race-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .race-icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }

    .race-name {
      font-weight: 500;
    }

    .race-name.terran {
      color: var(--terran-color);
    }

    .race-name.protoss {
      color: var(--protoss-color);
    }

    .race-name.zerg {
      color: var(--zerg-color);
    }

    .rating-cell {
      font-weight: 600;
      color: #1E90FF !important;
    }

    .wins {
      color: #4CAF50;
      font-weight: 600;
    }

    .losses {
      color: #F44336;
      font-weight: 600;
    }

    .win-rate {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-left: 5px;
    }

    .position-top {
      color: gold !important;
      font-weight: bold;
    }

    .position-qualified {
      color: #1E90FF !important;
      font-weight: bold;
    }

    .no-players {
      text-align: center;
      padding: 20px;
      color: var(--text-secondary);
      background-color: rgba(30, 30, 50, 0.2);
      border-radius: 0.5rem;
    }

    .view-more-container {
      text-align: center;
      margin-top: 20px;
    }

    .view-more-button {
      background-color: var(--primary-color) !important;
      color: white !important;
      padding: 0.5rem 1.5rem !important;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .view-more-button:hover {
      background-color: rgba(11, 61, 145, 0.8) !important;
    }

    /* Estilos del paginador */
    ::ng-deep .custom-paginator {
      background-color: transparent !important;
      color: var(--text-primary) !important;
      margin-top: 10px;
    }

    ::ng-deep .custom-paginator .mat-mdc-paginator-container {
      color: var(--text-primary) !important;
    }

    ::ng-deep .custom-paginator .mat-mdc-paginator-range-label {
      color: var(--text-primary) !important;
    }

    ::ng-deep .custom-paginator .mat-mdc-paginator-icon {
      fill: var(--text-primary) !important;
    }

    ::ng-deep .custom-paginator .mat-mdc-select-value-text {
      color: var(--text-primary) !important;
    }

    /* Media queries para responsividad */
    @media (max-width: 768px) {
      .table-container {
        margin: 0 -0.5rem;
      }
      
      ::ng-deep .mat-mdc-header-cell, 
      ::ng-deep .mat-mdc-cell {
        padding: 8px 4px !important;
      }
      
      .win-rate {
        display: none;
      }
    }
    
    @media (max-width: 480px) {
      ::ng-deep .mat-mdc-header-cell, 
      ::ng-deep .mat-mdc-cell {
        padding: 8px 2px !important;
        font-size: 0.8rem !important;
      }
      
      .race-icon {
        margin-right: 2px;
        width: 16px;
        height: 16px;
      }
    }
  `]
})
export class QualifiedPlayersComponent implements OnInit {
  @Input() displayLimit: number = 8; // Default to showing 8 players
  @Input() showViewMoreButton: boolean = true;
  @Input() showTournamentInfo: boolean = true;
  @Input() showPaginator: boolean = true;

  qualifiedPlayersData: QualifiedPlayersResponse | null = null;
  displayedPlayers: QualifiedPlayer[] = [];
  displayedColumns: string[] = ['position', 'alias', 'race', 'gateway', 'rating', 'record'];
  isLoading: boolean = true;
  error: string | null = null;
  
  // Paginación
  pageSize: number = 10;
  pageIndex: number = 0;
  
  // Ordenación actual
  currentSort: Sort = { active: '', direction: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadQualifiedPlayers();
  }

  loadQualifiedPlayers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.http.get<QualifiedPlayersResponse>(`${environment.apiUrl}/TournamentEnrollment/qualified-players`)
      .subscribe({
        next: (data) => {
          this.qualifiedPlayersData = data;
          this.updateDisplayedPlayers();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar jugadores clasificados:', err);
          this.error = 'Error al cargar los jugadores clasificados. Por favor, intenta más tarde.';
          this.isLoading = false;
        }
      });
  }

  updateDisplayedPlayers(): void {
    if (!this.qualifiedPlayersData) return;
    
    let players = [...this.qualifiedPlayersData.players];
    
    // Aplicar ordenación si hay alguna activa
    if (this.currentSort.active && this.currentSort.direction !== '') {
      players = this.sortPlayers(players, this.currentSort);
    }
    
    // Si se muestra el botón "Ver más", limitar la cantidad de jugadores
    if (this.showViewMoreButton) {
      this.displayedPlayers = players.slice(0, this.displayLimit);
    } 
    // Si no, aplicar paginación
    else if (this.showPaginator) {
      const startIndex = this.pageIndex * this.pageSize;
      this.displayedPlayers = players.slice(startIndex, startIndex + this.pageSize);
    }
    // Si no se muestra ni el botón ni el paginador, mostrar todos
    else {
      this.displayedPlayers = players;
    }
  }

  sortData(sort: Sort): void {
    this.currentSort = sort;
    
    if (!this.qualifiedPlayersData) return;
    
    const players = [...this.qualifiedPlayersData.players];
    const sortedPlayers = this.sortPlayers(players, sort);
    
    // Actualizar el array de jugadores original para mantener el orden
    this.qualifiedPlayersData.players = sortedPlayers;
    
    this.updateDisplayedPlayers();
  }

  sortPlayers(players: QualifiedPlayer[], sort: Sort): QualifiedPlayer[] {
    if (!sort.active || sort.direction === '') {
      return players;
    }

    return players.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'position': return this.compare(a.rankingPosition, b.rankingPosition, isAsc);
        case 'alias': return this.compare(a.alias, b.alias, isAsc);
        case 'race': return this.compare(a.race || '', b.race || '', isAsc);
        case 'gateway': return this.compare(a.gatewayName, b.gatewayName, isAsc);
        case 'rating': return this.compare(a.rating, b.rating, isAsc);
        case 'record': return this.compare(a.wins, b.wins, isAsc);
        default: return 0;
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
  
  // Calcular porcentaje de victorias
  calculateWinRate(wins: number, losses: number): string {
    if (wins === 0 && losses === 0) return '0';
    
    const total = wins + losses;
    const winRate = (wins / total) * 100;
    return winRate.toFixed(1);
  }
}