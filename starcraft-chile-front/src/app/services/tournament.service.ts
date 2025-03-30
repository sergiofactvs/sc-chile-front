import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import  environment  from '../../environments/environment';
export interface QualifiedPlayer {
  playerId: number;
  playerName: string;
  country: string;
  alias: string;
  gateway: number;
  gatewayName: string;
  race: string;
  rank: string;
  rating: number;
  wins: number;
  losses: number;
  standing: number;
  rankingPosition: number;
  totalGames: number;
  winRate: number;
  winRateFormatted: string;
}

export interface QualifiedPlayersResponse {
  tournamentId: number;
  tournamentName: string;
  qualificationStartDate: string;
  qualificationEndDate: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
  currentPhase: string;
  minimumGames: number;
  totalQualifiedPlayers: number;
  players: QualifiedPlayer[];
}
@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener lista de torneos
  getTournaments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Admin/tournaments`);
  }

  // Obtener detalles de un torneo específico
  getTournamentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Admin/tournaments/${id}`);
  }

  // Crear nuevo torneo
  createTournament(tournamentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Admin/tournaments`, tournamentData);
  }

  // Actualizar torneo existente
  updateTournament(id: number, tournamentData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Admin/tournaments/${id}`, tournamentData);
  }

  // Eliminar torneo
  deleteTournament(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Admin/tournaments/${id}`);
  }
  
}
export class TournamentPlayerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de jugadores clasificados
   * @param minGames - Número mínimo de partidas requeridas (opcional)
   */
  getQualifiedPlayers(minGames?: number): Observable<QualifiedPlayersResponse> {
    let url = `${this.apiUrl}/TournamentEnrollment/qualified-players`;
    
    // Añadir query params si se proporciona un valor para minGames
    if (minGames) {
      url += `?minGames=${minGames}`;
    }
    
    return this.http.get<QualifiedPlayersResponse>(url);
  }

  /**
   * Obtiene información del torneo activo con sus jugadores
   */
  getActiveTournamentWithPlayers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/TournamentEnrollment/active-qualification-tournament`);
  }
}