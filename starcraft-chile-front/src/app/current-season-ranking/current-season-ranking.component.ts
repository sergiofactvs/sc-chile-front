// src/app/current-season-ranking/current-season-ranking.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PlayerService } from './player.service';
import { TournamentPlayer, ActiveTournamentData } from '../models/player.model';

@Component({
  selector: 'app-current-season-ranking',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatBadgeModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './current-season-ranking.component.html',
  styleUrls: ['./current-season-ranking.component.css']
})
export class CurrentSeasonRankingComponent implements OnInit {
  players: TournamentPlayer[] = [];
  tournamentData: ActiveTournamentData | null = null;
  isLoading = true;
  error: string | null = null;
  minimumGames = 20; // Mínimo de partidas por defecto

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.fetchTournamentRanking();
  }

  fetchTournamentRanking(minGames: number = this.minimumGames) {
    this.isLoading = true;
    this.playerService.getActiveTournamentRanking(minGames)
      .subscribe({
        next: (data) => {
          this.tournamentData = data;
          this.players = data.players;
          this.minimumGames = data.minimumGames;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el ranking';
          this.isLoading = false;
          console.error('Error fetching tournament ranking', err);
        }
      });
  }

  getRaceIcon(race?: string): string {
    if (!race) return '';
    
    const normalizedRace = race.trim().replace(/\b\w/g, l => l.toUpperCase());
    
    const raceIcons: { [key: string]: string } = {
      'Terran': 'assets/races/terran.svg',
      'Zerg': 'assets/races/zerg.svg',
      'Protoss': 'assets/races/protoss.svg',
      'Random': 'assets/races/random.svg'
    };
    
    return raceIcons[normalizedRace] || '';
  }

  // Método para formatear fechas
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // Método para determinar la clase CSS para la posición del ranking
  getRankingPositionClass(position: number): string {
    if (position <= 3) return 'position-top';
    if (position <= 8) return 'position-qualified';
    return '';
  }

  // Método para obtener el texto del tooltip según clasificación
  getPlayerStatusTooltip(player: TournamentPlayer): string {
    if (!player.isQualified) {
      const gamesNeeded = this.minimumGames - player.totalGames;
      return `Necesita ${gamesNeeded} partida${gamesNeeded !== 1 ? 's' : ''} más para clasificar`;
    }
    
    if (player.qualificationPosition && player.qualificationPosition <= 8) {
      return `Clasificado en posición ${player.qualificationPosition}`;
    }
    
    return `Clasificado, pero fuera del top 8 (posición ${player.qualificationPosition})`;
  }
}