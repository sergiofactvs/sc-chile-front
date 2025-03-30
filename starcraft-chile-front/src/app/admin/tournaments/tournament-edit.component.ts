import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { TournamentCreateUpdateRequest } from '../../models/tournament.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tournament-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
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
    <div class="tournament-edit-container">
      <div class="dashboard-header">
        <img 
          src="/assets/logo.png" 
          alt="Comunidad Starcraft CHILE Logo" 
          class="dashboard-logo"
        />
        <h1>{{ isNewTournament ? 'Crear' : 'Editar' }} Torneo</h1>
      </div>

      <form [formGroup]="tournamentForm" (ngSubmit)="onSubmit()" class="tournament-form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Nombre del Torneo</mat-label>
            <input matInput formControlName="name" required>
            <mat-error *ngIf="tournamentForm.get('name')?.invalid">
              Nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Descripción (Opcional)</mat-label>
            <textarea matInput formControlName="description"></textarea>
          </mat-form-field>
        </div>

        <div class="form-section-title">Fase Clasificatoria</div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha Inicio de Clasificación</mat-label>
            <input matInput 
              [matDatepicker]="qualificationStartDatePicker" 
              formControlName="qualificationStartDate" 
              placeholder="dd-MM-yyyy"
              required
            >
            <mat-datepicker-toggle matSuffix [for]="qualificationStartDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #qualificationStartDatePicker></mat-datepicker>
            <mat-error *ngIf="tournamentForm.get('qualificationStartDate')?.invalid">
              Fecha de inicio de clasificación es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Fecha Fin de Clasificación</mat-label>
            <input matInput 
              [matDatepicker]="qualificationEndDatePicker" 
              formControlName="qualificationEndDate" 
              placeholder="dd-MM-yyyy"
              required
            >
            <mat-datepicker-toggle matSuffix [for]="qualificationEndDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #qualificationEndDatePicker></mat-datepicker>
            <mat-error *ngIf="tournamentForm.get('qualificationEndDate')?.invalid">
              Fecha de fin de clasificación es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-section-title">Fase Principal del Torneo</div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha Inicio del Torneo</mat-label>
            <input matInput 
              [matDatepicker]="tournamentStartDatePicker" 
              formControlName="tournamentStartDate" 
              placeholder="dd-MM-yyyy"
              required
            >
            <mat-datepicker-toggle matSuffix [for]="tournamentStartDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #tournamentStartDatePicker></mat-datepicker>
            <mat-error *ngIf="tournamentForm.get('tournamentStartDate')?.invalid">
              Fecha de inicio del torneo es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Fecha Fin del Torneo</mat-label>
            <input matInput 
              [matDatepicker]="tournamentEndDatePicker" 
              formControlName="tournamentEndDate" 
              placeholder="dd-MM-yyyy"
              required
            >
            <mat-datepicker-toggle matSuffix [for]="tournamentEndDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #tournamentEndDatePicker></mat-datepicker>
            <mat-error *ngIf="tournamentForm.get('tournamentEndDate')?.invalid">
              Fecha de fin del torneo es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Premio Total</mat-label>
            <input matInput 
              type="number" 
              formControlName="prizePool" 
              required
            >
            <mat-error *ngIf="tournamentForm.get('prizePool')?.invalid">
              Premio es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Moneda</mat-label>
            <mat-select formControlName="currency">
              <mat-option value="USD">USD</mat-option>
              <mat-option value="CLP">CLP</mat-option>
              <mat-option value="EUR">EUR</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Ubicación</mat-label>
            <input matInput formControlName="location">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Formato</mat-label>
            <mat-select formControlName="format">
              <mat-option value="Single Elimination">Single Elimination</mat-option>
              <mat-option value="Double Elimination">Double Elimination</mat-option>
              <mat-option value="Round Robin">Round Robin</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Número de Participantes</mat-label>
            <input 
              matInput 
              type="number" 
              formControlName="numberOfParticipants" 
              required
            >
            <mat-error *ngIf="tournamentForm.get('numberOfParticipants')?.invalid">
              Número de participantes es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Organizado Por</mat-label>
            <input matInput formControlName="organizedBy">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Plataforma de Streaming</mat-label>
            <input matInput formControlName="streamingPlatform">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Link Challonge Torneo</mat-label>
            <input matInput formControlName="challonge">
          </mat-form-field>          
        </div>
        <div class="form-row">     
          <mat-form-field appearance="outline">
            <mat-label>Reglas</mat-label>
            <textarea matInput formControlName="rules"></textarea>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button 
            mat-raised-button 
            class="save-button"
            type="submit"
            [disabled]="tournamentForm.invalid"
          >
            {{ isNewTournament ? 'Crear Torneo' : 'Guardar Cambios' }}
          </button>
          <button 
            mat-raised-button 
            class="cancel-button"
            type="button"
            (click)="onCancel()"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .tournament-edit-container {
      padding: 20px;
      background-color: #000000;
      color: white;
      min-height: 100vh;
    }

    .dashboard-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .dashboard-logo {
      height: 70px;
      width: auto;
      margin-right: 20px;
    }

    .dashboard-header h1 {
      color: white;
      font-family: 'Orbitron', sans-serif;
      margin: 0;
    }

    .tournament-form {
      background-color: rgba(10, 10, 20, 0.7);
      border-left: 3px solid #d52b1e;
      padding: 30px;
      border-radius: 8px;
    }

    .form-section-title {
      color: white;
      font-weight: bold;
      margin: 20px 0 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      font-size: 1.1rem;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    /* Estilos para los form fields de Material */
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

    /* Estilos para los botones de acción */
    .form-actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }

    .save-button {
      background-color: #D52B1E !important;
      color: white !important;
      font-weight: bold;
      padding: 8px 24px;
    }

    .cancel-button {
      background-color: #444 !important;
      color: white !important;
      padding: 8px 24px;
    }

    /* Estilos del calendario */
    ::ng-deep .mat-calendar {
      background-color: #1a1a2e !important;
      color: white !important;
    }

    ::ng-deep .mat-calendar-body-selected {
      background-color: #D52B1E !important;
      color: white !important;
    }

    ::ng-deep .mat-calendar-body-cell-content {
      color: white !important;
    }

    ::ng-deep .mat-calendar-body-disabled > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected) {
      color: rgba(255,255,255,0.4) !important;
    }

    ::ng-deep .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected) {
      background-color: rgba(213, 43, 30, 0.3) !important;
    }

    ::ng-deep .mat-calendar-table-header,
    ::ng-deep .mat-calendar-body-label {
      color: rgba(255,255,255,0.7) !important;
    }
    
    ::ng-deep .mat-calendar-arrow {
      border-top-color: white !important;
    }

    ::ng-deep .mat-calendar-previous-button,
    ::ng-deep .mat-calendar-next-button,
    ::ng-deep .mat-calendar-period-button {
      color: white !important;
    }
    
    ::ng-deep .mat-datepicker-content {
      background-color: #1a1a2e !important;
      color: white !important;
    }
    
    ::ng-deep .mat-calendar-controls {
      color: white !important;
    }
    
    ::ng-deep .mat-calendar-body-today:not(.mat-calendar-body-selected) {
      border-color: rgba(255,255,255,0.5) !important;
    }
  `]
})
export class TournamentEditComponent implements OnInit {
  tournamentForm: FormGroup;
  isNewTournament: boolean = true;
  tournamentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.tournamentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      qualificationStartDate: ['', Validators.required],
      qualificationEndDate: ['', Validators.required],
      tournamentStartDate: ['', Validators.required],
      tournamentEndDate: ['', Validators.required],
      prizePool: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD'],
      location: [''],
      format: [''],
      numberOfParticipants: [0, [Validators.required, Validators.min(0)]],
      organizedBy: [''],
      streamingPlatform: [''],
      rules: ['']
    });
    
    // Configurar el formato local de fechas
    this.dateAdapter.setLocale('es-CL');
  }

  ngOnInit() {
    // Verificar si es edición o creación
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isNewTournament = false;
        this.tournamentId = +id;
        this.loadTournamentDetails(this.tournamentId);
      }
    });
  }

  loadTournamentDetails(id: number) {
    this.tournamentService.getTournamentById(id).subscribe({
      next: (tournament) => {
        // Convertir string a objeto Date para los campos de fecha
        const qualificationStartDate = new Date(tournament.qualificationStartDate);
        const qualificationEndDate = new Date(tournament.qualificationEndDate);
        const tournamentStartDate = new Date(tournament.tournamentStartDate);
        const tournamentEndDate = new Date(tournament.tournamentEndDate);
        
        this.tournamentForm.patchValue({
          name: tournament.name,
          description: tournament.description,
          qualificationStartDate: qualificationStartDate,
          qualificationEndDate: qualificationEndDate,
          tournamentStartDate: tournamentStartDate,
          tournamentEndDate: tournamentEndDate,
          prizePool: tournament.prizePool,
          currency: tournament.currency || 'USD',
          location: tournament.location,
          format: tournament.format,
          numberOfParticipants: tournament.numberOfParticipants,
          organizedBy: tournament.organizedBy,
          streamingPlatform: tournament.streamingPlatform,
          rules: tournament.rules
        });
      },
      error: (error) => {
        console.error('Error al cargar detalles del torneo', error);
        // Manejar error (mostrar mensaje al usuario)
      }
    });
  }

  onSubmit() {
    if (this.tournamentForm.valid) {
      const tournamentData: TournamentCreateUpdateRequest = {
        ...this.tournamentForm.value,
        qualificationStartDate: this.tournamentForm.value.qualificationStartDate.toISOString(),
        qualificationEndDate: this.tournamentForm.value.qualificationEndDate.toISOString(),
        tournamentStartDate: this.tournamentForm.value.tournamentStartDate.toISOString(),
        tournamentEndDate: this.tournamentForm.value.tournamentEndDate.toISOString()
      };

      if (this.isNewTournament) {
        this.tournamentService.createTournament(tournamentData).subscribe({
          next: () => {
            this.router.navigate(['/admin/tournaments']);
          },
          error: (error) => {
            console.error('Error al crear torneo', error);
            // Manejar error (mostrar mensaje al usuario)
          }
        });
      } else {
        if (this.tournamentId) {
          this.tournamentService.updateTournament(this.tournamentId, tournamentData).subscribe({
            next: () => {
              this.router.navigate(['/admin/tournaments']);
            },
            error: (error) => {
              console.error('Error al actualizar torneo', error);
              // Manejar error (mostrar mensaje al usuario)
            }
          });
        }
      }
    }
  }

  onCancel() {
    this.router.navigate(['/admin/tournaments']);
  }
}