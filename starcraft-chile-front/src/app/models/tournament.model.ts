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
  }
  
  export interface TournamentCreateUpdateRequest {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    prizePool: number;
    currency?: string;
    location?: string;
    format?: string;
    numberOfParticipants: number;
    organizedBy?: string;
    streamingPlatform?: string;
    rules?: string;
  }