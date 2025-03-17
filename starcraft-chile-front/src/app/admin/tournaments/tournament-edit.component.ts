import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { TournamentCreateUpdateRequest } from '../../models/tournament.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
  template: `
    <div class="tournament-edit-container">
      <div class="dashboard-header">
        <img 
          src="/assets/logo.png" 
          alt="Chilean StarCraft Championship Logo" 
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

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha de Inicio</mat-label>
            <input matInput 
              [matDatepicker]="startDatePicker" 
              formControlName="startDate" 
              required
            >
            <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #startDatePicker></mat-datepicker>
            <mat-error *ngIf="tournamentForm.get('startDate')?.invalid">
              Fecha de inicio es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Fecha de Fin</mat-label>
            <input matInput 
              [matDatepicker]="endDatePicker" 
              formControlName="endDate" 
              required
            >
            <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #endDatePicker></mat-datepicker>
            <mat-error *ngIf="tournamentForm.get('endDate')?.invalid">
              Fecha de fin es requerida
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
      height: 60px;
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

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    /* Estilos de inputs */
    ::ng-deep .mat-mdc-form-field-outline {
      color: rgba(255,255,255,0.3) !important;
    }

    ::ng-deep .mat-mdc-form-field-label {
      color: rgba(255,255,255,0.6) !important;
    }

    ::ng-deep .mat-mdc-input-element {
      color: white !important;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }

    .save-button {
      background-color: #D52B1E !important;
      color: white !important;
    }

    .cancel-button {
      background-color: #666 !important;
      color: white !important;
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
    private route: ActivatedRoute
  ) {
    this.tournamentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      prizePool: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD'],
      location: [''],
      format: [''],
      numberOfParticipants: [0, [Validators.required, Validators.min(0)]],
      organizedBy: [''],
      streamingPlatform: [''],
      rules: ['']
    });
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
        this.tournamentForm.patchValue({
          name: tournament.name,
          description: tournament.description,
          startDate: new Date(tournament.startDate),
          endDate: new Date(tournament.endDate),
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
        startDate: this.tournamentForm.value.startDate.toISOString(),
        endDate: this.tournamentForm.value.endDate.toISOString()
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