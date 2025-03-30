export type RankingPlayer = {
  alias?: string;
  rating?: number;
  gateway?: number;
  gateway_name?: string;
  rank?: string;
  race?: string;
};

// Nuevos modelos para el endpoint de torneo activo
export interface TournamentPlayer {
  playerId: number;
  playerName: string;
  country: string;
  alias: string;
  gateway: number;
  gatewayName: string;
  race: string;
  rank: string;
  rating: number;
  wins: number;
  losses: number;
  standing?: number;
  rankingPosition: number;
  qualificationPosition?: number;
  isQualified: boolean;
  totalGames: number;
  winRate: number;
  winRateFormatted: string;
}

export interface ActiveTournamentData {
  id: number;
  name: string;
  description: string;
  qualificationStartDate: string;
  qualificationEndDate: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
  prizePool: number;
  currency: string;
  location: string;
  format: string;
  streamingPlatform: string;
  organizedBy: string;
  rules: string;
  totalPlayers: number;
  totalQualifiedPlayers: number;
  minimumGames: number;
  currentPhase: string;
  players: TournamentPlayer[];
}