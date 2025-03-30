// src/app/services/active-tournament.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../../environments/environment';
import { ActiveTournamentWithPlayersDto } from '../models/tournament.model';

@Injectable({
  providedIn: 'root'
})
export class ActiveTournamentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtener el torneo de clasificación activo con sus jugadores inscritos
   */
  getActiveTournamentWithPlayers(minGames: number = 20): Observable<ActiveTournamentWithPlayersDto> {
    return this.http.get<ActiveTournamentWithPlayersDto>(
      `${this.apiUrl}/TournamentEnrollment/active-qualification-tournament`, {
        params: {
          minGames: minGames.toString()
        }
      }
    );
  }
}