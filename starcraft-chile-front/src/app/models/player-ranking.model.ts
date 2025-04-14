// src/app/models/player-ranking.model.ts
export interface GeneralRankingDto {
    rank: number;
    playerId: number;
    playerName: string;
    playerAlias?: string;
    country?: string;
    totalPoints: number;
    tournamentPoints: number;
    participationPoints: number;
    race?: string;
  }
  
  export interface GeneralRankingDtoPaginatedResult {
    items: GeneralRankingDto[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }
  
  export interface GeneralRankingDtoPaginatedResultApiResponse {
    success: boolean;
    message?: string;
    data: GeneralRankingDtoPaginatedResult;
  }