// src/app/tournament/tournament-enrollment.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TournamentEnrollmentService } from '../services/tournament-enrollment.service';
import { PlayerService } from '../services/player.service';
import { GameProfileDto } from '../models/player-profile.model';
import { ActiveTournamentDto } from '../models/tournament.model';

@Component({
  selector: 'app-tournament-enrollment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="enrollment-container">
      <div class="header">
        <img 
          src="/assets/logo.png" 
          alt="Comunidad Starcraft CHILE Logo" 
          class="header-logo"
        />
        <h1>Inscripción a Torneo</h1>
      </div>

      <div class="back-link">
        <a [routerLink]="['/']" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Volver al Inicio
        </a>
      </div>

      <div class="content-section">
        <!-- Estado de carga o error -->
        <div *ngIf="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando información...</p>
        </div>

        <div *ngIf="errorMessage" class="error-container">
          <mat-icon class="error-icon">error</mat-icon>
          <p>{{ errorMessage }}</p>
          <button mat-raised-button color="primary" (click)="loadData()">Reintentar</button>
        </div>

        <!-- Si no hay torneos activos -->
        <div *ngIf="!isLoading && !errorMessage && (!activeTournaments || activeTournaments.length === 0)" class="no-tournaments">
          <mat-card class="info-card">
            <mat-card-content>
              <mat-icon class="info-icon">info</mat-icon>
              <h2>No hay torneos disponibles</h2>
              <p>Actualmente no hay torneos abiertos para inscripción. Por favor, revisa más tarde.</p>
              <button mat-raised-button color="primary" [routerLink]="['/']">Volver al Inicio</button>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Si ya está inscrito en un torneo activo -->
        <div *ngIf="!isLoading && !errorMessage && enrollmentStatus?.isEnrolled" class="already-enrolled">
          <mat-card class="info-card">
            <mat-card-content>
              <mat-icon class="success-icon">check_circle</mat-icon>
              <h2>Ya estás inscrito</h2>
              <p>Ya te has inscrito al torneo <strong>{{ enrollmentStatus.tournamentName }}</strong>.</p>
              <p *ngIf="enrollmentStatus.queueValidation">Tu inscripción está pendiente de validación.</p>
              <p *ngIf="enrollmentStatus.loadedPlayer">Tu perfil ha sido cargado en el torneo.</p>
              <p *ngIf="enrollmentStatus.alias">Participando como: <strong>{{ enrollmentStatus.alias }}</strong></p>
              
              <div class="status-details">
                <p>Fecha de inscripción: {{ enrollmentStatus.registeredDate | date:'dd-MM-yyyy' }}</p>
                <p>Estado: <span [ngClass]="{'status-active': enrollmentStatus.isActive, 'status-inactive': !enrollmentStatus.isActive}">
                  {{ enrollmentStatus.isActive ? 'Activo' : 'Inactivo' }}
                </span></p>
              </div>
              
              <button mat-raised-button color="primary" [routerLink]="['/profile']">Ver mi Perfil</button>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Formulario de inscripción a torneo -->
        <div *ngIf="!isLoading && !errorMessage && activeTournaments && activeTournaments.length > 0 && !enrollmentStatus?.isEnrolled" class="enrollment-form-container">
          <mat-card class="tournament-card" *ngFor="let tournament of activeTournaments">
            <mat-card-header>
              <mat-card-title>{{ tournament.name }}</mat-card-title>
              <mat-card-subtitle>
                <div class="tournament-phase">
                  {{ tournament.currentPhase || 'Fase de Clasificación' }}
                </div>
              </mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <div class="tournament-dates">
                <div class="date-section">
                  <h3>Clasificación:</h3>
                  <p>{{ tournament.qualificationStartDate | date:'dd-MM-yyyy' }} al {{ tournament.qualificationEndDate | date:'dd-MM-yyyy' }}</p>
                </div>
                <div class="date-section">
                  <h3>Torneo Principal:</h3>
                  <p>{{ tournament.tournamentStartDate | date:'dd-MM-yyyy' }} al {{ tournament.tournamentEndDate | date:'dd-MM-yyyy' }}</p>
                </div>
              </div>
              
              <form [formGroup]="enrollmentForm" (ngSubmit)="onSubmit(tournament.id)" class="enrollment-form">
                <h3>Información de Inscripción</h3>
                
                <div class="form-field">
                  <label for="alias">Alias en StarCraft:</label>
                  <input
                    type="text"
                    id="alias"
                    formControlName="alias"
                    placeholder="Tu nombre en el juego"
                    required
                  >
                  <div *ngIf="enrollmentForm.get('alias')?.invalid && enrollmentForm.get('alias')?.touched" class="validation-error">
                    Alias es requerido
                  </div>
                </div>
                
                <div class="form-field">
                  <label for="gateway">Gateway (Servidor):</label>
                  <select
                    id="gateway"
                    formControlName="gateway"
                    required
                  >
                    <option [ngValue]="null" disabled>Selecciona un servidor</option>
                    <option [ngValue]="30">Korea</option>
                    <option [ngValue]="45">Asia</option>
                    <option [ngValue]="11">U.S. East</option>
                    <option [ngValue]="10">U.S. West</option>
                    <option [ngValue]="20">Europe</option>
                  </select>
                  <div *ngIf="enrollmentForm.get('gateway')?.invalid && enrollmentForm.get('gateway')?.touched" class="validation-error">
                    Gateway es requerido
                  </div>
                </div>
                
                <!-- Si hay perfiles existentes, permitir seleccionar uno -->
                <div *ngIf="gameProfiles && gameProfiles.length > 0" class="existing-profiles">
                  <h4>O selecciona un perfil existente:</h4>
                  <div class="profiles-grid">
                    <div 
                      *ngFor="let profile of gameProfiles" 
                      class="profile-selector"
                      [class.selected]="selectedProfile === profile"
                      (click)="selectProfile(profile)"
                    >
                      <div class="profile-icon">
                        <img 
                          *ngIf="profile.race" 
                          [src]="getRaceIcon(profile.race)" 
                          [alt]="profile.race" 
                          class="race-icon"
                        >
                        <mat-icon *ngIf="!profile.race">person</mat-icon>
                      </div>
                      <div class="profile-info">
                        <span class="profile-name">{{ profile.alias }}</span>
                        <span class="profile-gateway">{{ getGatewayName(profile.gateway) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="form-actions">
                  <button 
                    type="submit"
                    mat-raised-button 
                    color="primary"
                    [disabled]="enrollmentForm.invalid || isSubmitting"
                  >
                    {{ isSubmitting ? 'ENVIANDO...' : 'INSCRIBIRME AL TORNEO' }}
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
        
        <!-- Confirmación de inscripción exitosa -->
        <div *ngIf="enrollmentSuccess" class="enrollment-success">
          <mat-card class="info-card">
            <mat-card-content>
              <mat-icon class="success-icon">check_circle</mat-icon>
              <h2>¡Inscripción Exitosa!</h2>
              <p>Te has inscrito correctamente al torneo <strong>{{ enrollmentSuccess.tournamentName }}</strong>.</p>
              <p>Tu inscripción será revisada por los administradores.</p>
              <div class="success-actions">
                <button mat-raised-button color="primary" [routerLink]="['/profile']">Ver mi Perfil</button>
                <button mat-raised-button [routerLink]="['/']">Volver al Inicio</button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #000000;
      color: white;
      font-family: 'Roboto', sans-serif;
    }

    .enrollment-container {
      padding: 20px;
      min-height: 100vh;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .header-logo {
      height: 70px;
      width: auto;
      margin-right: 20px;
    }

    .header h1 {
      color: white;
      font-family: 'Orbitron', sans-serif;
      margin: 0;
      font-size: 2rem;
    }

    .back-link {
      margin-bottom: 20px;
    }

    .back-button {
      display: flex;
      align-items: center;
      color: white;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;
    }

    .back-button:hover {
      color: #D52B1E;
    }

    .back-button mat-icon {
      margin-right: 8px;
    }

    .content-section {
      margin-top: 20px;
    }

    /* Cards de información y torneos */
    .info-card, .tournament-card {
      background-color: rgba(10, 10, 20, 0.7);
      color: white;
      border-left: 3px solid #d52b1e;
      margin-bottom: 20px;
    }

    .tournament-card {
      max-width: 800px;
      margin: 0 auto 20px;
    }

    ::ng-deep .mat-mdc-card-header {
      padding: 16px;
    }

    ::ng-deep .mat-mdc-card-title {
      color: white !important;
      font-size: 1.5rem !important;
      margin-bottom: 8px !important;
    }

    ::ng-deep .mat-mdc-card-subtitle {
      color: #aaa !important;
    }

    ::ng-deep .mat-mdc-card-content {
      padding: 16px !important;
    }

    /* Iconos informativos */
    .info-icon, .success-icon, .error-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .info-icon {
      color: #2196F3;
    }

    .success-icon {
      color: #4CAF50;
    }

    .error-icon {
      color: #F44336;
    }

    /* Estados de carga y error */
    .loading-container, .error-container, .no-tournaments, .already-enrolled, .enrollment-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
    }

    .loading-spinner {
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 4px solid #D52B1E;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Fechas del torneo */
    .tournament-dates {
      margin: 20px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .date-section {
      flex: 1;
      min-width: 200px;
    }

    .date-section h3 {
      color: #aaa;
      font-size: 1rem;
      margin-bottom: 5px;
    }

    .date-section p {
      margin: 0;
      padding-left: 10px;
      border-left: 2px solid #D52B1E;
    }

    .tournament-phase {
      display: inline-block;
      padding: 3px 8px;
      background-color: rgba(213, 43, 30, 0.3);
      color: white;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
    }

    /* Formulario de inscripción */
    .enrollment-form {
      background-color: rgba(20, 20, 40, 0.5);
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .enrollment-form h3 {
      margin-top: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 10px;
      margin-bottom: 20px;
      color: #D52B1E;
    }

    .form-field {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .form-field label {
      color: #aaa;
      font-size: 0.9rem;
    }

    .form-field input, .form-field select {
      width: 100%;
      padding: 12px;
      background-color: rgba(30, 30, 50, 0.5);
      border: none;
      color: white;
      font-size: 1rem;
      border-radius: 4px;
    }

    .form-field select {
      appearance: none;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6"><path d="M0 0l6 6 6-6z" fill="%23ffffff"/></svg>');
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 30px;
    }

    .validation-error {
      color: #ff6b6b;
      font-size: 0.85rem;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    button[type="submit"] {
      background-color: #D52B1E !important;
      color: white !important;
      font-weight: bold;
      padding: 8px 24px;
    }

    /* Estilos para perfiles existentes */
    .existing-profiles {
      margin-top: 20px;
    }

    .existing-profiles h4 {
      color: #aaa;
      margin-bottom: 10px;
    }

    .profiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 10px;
    }

    .profile-selector {
      display: flex;
      align-items: center;
      padding: 10px;
      background-color: rgba(30, 30, 50, 0.5);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .profile-selector:hover {
      background-color: rgba(30, 30, 50, 0.8);
    }

    .profile-selector.selected {
      border-color: #D52B1E;
      background-color: rgba(213, 43, 30, 0.2);
    }

    .profile-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }

    .race-icon {
      width: 30px;
      height: 30px;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
    }

    .profile-name {
      font-weight: bold;
    }

    .profile-gateway {
      font-size: 0.8rem;
      color: #aaa;
    }

    /* Estados para inscripciones existentes */
    .status-details {
      margin: 20px 0;
      padding: 10px;
      background-color: rgba(20, 20, 40, 0.5);
      border-radius: 4px;
    }

    .status-active {
      color: #4CAF50;
      font-weight: bold;
    }

    .status-inactive {
      color: #F44336;
      font-weight: bold;
    }

    .success-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .tournament-dates {
        flex-direction: column;
      }
      
      .profiles-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class TournamentEnrollmentComponent implements OnInit {
  activeTournaments: ActiveTournamentDto[] = [];
  gameProfiles: GameProfileDto[] = [];
  enrollmentForm: FormGroup;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  enrollmentStatus: any = null;
  enrollmentSuccess: any = null;
  selectedProfile: GameProfileDto | null = null;

  constructor(
    private fb: FormBuilder,
    private tournamentEnrollmentService: TournamentEnrollmentService,
    private playerService: PlayerService
  ) {
    this.enrollmentForm = this.fb.group({
      alias: ['', Validators.required],
      gateway: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';
    this.enrollmentSuccess = null;
    
    // Primero verificar si ya está inscrito en algún torneo
    this.tournamentEnrollmentService.getEnrollmentStatus().subscribe({
      next: (status) => {
        this.enrollmentStatus = status;
        
        // Si no está inscrito, cargar torneos activos y perfiles de juego
        if (!status.isEnrolled) {
          this.loadActiveTournaments();
          this.loadGameProfiles();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al verificar estado de inscripción:', err);
        // Si hay error en la verificación, intentar cargar torneos de todas formas
        this.loadActiveTournaments();
        this.loadGameProfiles();
      }
    });
  }

  loadActiveTournaments() {
    this.playerService.getActiveTournaments().subscribe({
      next: (tournaments) => {
        this.activeTournaments = tournaments;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar torneos activos:', err);
        this.errorMessage = 'No se pudieron cargar los torneos disponibles. Por favor, intenta más tarde.';
        this.isLoading = false;
      }
    });
  }

  loadGameProfiles() {
    this.playerService.getGameProfiles().subscribe({
      next: (profiles) => {
        this.gameProfiles = profiles;
      },
      error: (err) => {
        console.error('Error al cargar perfiles de juego:', err);
        // No mostramos error para no bloquear la inscripción manual
      }
    });
  }

  selectProfile(profile: GameProfileDto) {
    this.selectedProfile = profile;
    this.enrollmentForm.patchValue({
      alias: profile.alias,
      gateway: profile.gateway
    });
  }

  onSubmit(tournamentId: number) {
    if (this.enrollmentForm.valid) {
      this.isSubmitting = true;
      
      const enrollmentData = {
        alias: this.enrollmentForm.get('alias')?.value,
        gateway: this.enrollmentForm.get('gateway')?.value
      };
      
      this.tournamentEnrollmentService.enrollInTournament(enrollmentData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.enrollmentSuccess = response;
            // Limpiar formulario
            this.enrollmentForm.reset();
            this.selectedProfile = null;
          } else {
            this.errorMessage = response.message || 'Hubo un error en la inscripción. Por favor, intenta de nuevo.';
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error al inscribirse en el torneo:', err);
          
          if (err.status === 400) {
            this.errorMessage = 'Error en los datos de inscripción. Por favor, verifica la información.';
          } else if (err.status === 404) {
            this.errorMessage = 'El torneo no está disponible para inscripción.';
          } else {
            this.errorMessage = 'Error al inscribirse. Por favor, intenta de nuevo más tarde.';
          }
        }
      });
    }
  }

  getRaceIcon(race: string): string {
    const normalizedRace = race.toLowerCase();
    
    if (normalizedRace.includes('terran')) {
      return 'assets/races/terran.svg';
    } else if (normalizedRace.includes('zerg')) {
      return 'assets/races/zerg.svg';
    } else if (normalizedRace.includes('protoss')) {
      return 'assets/races/protoss.svg';
    } else if (normalizedRace.includes('random')) {
      return 'assets/races/random.svg';
    }
    
    return '';
  }

  getGatewayName(gatewayId: number): string {
    switch (gatewayId) {
      case 30: return 'Korea';
      case 45: return 'Asia';
      case 11: return 'U.S. East';
      case 10: return 'U.S. West';
      case 20: return 'Europe';
      default: return `Gateway ${gatewayId}`;
    }
  }
}