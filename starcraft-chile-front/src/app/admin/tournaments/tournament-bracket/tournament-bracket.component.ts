// src/app/admin/tournaments/tournament-bracket/tournament-bracket.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TournamentBracketService } from '../../../services/tournament-bracket.service';
import { TournamentService } from '../../../services/tournament.service';
import { 
  TournamentPlayerBracketDto, 
  TournamentRoundDto, 
  TournamentMatchDto,
  GenerateBracketDto,
  RecordMatchResultDto
} from '../../../models/tournament-bracket.model';

import { RecordMatchResultDialogComponent } from './record-match-result-dialog.component';
import { EditMatchDialogComponent } from './edit-match-dialog.component';

@Component({
  selector: 'app-tournament-bracket',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.scss']
})
export class TournamentBracketComponent implements OnInit {
  tournamentId!: number;
  tournamentName: string = '';
  
  players: TournamentPlayerBracketDto[] = [];
  rounds: TournamentRoundDto[] = [];
  matches: { [roundId: number]: TournamentMatchDto[] } = {};
  
  generateForm: FormGroup;
  isGenerating = false;
  activeTab: number = 0; // Para controlar qué tab está activa
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private bracketService: TournamentBracketService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.generateForm = this.fb.group({
      playerCount: [8, [Validators.required, Validators.min(2), Validators.max(256)]],
      doubleElimination: [false]
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tournamentId = +params['id'];
      this.loadTournamentData();
    });
  }
  
  // Método para cambiar de tab
  setActiveTab(index: number): void {
    this.activeTab = index;
    console.log('Cargando jugadores paso 1 players cargados?' );
  // Si se selecciona la pestaña de jugadores y no hay jugadores cargados
  if (index === 2  ) {
    console.log('Cargando jugadores paso 2');
    this.loadPlayers();
  }
  }
  loadPlayers(): void {
    console.log('Cargando jugadores');
    this.bracketService.getPlayers(this.tournamentId).subscribe({
      next: (players) => {
        console.log('Jugadores cargados (tab):', players);
        this.players = players;
      },
      error: (error) => {
        this.showMessage('Error al cargar jugadores');
        console.error('Error al cargar jugadores:', error);
      }
    });
  }
  loadTournamentData(): void {
    // Cargar información del torneo
    this.tournamentService.getTournamentById(this.tournamentId).subscribe({
      next: (tournament) => {
        this.tournamentName = tournament.name;
        this.loadBracketData();
      },
      error: (error) => {
        this.showMessage('Error al cargar información del torneo');
        console.error('Error al cargar torneo:', error);
      }
    });
  }
  
  loadBracketData(): void {
    // Cargar jugadores
    this.bracketService.getPlayers(this.tournamentId).subscribe({
      next: (players) => {
        this.players = players;
      },
      error: (error) => {
        this.showMessage('Error al cargar jugadores');
        console.error('Error al cargar jugadores:', error);
      }
    });
    
    // Cargar rondas
    this.bracketService.getRounds(this.tournamentId).subscribe({
      next: (rounds) => {
        this.rounds = rounds;
        // Cargar partidos para cada ronda
        this.rounds.forEach(round => {
          this.loadMatchesForRound(round.id);
        });
      },
      error: (error) => {
        this.showMessage('Error al cargar rondas');
        console.error('Error al cargar rondas:', error);
      }
    });
  }
  
  loadMatchesForRound(roundId: number): void {
    this.bracketService.getMatchesForRound(roundId).subscribe({
      next: (matches) => {
        this.matches[roundId] = matches;
      },
      error: (error) => {
        this.showMessage('Error al cargar partidos');
        console.error(`Error al cargar partidos para la ronda ${roundId}:`, error);
      }
    });
  }
  
  generateBracket(): void {
    if (this.generateForm.valid) {
      const confirmGenerate = window.confirm(
        'ADVERTENCIA: Generar un nuevo bracket eliminará cualquier bracket existente para este torneo. ¿Desea continuar?'
      );
      
      if (confirmGenerate) {
        this.isGenerating = true;
        const generateData: GenerateBracketDto = this.generateForm.value;
        
        this.bracketService.generateBracket(this.tournamentId, generateData).subscribe({
          next: () => {
            this.isGenerating = false;
            this.showMessage('Bracket generado correctamente');
            this.loadBracketData(); // Recargar datos
          },
          error: (error) => {
            this.isGenerating = false;
            this.showMessage('Error al generar bracket');
            console.error('Error al generar bracket:', error);
          }
        });
      }
    }
  }
  
  processFinalPositions(): void {
    const confirm = window.confirm(
      '¿Está seguro de procesar las posiciones finales? Esta acción no se puede deshacer.'
    );
    
    if (confirm) {
      this.bracketService.processFinalPositions(this.tournamentId).subscribe({
        next: () => {
          this.showMessage('Posiciones finales procesadas correctamente');
        },
        error: (error) => {
          this.showMessage('Error al procesar posiciones finales');
          console.error('Error al procesar posiciones finales:', error);
        }
      });
    }
  }
  
  openEditMatchDialog(match: TournamentMatchDto | null, roundId: number): void {
    // Si es un nuevo partido, crear un objeto vacío
    const matchData = match || {
      id: 0,
      tournamentId: this.tournamentId,
      roundId: roundId,
      roundName: '',
      matchOrder: this.getNextMatchOrder(roundId),
      player1Id: null,
      player1Name: null,
      player2Id: null,
      player2Name: null,
      winnerId: null,
      winnerName: null,
      score1: null,
      score2: null,
      scheduledTime: null,
      completedTime: null,
      notes: null,
      externalId: null,
      externalUrl: null
    };
    
    const dialogRef = this.dialog.open(EditMatchDialogComponent, {
      width: '500px',
      data: {
        match: matchData,
        players: this.players,
        roundId: roundId,
        matchOrder: matchData.matchOrder
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (match && match.id) {
          // Actualizar partido existente
          this.bracketService.updateMatch(match.id, result).subscribe({
            next: () => {
              this.showMessage('Partido actualizado correctamente');
              this.loadMatchesForRound(roundId);
            },
            error: (error) => {
              this.showMessage('Error al actualizar partido');
              console.error('Error al actualizar partido:', error);
            }
          });
        } else {
          // Crear nuevo partido
          this.bracketService.createMatch(result).subscribe({
            next: () => {
              this.showMessage('Partido creado correctamente');
              this.loadMatchesForRound(roundId);
            },
            error: (error) => {
              this.showMessage('Error al crear partido');
              console.error('Error al crear partido:', error);
            }
          });
        }
      }
    });
  }

  openRecordResultDialog(match: TournamentMatchDto): void {
    const dialogRef = this.dialog.open(RecordMatchResultDialogComponent, {
      width: '500px',
      data: match
    });
    
    dialogRef.afterClosed().subscribe((result: RecordMatchResultDto) => {
      if (result) {
        this.bracketService.recordMatchResult(match.id, result).subscribe({
          next: () => {
            this.showMessage('Resultado registrado correctamente');
            this.loadMatchesForRound(match.roundId);
          },
          error: (error) => {
            this.showMessage('Error al registrar resultado');
            console.error('Error al registrar resultado:', error);
          }
        });
      }
    });
  }

  // Método auxiliar para obtener el siguiente número de orden para un partido en una ronda
  getNextMatchOrder(roundId: number): number {
    if (!this.matches[roundId] || this.matches[roundId].length === 0) {
      return 1;
    }
    
    const maxOrder = Math.max(...this.matches[roundId].map(m => m.matchOrder));
    return maxOrder + 1;
  }
  
  showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  
  goBack(): void {
    this.router.navigate(['/admin/tournaments']);
  }
}