export interface UserAdminDto {
    id: number;
    email: string;
    isActive: boolean;
    emailConfirmed: boolean;
    playerId: number;
    playerName: string;
    role: string;
    createdAt: string;
  }
  
  export interface AdminActionResponse {
    success: boolean;
    message?: string;
  }