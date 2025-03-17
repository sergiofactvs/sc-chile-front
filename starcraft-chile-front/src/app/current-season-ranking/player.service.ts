import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RankingPlayer } from '../models/player.model';
import environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRanking(limit: number = 10, offset: number = 0): Observable<RankingPlayer[]> {
    return this.http.get<RankingPlayer[]>(`${this.apiUrl}/Player/ranking`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    });
  }
}