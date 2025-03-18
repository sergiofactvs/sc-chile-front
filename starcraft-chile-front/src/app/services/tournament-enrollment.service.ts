// src/app/services/tournament-enrollment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../../environments/environment';

export interface TournamentEnrollmentRequest {
  alias: string;
  gateway: number;
}

export interface EnrollmentResponse {
  success: boolean;
  message?: string;
  tournamentId?: number;
  tournamentName?: string;
}

export interface EnrollmentStatusResponse {
  success: boolean;
  isEnrolled: boolean;
  isActive?: boolean;
  queueValidation?: boolean;
  loadedPlayer?: boolean;
  message?: string;
  tournamentId?: number;
  tournamentName?: string;
  registeredDate?: string;
  alias?: string;
  gateway?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TournamentEnrollmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Inscribir jugador en un torneo activo
   */
  enrollInTournament(enrollmentData: TournamentEnrollmentRequest): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(`${this.apiUrl}/TournamentEnrollment/enroll`, enrollmentData);
  }

  /**
   * Obtener estado de inscripción del jugador actual
   */
  getEnrollmentStatus(): Observable<EnrollmentStatusResponse> {
    return this.http.get<EnrollmentStatusResponse>(`${this.apiUrl}/TournamentEnrollment/status`);
  }
}