// src/app/landing/landing.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';
import { ActiveTournamentService } from '../services/active-tournament.service';
import { TournamentEnrollmentService } from '../services/tournament-enrollment.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QualifiedPlayersComponent } from '../tournament/qualified-players.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatMenuModule,
    MatIconModule,
    RouterModule,
    QualifiedPlayersComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = '';
  primaryAlias: string = '';
  isLoadingTournament: boolean = true;
  activeTournament: any = null;
  isUserEnrolled: boolean = false;
  
  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    private activeTournamentService: ActiveTournamentService,
    private tournamentEnrollmentService: TournamentEnrollmentService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit() {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = !!this.authService.getToken();
    
    // Obtener información del usuario si está autenticado
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName() || 'Usuario';
      this.loadPlayerAlias();
      this.checkEnrollmentStatus();
    }
    
    // Suscribirse a cambios en el estado de autenticación
    this.authService.isAuthenticated.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.userName = this.authService.getUserName() || 'Usuario';
        this.loadPlayerAlias();
        this.checkEnrollmentStatus();
      } else {
        this.userName = '';
        this.primaryAlias = '';
        this.isUserEnrolled = false;
      }
    });
    
    // Cargar torneo activo
    this.loadActiveTournament();
  }
  getSafeChallongeUrl(url: string): SafeResourceUrl {
    // Añadir "/module" al final de la URL si no lo tiene ya
    if (url && !url.endsWith('/module')) {
      url = url + '/module?show_tournament_name=1&show_final_results=1&show_standings=1';
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  loadPlayerAlias() {
    this.playerService.getGameProfiles().subscribe({
      next: (profiles) => {
        if (profiles && profiles.length > 0) {
          // Usar el primer alias como principal
          this.primaryAlias = profiles[0].alias || '';
        }
      },
      error: (err) => {
        console.error('Error al cargar perfiles de juego:', err);
      }
    });
  }
  
  loadActiveTournament() {
    this.isLoadingTournament = true;
    this.activeTournamentService.getActiveTournamentWithPlayers().subscribe({
      next: (tournament) => {
        this.activeTournament = tournament;
        this.isLoadingTournament = false;
      },
      error: (err) => {
        // Si es 404, significa que no hay torneo activo (no es un error)
        if (err.status === 404) {
          this.activeTournament = null;
        } else {
          console.error('Error al cargar torneo activo:', err);
        }
        this.isLoadingTournament = false;
      }
    });
  }
  
  checkEnrollmentStatus() {
    if (!this.isAuthenticated) return;
    
    this.tournamentEnrollmentService.getEnrollmentStatus().subscribe({
      next: (status) => {
        this.isUserEnrolled = status.isEnrolled;
      },
      error: (err) => {
        console.error('Error al verificar estado de inscripción:', err);
      }
    });
  }
  
  logout() {
    this.authService.logout();
    // La suscripción en ngOnInit actualizará la UI
  }
}