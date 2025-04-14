// src/app/services/player-ranking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../../environments/environment';
import { GeneralRankingDtoPaginatedResultApiResponse } from '../models/player-ranking.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerRankingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get general ranking with pagination
   * @param page Page number (default: 1)
   * @param pageSize Number of items per page (default: 20)
   */
  getGeneralRanking(
    page: number = 1, 
    pageSize: number = 50
  ): Observable<GeneralRankingDtoPaginatedResultApiResponse> {
    return this.http.get<GeneralRankingDtoPaginatedResultApiResponse>(
      `${this.apiUrl}/PlayerRanking/general`, {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString()
        }
      }
    );
  }
}