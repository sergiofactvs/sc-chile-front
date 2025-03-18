import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { PlayerService } from '../services/player.service';
import { PlayerProfileDto, GameProfileDto, UpdatePlayerProfileRequest, TournamentEnrollmentDto } from '../models/player-profile.model';


@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    DatePipe
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'dd-MM-yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'dd-MM-yyyy',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      },
    }
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <img 
          src="/assets/logo.png" 
          alt="Chilean StarCraft Championship Logo" 
          class="header-logo"
        />
        <h1>Perfil de Jugador</h1>
      </div>

      <div class="back-link">
        <a [routerLink]="['/']" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Volver al Inicio
        </a>
      </div>

      <div *ngIf="profile" class="profile-content">
        <mat-tabs>
          <!-- Información personal -->
          <mat-tab label="Información Personal">
            <div class="tab-content">
              <mat-card class="profile-card">
                <mat-card-header>
                  <mat-card-title>Datos Personales</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Nombre</mat-label>
                        <input matInput formControlName="firstName" required>
                        <mat-error *ngIf="profileForm.get('firstName')?.invalid">
                          Nombre es requerido
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Apellido</mat-label>
                        <input matInput formControlName="lastName" required>
                        <mat-error *ngIf="profileForm.get('lastName')?.invalid">
                          Apellido es requerido
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Fecha de Nacimiento</mat-label>
                        <input matInput [matDatepicker]="birthDatePicker" 
                          formControlName="birthDate" 
                          placeholder="dd-MM-yyyy" 
                          required>
                        <mat-datepicker-toggle matSuffix [for]="birthDatePicker"></mat-datepicker-toggle>
                        <mat-datepicker #birthDatePicker></mat-datepicker>
                        <mat-error *ngIf="profileForm.get('birthDate')?.invalid">
                          Fecha de nacimiento es requerida
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>País</mat-label>
                        <input matInput formControlName="country" required>
                        <mat-error *ngIf="profileForm.get('country')?.invalid">
                          País es requerido
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Descripción (opcional)</mat-label>
                      <textarea matInput formControlName="description" rows="4"></textarea>
                    </mat-form-field>

                    <div class="form-row form-actions">
                      <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || !profileForm.dirty">
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>

              <mat-card class="profile-card">
                <mat-card-header>
                  <mat-card-title>Cuenta de Usuario</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-row">
                    <span class="info-label">Correo electrónico:</span>
                    <span class="info-value">{{ profile.userAccount.email }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Estado de cuenta:</span>
                    <span class="info-value status-chip" [ngClass]="profile.userAccount.isActive ? 'active-status' : 'inactive-status'">
                      {{ profile.userAccount.isActive ? 'Activa' : 'Inactiva' }}
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Email confirmado:</span>
                    <span class="info-value status-chip" [ngClass]="profile.userAccount.emailConfirmed ? 'confirmed-status' : 'unconfirmed-status'">
                      {{ profile.userAccount.emailConfirmed ? 'Sí' : 'No' }}
                    </span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Rol:</span>
                    <span class="info-value role-chip">{{ profile.userAccount.role }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Último inicio de sesión:</span>
                    <span class="info-value">{{ profile.userAccount.lastLoginAt | date:'dd-MM-yyyy HH:mm' }}</span>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Perfiles de Juego -->
          <mat-tab label="Perfiles de Juego">
            <div class="tab-content" *ngIf="gameProfiles && gameProfiles.length > 0; else noGameProfiles">
              <div class="game-profiles-grid">
                <mat-card *ngFor="let gameProfile of gameProfiles" class="game-profile-card">
                  <mat-card-header>
                    <mat-card-title>{{ gameProfile.alias }}</mat-card-title>
                    <mat-card-subtitle>{{ gameProfile.gatewayName }}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="profile-stats">
                      <div class="stat-item">
                        <div class="stat-label">Raza</div>
                        <div class="stat-value race-value">
                          <img *ngIf="gameProfile.race" 
                            [src]="getRaceIcon(gameProfile.race)" 
                            [alt]="gameProfile.race" 
                            class="race-icon">
                          {{ gameProfile.race || 'No especificada' }}
                        </div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-label">Rango</div>
                        <div class="stat-value">{{ gameProfile.rank || 'No rankeado' }}</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-label">Rating</div>
                        <div class="stat-value">{{ gameProfile.rating || 'N/A' }}</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-label">Victorias</div>
                        <div class="stat-value wins">{{ gameProfile.wins }}</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-label">Derrotas</div>
                        <div class="stat-value losses">{{ gameProfile.losses }}</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-label">Ratio</div>
                        <div class="stat-value">{{ calculateWinRatio(gameProfile.wins, gameProfile.losses) }}%</div>
                      </div>
                      <div class="stat-item full-width">
                        <div class="stat-label">Última actualización</div>
                        <div class="stat-value">{{ gameProfile.lastUpdated | date:'dd-MM-yyyy HH:mm' }}</div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
            <ng-template #noGameProfiles>
              <div class="empty-state">
                <mat-icon class="empty-icon">videogame_asset</mat-icon>
                <p>No tienes perfiles de juego registrados.</p>
              </div>
            </ng-template>
          </mat-tab>

          <!-- Torneos -->
          <mat-tab label="Torneos">
            <div class="tab-content" *ngIf="tournamentEnrollments && tournamentEnrollments.length > 0; else noTournaments">
              <div class="tournaments-list">
                <mat-card *ngFor="let enrollment of tournamentEnrollments" class="tournament-card">
                  <mat-card-header>
                    <mat-card-title>{{ enrollment.tournamentName }}</mat-card-title>
                    <mat-card-subtitle>
                      <span class="enrollment-status" [ngClass]="getStatusClass(enrollment)">
                        {{ enrollment.enrollmentStatus || (enrollment.isActive ? 'Activo' : 'Inactivo') }}
                      </span>
                    </mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="tournament-phases">
                      <div class="phase">
                        <div class="phase-title">Fase de Clasificación</div>
                        <div class="phase-dates">
                          {{ enrollment.qualificationStartDate | date:'dd-MM-yyyy' }} - 
                          {{ enrollment.qualificationEndDate | date:'dd-MM-yyyy' }}
                        </div>
                      </div>
                      <div class="phase">
                        <div class="phase-title">Fase Principal</div>
                        <div class="phase-dates">
                          {{ enrollment.tournamentStartDate | date:'dd-MM-yyyy' }} - 
                          {{ enrollment.tournamentEndDate | date:'dd-MM-yyyy' }}
                        </div>
                      </div>
                    </div>
                    <div class="tournament-info">
                      <div class="info-item">
                        <span class="info-label">Alias:</span>
                        <span class="info-value">{{ enrollment.alias }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Gateway:</span>
                        <span class="info-value">{{ enrollment.gatewayName }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Inscrito el:</span>
                        <span class="info-value">{{ enrollment.registeredDate | date:'dd-MM-yyyy' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Fase actual:</span>
                        <span class="info-value">{{ enrollment.currentPhase || 'Sin iniciar' }}</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
            <ng-template #noTournaments>
              <div class="empty-state">
                <mat-icon class="empty-icon">emoji_events</mat-icon>
                <p>No estás inscrito en ningún torneo actualmente.</p>
                <a [routerLink]="['/']" class="action-link">Ver torneos disponibles</a>
              </div>
            </ng-template>
          </mat-tab>
        </mat-tabs>
      </div>

      <div *ngIf="!profile && !error" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon class="error-icon">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="loadProfile()">Reintentar</button>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      background-color: #000000;
      color: white;
      min-height: 100vh;
    }

    .profile-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .header-logo {
      height: 60px;
      width: auto;
      margin-right: 20px;
    }

    .profile-header h1 {
      margin: 0;
      font-size: 2rem;
      color: white;
      font-family: 'Orbitron', sans-serif;
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

    .profile-content {
      margin-top: 20px;
    }

    /* Estilos de las pestañas */
    ::ng-deep .mat-mdc-tab-header {
      background-color: rgba(10, 10, 20, 0.7);
      border-radius: 8px 8px 0 0;
      border-left: 3px solid #D52B1E;
    }

    ::ng-deep .mat-mdc-tab-label-content {
      color: white !important;
    }

    ::ng-deep .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
      color: #D52B1E !important;
    }

    ::ng-deep .mat-mdc-tab-body-content {
      background-color: rgba(10, 10, 20, 0.7);
      border-radius: 0 0 8px 8px;
      border-left: 3px solid #D52B1E;
      padding: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    /* Estilos de las tarjetas */
    .profile-card {
      background-color: rgba(30, 30, 50, 0.5) !important;
      color: white;
      margin-bottom: 20px;
      border-radius: 8px;
    }

    ::ng-deep .mat-mdc-card-header {
      padding: 16px 16px 0 16px;
    }

    ::ng-deep .mat-mdc-card-title {
      color: white !important;
    }

    ::ng-deep .mat-mdc-card-subtitle {
      color: #aaa !important;
    }

    /* Estilos del formulario */
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .form-row mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .full-width {
      width: 100%;
    }

    /* Estilos de los campos de formulario */
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      height: 0;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: rgba(30, 30, 50, 0.5) !important;
    }

    ::ng-deep .mat-mdc-form-field.mat-form-field-appearance-outline .mat-mdc-text-field-wrapper {
      padding-bottom: 0;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: rgba(255,255,255,0.3) !important;
    }

    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick {
      color: #d52b1e !important;
    }

    ::ng-deep .mat-mdc-form-field-label {
      color: rgba(255,255,255,0.6) !important;
    }

    ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
      color: rgba(255,255,255,0.6) !important;
    }

    ::ng-deep .mat-mdc-form-field-infix {
      color: white !important;
    }

    ::ng-deep .mat-mdc-input-element, 
    ::ng-deep .mat-mdc-select-value-text, 
    ::ng-deep textarea.mat-mdc-input-element {
      color: white !important;
    }

    ::ng-deep .mat-mdc-select-arrow-wrapper {
      color: white;
    }

    ::ng-deep .mat-mdc-form-field-error {
      color: #ff6b6b !important;
    }

    ::ng-deep .mat-datepicker-toggle {
      color: rgba(255,255,255,0.7) !important;
    }

    /* Estilos para los botones */
    .form-actions {
      justify-content: flex-end;
      margin-top: 10px;
    }

    ::ng-deep .mat-mdc-raised-button.mat-primary {
      background-color: #D52B1E !important;
    }

    /* Estilos para la información del usuario */
    .info-row {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }

    .info-label {
      font-weight: bold;
      color: #aaa;
      min-width: 180px;
    }

    .info-value {
      color: white;
    }

    .status-chip {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    .active-status {
      background-color: rgba(76, 175, 80, 0.3);
      color: #4CAF50;
    }

    .inactive-status {
      background-color: rgba(244, 67, 54, 0.3);
      color: #F44336;
    }

    .confirmed-status {
      background-color: rgba(76, 175, 80, 0.3);
      color: #4CAF50;
    }

    .unconfirmed-status {
      background-color: rgba(244, 67, 54, 0.3);
      color: #F44336;
    }

    .role-chip {
      background-color: rgba(33, 150, 243, 0.3);
      color: #2196F3;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    /* Estilos para los perfiles de juego */
    .game-profiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .game-profile-card {
      background-color: rgba(30, 30, 50, 0.5) !important;
      color: white;
      height: 100%;
    }

    .profile-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 15px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .full-width {
      grid-column: span 2;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #aaa;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 1.1rem;
      font-weight: bold;
    }

    .race-value {
      display: flex;
      align-items: center;
    }

    .race-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .wins {
      color: #4CAF50;
    }

    .losses {
      color: #F44336;
    }

    /* Estilos para los torneos */
    .tournaments-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .tournament-card {
      background-color: rgba(30, 30, 50, 0.5) !important;
      color: white;
      height: 100%;
    }

    .enrollment-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    .status-active {
      background-color: rgba(76, 175, 80, 0.3);
      color: #4CAF50;
    }

    .status-inactive {
      background-color: rgba(244, 67, 54, 0.3);
      color: #F44336;
    }

    .status-pending {
      background-color: rgba(255, 193, 7, 0.3);
      color: #FFC107;
    }

    .tournament-phases {
      margin-top: 15px;
      margin-bottom: 15px;
    }

    .phase {
      margin-bottom: 10px;
    }

    .phase-title {
      font-weight: bold;
      color: #aaa;
      margin-bottom: 5px;
    }

    .phase-dates {
      padding-left: 10px;
      border-left: 2px solid #D52B1E;
    }

    .tournament-info {
      margin-top: 15px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    /* Estados vacíos */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 20px;
      color: #aaa;
    }

    .action-link {
      margin-top: 15px;
      color: #D52B1E;
      text-decoration: none;
      font-weight: bold;
    }

    /* Loading y error */
    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
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

    .error-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #F44336;
      margin-bottom: 20px;
    }

    /* Responsivo */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }

      .profile-stats, .tournament-info {
        grid-template-columns: 1fr;
      }

      .full-width {
        grid-column: auto;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .info-label {
        margin-bottom: 5px;
      }
    }
  `]
})
export class PlayerProfileComponent implements OnInit {
  profile: PlayerProfileDto | null = null;
  gameProfiles: GameProfileDto[] = [];
  tournamentEnrollments: TournamentEnrollmentDto[] = [];
  profileForm: FormGroup;
  error: string | null = null;
  
  constructor(
    private playerService: PlayerService,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('es-CL');
    
    this.profileForm = this.fb.group({
      playerId: [0],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', Validators.required],
      country: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
    this.loadGameProfiles();
  }

  loadProfile() {
    this.error = null;
    this.playerService.getPlayerProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.tournamentEnrollments = profile.tournamentEnrollments || [];
        
        // Actualizar formulario con datos del perfil
        this.profileForm.patchValue({
          playerId: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthDate: new Date(profile.birthDate),
          country: profile.country,
          description: profile.description
        });
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información de tu perfil. Por favor, intenta de nuevo.';
        console.error('Error cargando perfil:', err);
      }
    });
  }

  loadGameProfiles() {
    this.playerService.getGameProfiles().subscribe({
      next: (profiles) => {
        this.gameProfiles = profiles;
      },
      error: (err) => {
        console.error('Error cargando perfiles de juego:', err);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const updateRequest: UpdatePlayerProfileRequest = {
        ...formValue,
        birthDate: formValue.birthDate.toISOString()
      };

      this.playerService.updatePlayerProfile(updateRequest).subscribe({
        next: (response) => {
          if (response.success) {
            // Actualizar perfil local
            if (this.profile) {
              this.profile.firstName = updateRequest.firstName;
              this.profile.lastName = updateRequest.lastName;
              this.profile.birthDate = updateRequest.birthDate;
              this.profile.country = updateRequest.country;
              this.profile.description = updateRequest.description;
            }
            
            // Resetear estado del formulario
            this.profileForm.markAsPristine();
            
            // Mostrar mensaje de éxito (aquí podrías agregar un mensaje toast)
            alert('Perfil actualizado correctamente');
          } else {
            alert(`Error: ${response.message}`);
          }
        },
        error: (err) => {
          console.error('Error actualizando perfil:', err);
          alert('No se pudo actualizar el perfil');
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

  calculateWinRatio(wins: number, losses: number): string {
    if (wins === 0 && losses === 0) {
      return '0';
    }
    
    const total = wins + losses;
    const ratio = (wins / total) * 100;
    return ratio.toFixed(1);
  }

  getStatusClass(enrollment: TournamentEnrollmentDto): string {
    if (enrollment.enrollmentStatus) {
      const status = enrollment.enrollmentStatus.toLowerCase();
      if (status.includes('active') || status.includes('activo')) {
        return 'status-active';
      } else if (status.includes('pending') || status.includes('pendiente')) {
        return 'status-pending';
      } else {
        return 'status-inactive';
      }
    }
    
    return enrollment.isActive ? 'status-active' : 'status-inactive';
  }
}