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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { ActiveTournamentService } from '../services/active-tournament.service';
import { AuthService } from '../services/auth.service';
import { ActiveTournamentWithPlayersDto, TournamentPlayerDto } from '../models/tournament.model';
import { TournamentEnrollmentService } from '../services/tournament-enrollment.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    MatPaginatorModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './active-tournament.component.html',
  styleUrls: ['./active-tournament.component.scss']
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
  displayedColumns: string[] = ['position', 'alias', 'race', 'gateway', 'rank', 'rating', 'record', 'winRate', 'status'];
  
  // Paginación
  pageIndex: number = 0;
  pageSize: number = 10;
  
  // Ordenación actual
  currentSort: Sort = { active: '', direction: '' };
  
  // Filtro de búsqueda
  searchFilter: string = '';
  
  // Mínimo de partidas requeridas
  minimumGames: number = 20;

  constructor(
    private activeTournamentService: ActiveTournamentService,
    private tournamentEnrollmentService: TournamentEnrollmentService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
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
    
    this.activeTournamentService.getActiveTournamentWithPlayers(this.minimumGames).subscribe({
      next: (data) => {
        this.tournament = data;
        this.minimumGames = data.minimumGames;
        
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
  
  getSafeChallongeUrl(url: string): SafeResourceUrl {
    // Añadir "/module" al final de la URL si no lo tiene ya
    if (url && !url.endsWith('/module')) {
      url = url + '/module?show_tournament_name=1&show_final_results=1&show_standings=1';
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
        case 'position':
          return this.compare(a.rankingPosition, b.rankingPosition, isAsc);
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
        case 'record':
          return this.compare(a.wins + a.losses, b.wins + b.losses, isAsc);
        case 'winRate':
          return this.compare(a.winRate, b.winRate, isAsc);
        case 'status':
          // Ordenar primero por clasificación y luego por posición
          if (a.isQualified !== b.isQualified) {
            return this.compare(a.isQualified ? 1 : 0, b.isQualified ? 1 : 0, !isAsc);
          }
          if (a.isQualified && b.isQualified && a.qualificationPosition && b.qualificationPosition) {
            return this.compare(a.qualificationPosition, b.qualificationPosition, isAsc);
          }
          return 0;
        default:
          return 0;
      }
    });
  }

  compare(a: string | number | boolean, b: string | number | boolean, isAsc: boolean): number {
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
  
  formatRaceName(race: string | null | undefined): string {
    if (!race) return 'N/A';
    
    // Convertir primera letra a mayúscula y el resto a minúscula
    return race.charAt(0).toUpperCase() + race.slice(1).toLowerCase();
  }
  
  // Método para obtener la clase CSS para la posición del ranking
  getPositionClass(player: TournamentPlayerDto): string {
    if (!player.rankingPosition) return '';
    
    if (player.rankingPosition <= 3) return 'position-top';
    if (player.isQualified && player.qualificationPosition && player.qualificationPosition <= 8) {
      return 'position-qualified';
    }
    return '';
  }

  // Método para obtener el texto del tooltip según clasificación
  getPlayerStatusTooltip(player: TournamentPlayerDto): string {
    if (!player.isQualified) {
      const gamesNeeded = this.minimumGames - player.totalGames;
      return `Necesita ${gamesNeeded} partida${gamesNeeded !== 1 ? 's' : ''} más para clasificar`;
    }
    
    if (player.qualificationPosition && player.qualificationPosition <= 8) {
      return `Clasificado en posición ${player.qualificationPosition}`;
    }
    
    return `Clasificado, pero fuera del top 8 (posición ${player.qualificationPosition})`;
  }
  
  // Método para formatear fechas
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}