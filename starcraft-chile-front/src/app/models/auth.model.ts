export type LoginResponse = {
    success: boolean;
    token: string;
    refreshToken: string;
    tokenExpiration: string;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      country: string;
      playerId: number;
    };
  };