export interface PlayerProfileDto {
    id: number;
    firstName: string;
    lastName: string;     
    country: string;
    aliases?: string;
    description?: string;
    createdAt: string;
    userAccount: UserAccountDto;
    tournamentEnrollments?: TournamentEnrollmentDto[];
  }
  
  export interface UserAccountDto {
    id: number;
    email: string;
    isActive: boolean;
    emailConfirmed: boolean;
    role: string;
    lastLoginAt?: string;
  }
  
  export interface TournamentEnrollmentDto {
    id: number;
    tournamentId: number;
    tournamentName?: string;
    registeredDate: string;
    isActive: boolean;
    queueValidation: boolean;
    loadedPlayer: boolean;
    alias?: string;
    gateway: number;
    gatewayName?: string;
    currentPhase?: string;
    qualificationStartDate: string;
    qualificationEndDate: string;
    tournamentStartDate: string;
    tournamentEndDate: string;
    enrollmentStatus?: string;
  }
  
  export interface GameProfileDto {
    id: number;
    alias?: string;
    gateway: number;
    gatewayName?: string;
    rank?: string;
    race?: string;
    rating?: number;
    standing?: number;
    wins: number;
    losses: number;
    lastUpdated: string;
  }
  
  export interface UpdatePlayerProfileRequest {
    playerId: number;
    firstName: string;
    lastName: string;    
    country: string;
    description?: string;
    aliases: string;
  }
  
  export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
  }