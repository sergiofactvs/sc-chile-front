// src/app/current-season-ranking/player.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RankingPlayer, ActiveTournamentData } from '../models/player.model';
import environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método original para mantener compatibilidad
  getRanking(limit: number = 10, offset: number = 0): Observable<RankingPlayer[]> {
    return this.http.get<RankingPlayer[]>(`${this.apiUrl}/Player/ranking`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    });
  }

  // Nuevo método para obtener datos del torneo activo con clasificación
  getActiveTournamentRanking(minGames: number = 20): Observable<ActiveTournamentData> {
    return this.http.get<ActiveTournamentData>(
      `${this.apiUrl}/TournamentEnrollment/active-qualification-tournament`, {
        params: {
          minGames: minGames.toString()
        }
      }
    );
  }
}