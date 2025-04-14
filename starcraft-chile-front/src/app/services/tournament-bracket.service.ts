import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TournamentBracketService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener jugadores para un torneo
  getPlayers(tournamentId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/TournamentBracket/players/${tournamentId}`)
      .pipe(
        map(response => {
          // Verificar si la respuesta tiene la estructura esperada
          if (response && response.success && Array.isArray(response.data)) {
            return response.data;
          }
          // Si no tiene la estructura esperada, devolver un array vacío
          console.error('Estructura de respuesta inesperada:', response);
          return [];
        })
      );
  }

  // Obtener rondas de un torneo
  getRounds(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/TournamentBracket/rounds/${tournamentId}`);
  }

  // Crear una nueva ronda
  createRound(roundData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/TournamentBracket/rounds`, roundData);
  }

  // Obtener partidos de una ronda
  getMatchesForRound(roundId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/TournamentBracket/matches/round/${roundId}`);
  }

  // Crear un nuevo partido
  createMatch(matchData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/TournamentBracket/matches`, matchData);
  }

  // Registrar resultado de un partido
  recordMatchResult(matchId: number, resultData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/TournamentBracket/matches/${matchId}/result`, resultData);
  }

  // Generar bracket automáticamente
  generateBracket(tournamentId: number, generateData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/TournamentBracket/generate/${tournamentId}`, generateData);
  }

  // Procesar posiciones finales
  processFinalPositions(tournamentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/TournamentBracket/process-final-positions/${tournamentId}`, {});
  }
  updateMatch(matchId: number, matchData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/TournamentBracket/matches/${matchId}`, matchData);
  }
}