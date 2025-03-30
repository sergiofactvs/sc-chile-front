// src/app/models/player-public-profile.model.ts
// Modelo para obtener el perfil público de un jugador desde la API

export interface PlayerPublicProfileDto {
    id: number;
    name: string;
    country: string;
    aliases: string;
    description?: string;
    currentTournament?: CurrentTournamentDto;
  }
  
  export interface CurrentTournamentDto {
    tournamentId: number;
    tournamentName: string;
    alias: string;
    gateway: number;
    gatewayName: string;
    race?: string;
    rank?: string;
    rating?: number;
    wins: number;
    losses: number;
    totalMatches: number;
    winRate: number;
    currentProfile?: GameProfileDto;
    qualificationStartDate: string;
    qualificationEndDate: string;
    tournamentStartDate: string;
    tournamentEndDate: string;
    currentPhase?: string;
  }
  
  export interface GameProfileDto {
    id: number;
    alias: string;
    gateway: number;
    gatewayName: string;
    rank?: string;
    race?: string;
    rating?: number;
    standing?: number;
    wins: number;
    losses: number;
    lastUpdated: string;
  }