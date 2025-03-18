// src/app/models/tournament.model.ts
export type Tournament = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  participantsCount: number;
  activeParticipantsCount: number;
  prizePool: number;
  currency?: string;
  isActive: boolean;
}

export interface TournamentDetail extends Tournament {
  description?: string;
  location?: string;
  format?: string;
  numberOfParticipants: number;
  organizedBy?: string;
  streamingPlatform?: string;
  rules?: string;
  createdAt: string;
  updatedAt?: string;
  currentPhase?: string;
  qualificationStartDate: string;
  qualificationEndDate: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
}

export interface TournamentCreateUpdateRequest {
  name: string;
  description?: string;
  prizePool: number;
  currency?: string;
  location?: string;
  format?: string;
  numberOfParticipants: number;
  organizedBy?: string;
  streamingPlatform?: string;
  rules?: string;
  qualificationStartDate: string;
  qualificationEndDate: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
}

export interface ActiveTournamentDto {
  id: number;
  name?: string;
  qualificationStartDate: string;
  qualificationEndDate: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
  isEnrolled: boolean;
  enrollmentId?: number;
  isActive: boolean;
  currentPhase?: string;
}

export interface TournamentPlayerDto {
  playerId: number;
  playerName?: string;
  country?: string;
  alias?: string;
  gateway: number;
  gatewayName?: string;
  race?: string;
  rank?: string;
  rating?: number;
  wins: number;
  losses: number;
  standing?: number;
  totalGames: number;
  winRate: number;
  rankingPosition: number;
}

export interface ActiveTournamentWithPlayersDto {
  id: number;
  name?: string;
  description?: string;
  qualificationStartDate: string;
  qualificationEndDate: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
  prizePool: number;
  currency?: string;
  location?: string;
  format?: string;
  streamingPlatform?: string;
  organizedBy?: string;
  totalPlayers: number;
  currentPhase?: string;
  players?: TournamentPlayerDto[];
}