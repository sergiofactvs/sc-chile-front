import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="tournament-management">
      <div class="dashboard-header">
        <img 
          src="/assets/logo.png" 
          alt="Comunidad Starcraft CHILE Logo" 
          class="dashboard-logo"
        />
        <h1>Administración de Torneos</h1>
      </div>

      <div class="back-link">
        <a [routerLink]="['/admin/dashboard']" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Volver al Dashboard
        </a>
      </div>

      <div class="actions">
        <button 
          mat-raised-button 
          class="create-button"
          (click)="createTournament()"
        >
          <mat-icon>add</mat-icon>
          Crear Nuevo Torneo
        </button>
      </div>

      <table mat-table [dataSource]="tournaments" class="tournament-table">
        <!-- Columna de Nombre -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let tournament">{{ tournament.name }}</td>
        </ng-container>

        <!-- Columna de Fechas -->
        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef>Fechas</th>
          <td mat-cell *matCellDef="let tournament">
            <div class="dates-container">
              <div class="date-phase">
                <span class="phase-label">Clasificación:</span>
                {{ tournament.startDate | date:'dd-MM-yyyy' }} - {{ tournament.endDate | date:'dd-MM-yyyy' }}
              </div>
              <div class="date-phase">
                <span class="phase-label">Torneo:</span>
                {{ tournament.tournamentStartDate | date:'dd-MM-yyyy' }} - {{ tournament.tournamentEndDate | date:'dd-MM-yyyy' }}
              </div>
            </div>
          </td>
        </ng-container>

        <!-- Columna de Participantes -->
        <ng-container matColumnDef="participants">
          <th mat-header-cell *matHeaderCellDef>Participantes</th>
          <td mat-cell *matCellDef="let tournament">
            {{ tournament.participantsCount }}
          </td>
        </ng-container>

        <!-- Columna de Estado -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let tournament">
            {{ tournament.isActive ? 'Activo' : 'Inactivo' }}
          </td>
        </ng-container>

        <!-- Columna de Acciones -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let tournament">
            <button 
              mat-icon-button 
              class="edit-button"
              (click)="editTournament(tournament.id)"
              aria-label="Editar torneo"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button 
              mat-icon-button 
              class="delete-button"
              (click)="deleteTournament(tournament.id)"
              aria-label="Eliminar torneo"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .tournament-management {
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

    .actions {
      margin-bottom: 20px;
    }

    .create-button {
      background-color: #D52B1E !important;
      color: white !important;
      border: none;
      padding: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
    }

    .tournament-table {
      width: 100%;
      background-color: rgba(10, 10, 20, 0.7);
      border-left: 3px solid #d52b1e;
      box-shadow: none;
      border-radius: 8px;
      overflow: hidden;
    }

    /* Estilos de tabla */
    ::ng-deep .mat-mdc-table {
      background-color: transparent !important;
    }

    ::ng-deep .mat-mdc-header-row {
      background-color: rgba(30, 30, 50, 0.5) !important;
    }

    ::ng-deep .mat-mdc-header-cell {
      color: white !important;
      background-color: transparent !important;
      font-weight: bold !important;
      border-bottom: none !important;
    }

    ::ng-deep .mat-mdc-row {
      background-color: transparent !important;
    }

    ::ng-deep .mat-mdc-cell {
      color: white !important;
      background-color: transparent !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    ::ng-deep .mat-mdc-row:hover {
      background-color: rgba(255,255,255,0.1) !important;
    }

    /* Botones de acción */
    .edit-button, .delete-button {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: 0 5px;
    }

    .edit-button {
      background-color: #1E90FF !important;
      color: white !important;
    }

    .delete-button {
      background-color: #D52B1E !important;
      color: white !important;
    }

    .mat-icon {
      font-size: 20px;
      height: 20px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];
  displayedColumns: string[] = ['name', 'dates', 'participants', 'status', 'actions'];

  constructor(
    private tournamentService: TournamentService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTournaments();
  }

  loadTournaments() {
    this.tournamentService.getTournaments().subscribe({
      next: (tournaments) => {
        this.tournaments = tournaments;
      },
      error: (error) => {
        console.error('Error al cargar torneos', error);
        // Manejo de error (mostrar mensaje al usuario)
      }
    });
  }

  createTournament() {
    // Navegar al formulario de creación de torneo
    this.router.navigate(['/admin/tournaments/new']);
  }

  editTournament(id: number) {
    // Navegar al formulario de edición de torneo
    this.router.navigate([`/admin/tournaments/edit/${id}`]);
  }

  deleteTournament(id: number) {
    // Implementar diálogo de confirmación
    const confirmDelete = confirm('¿Estás seguro de eliminar este torneo?');
    
    if (confirmDelete) {
      this.tournamentService.deleteTournament(id).subscribe({
        next: () => {
          // Recargar lista de torneos
          this.loadTournaments();
        },
        error: (error) => {
          console.error('Error al eliminar torneo', error);
          // Manejo de error (mostrar mensaje al usuario)
        }
      });
    }
  }
}