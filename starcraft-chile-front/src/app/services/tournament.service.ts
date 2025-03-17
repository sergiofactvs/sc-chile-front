import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import  environment  from '../../environments/environment';

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