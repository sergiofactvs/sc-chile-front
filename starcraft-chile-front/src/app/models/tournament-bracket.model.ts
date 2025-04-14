// src/app/models/tournament-bracket.model.ts

export interface TournamentPlayerBracketDto {
    playerId: number;
    playerName: string;
    playerAlias: string;
    mmr: number;
    race: string;
    country: string;
    wins: number;
    losses: number;
  }
  
  export interface TournamentRoundDto {
    id: number;
    tournamentId: number;
    name: string;
    roundOrder: number;
    isWinnerBracket: boolean;
    pointsPerWin: number;
  }
  
  export interface TournamentMatchDto {
    id: number;
    tournamentId: number;
    roundId: number;
    roundName: string;
    matchOrder: number;
    player1Id: number | null;
    player1Name: string | null;
    player2Id: number | null;
    player2Name: string | null;
    winnerId: number | null;
    winnerName: string | null;
    score1: number | null;
    score2: number | null;
    scheduledTime: string | null;
    completedTime: string | null;
    notes: string | null;
    externalId: string | null;
    externalUrl: string | null;
  }
  
  export interface TournamentRoundCreateDto {
    tournamentId: number;
    name: string;
    roundOrder: number;
    isWinnerBracket: boolean;
    pointsPerWin: number;
  }
  
  export interface TournamentMatchCreateDto {
    roundId: number;
    matchOrder: number;
    player1Id?: number;
    player2Id?: number;
    scheduledTime?: string;
    notes?: string;
    externalId?: string;
    externalUrl?: string;
  }
  
  export interface RecordMatchResultDto {
    winnerId: number;
    score1: number;
    score2: number;
  }
  
  export interface GenerateBracketDto {
    playerCount: number;
    doubleElimination: boolean;
  }