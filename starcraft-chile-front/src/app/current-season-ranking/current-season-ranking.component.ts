import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PlayerService } from './player.service';
import { RankingPlayer } from '../models/player.model';

@Component({
  selector: 'app-current-season-ranking',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './current-season-ranking.component.html',
  styleUrls: ['./current-season-ranking.component.css']
})
export class CurrentSeasonRankingComponent implements OnInit {
  ranking: RankingPlayer[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.fetchRanking();
  }

  fetchRanking(limit: number = 10, offset: number = 0) {
    this.isLoading = true;
    this.playerService.getRanking(limit, offset)
      .subscribe({
        next: (data) => {
          this.ranking = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el ranking';
          this.isLoading = false;
          console.error('Error fetching ranking', err);
        }
      });
  }

  getRaceIcon(race?: string): string {
    if (!race) return '';
    
    const normalizedRace = race.trim().replace(/\b\w/g, l => l.toUpperCase());
    
    const raceIcons: { [key: string]: string } = {
      'Terran': 'assets/races/terran.svg',
      'Zerg': 'assets/races/zerg.svg',
      'Protoss': 'assets/races/protoss.svg'
    };
    
    
    
    return raceIcons[normalizedRace] || '';
  }
}