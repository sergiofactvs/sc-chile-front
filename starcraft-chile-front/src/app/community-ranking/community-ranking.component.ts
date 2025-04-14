// src/app/community-ranking/community-ranking.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { PlayerRankingService } from '../services/player-ranking.service';
import { GeneralRankingDto } from '../models/player-ranking.model';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-community-ranking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './community-ranking.component.html',
  styleUrls: ['./community-ranking.component.css']
})
export class CommunityRankingComponent implements OnInit {
  players: GeneralRankingDto[] = [];
  isLoading = true;
  error: string | null = null;

  // Authentication-related properties
  isAuthenticated: boolean = false;
  userName: string = '';
  primaryAlias: string = '';

  constructor(
    private playerRankingService: PlayerRankingService,
    private authService: AuthService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    // Check authentication status
    this.isAuthenticated = !!this.authService.getToken();
    
    // Get user information if authenticated
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName() || 'Usuario';
      this.loadPlayerAlias();
    }
    
    // Subscribe to authentication changes
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

    this.fetchCommunityRanking();
  }

  fetchCommunityRanking() {
    this.isLoading = true;
    this.playerRankingService.getGeneralRanking(1, 100)
      .subscribe({
        next: (response) => {
          this.players = response.data.items;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el ranking de la comunidad';
          this.isLoading = false;
          console.error('Error fetching community ranking', err);
        }
      });
  }

  loadPlayerAlias() {
    this.playerService.getGameProfiles().subscribe({
      next: (profiles) => {
        if (profiles && profiles.length > 0) {
          // Use the first alias as primary
          this.primaryAlias = profiles[0].alias || '';
        }
      },
      error: (err) => {
        console.error('Error loading game profiles:', err);
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

  // Helper method to get ranking position class
  getRankingPositionClass(position: number): string {
    if (position === 1) return 'position-first';
    if (position === 2) return 'position-second';
    if (position === 3) return 'position-third';
    if (position <= 10) return 'position-top-10';
    return '';
  }

  // Method to determine if player should have a special badge
  getPlayerBadge(position: number): string {
    switch(position) {
      case 1: return '🏆'; // Trophy for first place
      case 2: return '🥈'; // Silver medal
      case 3: return '🥉'; // Bronze medal
      default: return '';
    }
  }

  // Logout method
  logout() {
    this.authService.logout();
  }
}