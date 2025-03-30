// src/app/services/player.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../../environments/environment';
import { PlayerProfileDto, GameProfileDto, UpdatePlayerProfileRequest, ApiResponse } from '../models/player-profile.model';
import { ActiveTournamentDto } from '../models/tournament.model';
import { RankingPlayer, ActiveTournamentData } from '../models/player.model';
import { PlayerPublicProfileDto } from '../models/player-public-profile.model';
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener perfil del jugador autenticado
  getPlayerProfile(): Observable<PlayerProfileDto> {
    return this.http.get<PlayerProfileDto>(`${this.apiUrl}/Player/profile`);
  }

  // Obtener perfil de un jugador específico por ID
  getPlayerById(id: number): Observable<PlayerProfileDto> {
    return this.http.get<PlayerProfileDto>(`${this.apiUrl}/Player/${id}`);
  }

  // Actualizar perfil del jugador
  updatePlayerProfile(request: UpdatePlayerProfileRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/Player/profile`, request);
  }

  // Obtener perfiles de juego del jugador
  getGameProfiles(): Observable<GameProfileDto[]> {
    return this.http.get<GameProfileDto[]>(`${this.apiUrl}/Player/game-profiles`);
  }

  // Obtener torneos activos
  getActiveTournaments(): Observable<ActiveTournamentDto[]> {
    return this.http.get<ActiveTournamentDto[]>(`${this.apiUrl}/Player/active-tournaments`);
  }
  // Agregar este método al servicio PlayerService
getPlayerPublicProfile(id: number): Observable<PlayerPublicProfileDto> {
    return this.http.get<PlayerPublicProfileDto>(`${this.apiUrl}/Player/players/${id}/public-profile`);
  }
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