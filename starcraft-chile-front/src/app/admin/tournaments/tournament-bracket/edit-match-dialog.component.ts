// src/app/admin/tournaments/tournament-bracket/edit-match-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { TournamentMatchDto, TournamentPlayerBracketDto } from '../../../models/tournament-bracket.model';

@Component({
  selector: 'app-edit-match-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isNewMatch ? 'Crear Partido' : 'Editar Partido' }}</h2>
    <div mat-dialog-content>
      <form [formGroup]="matchForm">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Jugador 1</mat-label>
            <mat-select formControlName="player1Id">
              <mat-option [value]="null">TBD</mat-option>
              <mat-option *ngFor="let player of players" [value]="player.playerId">
                {{ player.playerName }} ({{ player.playerAlias }})
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Jugador 2</mat-label>
            <mat-select formControlName="player2Id">
              <mat-option [value]="null">TBD</mat-option>
              <mat-option *ngFor="let player of players" [value]="player.playerId">
                {{ player.playerName }} ({{ player.playerAlias }})
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha y Hora Programada</mat-label>
            <input 
              matInput 
              [matDatepicker]="picker" 
              formControlName="scheduledDate"
            >
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Notas</mat-label>
            <textarea 
              matInput 
              formControlName="notes" 
              rows="3"
            ></textarea>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>ID Externo (ej. ID en Challonge)</mat-label>
            <input matInput formControlName="externalId">
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>URL Externa</mat-label>
            <input matInput formControlName="externalUrl">
          </mat-form-field>
        </div>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button 
        mat-raised-button 
        color="primary" 
        [disabled]="matchForm.invalid"
        (click)="onSubmit()"
      >
        {{ isNewMatch ? 'Crear' : 'Guardar Cambios' }}
      </button>
    </div>
  `,
  styles: [`
    .form-row {
      margin-bottom: 15px;
    }
    
    mat-form-field {
      width: 100%;
    }
  `]
})
export class EditMatchDialogComponent {
  matchForm: FormGroup;
  isNewMatch: boolean;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditMatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      match: TournamentMatchDto,
      players: TournamentPlayerBracketDto[],
      roundId: number,
      matchOrder: number
    }
  ) {
    this.isNewMatch = !data.match.id;
    
    this.matchForm = this.fb.group({
      player1Id: [data.match.player1Id],
      player2Id: [data.match.player2Id],
      scheduledDate: [data.match.scheduledTime ? new Date(data.match.scheduledTime) : null],
      notes: [data.match.notes || ''],
      externalId: [data.match.externalId || ''],
      externalUrl: [data.match.externalUrl || '']
    });
  }
  
  get players(): TournamentPlayerBracketDto[] {
    return this.data.players;
  }
  
  onSubmit(): void {
    if (this.matchForm.valid) {
      const formValues = this.matchForm.value;
      
      const matchData: Partial<TournamentMatchDto> = {
        roundId: this.data.roundId,
        matchOrder: this.data.matchOrder,
        player1Id: formValues.player1Id,
        player2Id: formValues.player2Id,
        scheduledTime: formValues.scheduledDate ? formValues.scheduledDate.toISOString() : null,
        notes: formValues.notes,
        externalId: formValues.externalId,
        externalUrl: formValues.externalUrl
      };
      
      this.dialogRef.close(matchData);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}