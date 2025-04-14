// src/app/admin/tournaments/tournament-bracket/record-match-result-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { TournamentMatchDto, RecordMatchResultDto } from '../../../models/tournament-bracket.model';

@Component({
  selector: 'app-record-match-result-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule
  ],
  template: `
    <h2 mat-dialog-title>Registrar Resultado</h2>
    <div mat-dialog-content>
      <form [formGroup]="resultForm">
        <div class="match-info">
          <div class="match-players">
            <div class="player">
              <strong>{{ data.player1Name }}</strong>
            </div>
            <div class="vs">vs</div>
            <div class="player">
              <strong>{{ data.player2Name }}</strong>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <mat-label>Ganador</mat-label>
          <mat-radio-group formControlName="winnerId" class="radio-group">
            <mat-radio-button [value]="data.player1Id">{{ data.player1Name }}</mat-radio-button>
            <mat-radio-button [value]="data.player2Id">{{ data.player2Name }}</mat-radio-button>
          </mat-radio-group>
          <mat-error *ngIf="resultForm.get('winnerId')?.hasError('required') && resultForm.get('winnerId')?.touched">
            Debe seleccionar un ganador
          </mat-error>
        </div>
        
        <div class="score-inputs">
          <mat-form-field appearance="outline">
            <mat-label>Puntuación {{ data.player1Name }}</mat-label>
            <input matInput type="number" formControlName="score1" min="0">
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Puntuación {{ data.player2Name }}</mat-label>
            <input matInput type="number" formControlName="score2" min="0">
          </mat-form-field>
        </div>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button 
        mat-raised-button 
        color="primary" 
        [disabled]="resultForm.invalid"
        (click)="onSubmit()"
      >
        Guardar Resultado
      </button>
    </div>
  `,
  styles: [`
    .match-info {
      margin-bottom: 20px;
    }
    
    .match-players {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .player {
      padding: 10px;
      background-color: rgba(30, 30, 50, 0.5);
      border-radius: 4px;
      flex: 1;
    }
    
    .vs {
      padding: 0 10px;
      color: #aaa;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      margin: 15px 0;
    }
    
    mat-radio-button {
    // Continuación de src/app/admin/tournaments/tournament-bracket/record-match-result-dialog.component.ts

      margin: 5px 0;
    }
    
    .score-inputs {
      display: flex;
      gap: 15px;
    }
    
    .score-inputs mat-form-field {
      flex: 1;
    }
    
    mat-form-field {
      width: 100%;
    }
  `]
})
export class RecordMatchResultDialogComponent {
  resultForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecordMatchResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TournamentMatchDto
  ) {
    this.resultForm = this.fb.group({
      winnerId: [null, Validators.required],
      score1: [0, [Validators.required, Validators.min(0)]],
      score2: [0, [Validators.required, Validators.min(0)]]
    });
    
    // Pre-rellenar con datos existentes si hay
    if (data.winnerId) {
      this.resultForm.patchValue({
        winnerId: data.winnerId,
        score1: data.score1 || 0,
        score2: data.score2 || 0
      });
    }
  }
  
  onSubmit(): void {
    if (this.resultForm.valid) {
      const result: RecordMatchResultDto = this.resultForm.value;
      this.dialogRef.close(result);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}