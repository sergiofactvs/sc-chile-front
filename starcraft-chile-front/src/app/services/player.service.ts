import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../../environments/environment';
import { PlayerProfileDto, GameProfileDto, UpdatePlayerProfileRequest, ApiResponse } from '../models/player-profile.model';

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
  getActiveTournaments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Player/active-tournaments`);
  }
}