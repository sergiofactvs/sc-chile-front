// src/app/services/donation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../../environments/environment';
import { DonationDto, DonationDtoApiResponse } from '../models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtener información actual de donaciones
   */
  getDonationInfo(): Observable<DonationDtoApiResponse> {
    return this.http.get<DonationDtoApiResponse>(`${this.apiUrl}/Donation`);
  }
}