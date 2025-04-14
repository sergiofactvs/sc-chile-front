// src/app/models/donation.model.ts
export interface DonationDto {
    id: number;
    totalAmount: number;
    goalAmount: number;
    currency: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    description: string;
    percentageCompleted: number;
    isCurrentPeriod: boolean;
  }
  
  export interface DonationDtoApiResponse {
    success: boolean;
    message?: string;
    data: DonationDto;
  }