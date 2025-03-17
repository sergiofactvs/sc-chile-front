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
          alt="Chilean StarCraft Championship Logo" 
          class="dashboard-logo"
        />
        <h1>Administración de Torneos</h1>
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
            {{ tournament.startDate | date }} - {{ tournament.endDate | date }}
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
              color="primary"
              (click)="editTournament(tournament.id)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button 
              mat-icon-button 
              color="warn"
              (click)="deleteTournament(tournament.id)"
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
      height: 60px;
      width: auto;
      margin-right: 20px;
    }

    .dashboard-header h1 {
      color: white;
      font-family: 'Orbitron', sans-serif;
      margin: 0;
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
    }

    /* Estilos de tabla */
    ::ng-deep .mat-header-cell {
      color: white !important;
      background-color: rgba(30, 30, 50, 0.5) !important;
      font-weight: bold !important;
    }

    ::ng-deep .mat-cell {
      color: white !important;
      background-color: transparent !important;
    }

    ::ng-deep .mat-row {
      background-color: transparent !important;
    }

    ::ng-deep .mat-row:hover {
      background-color: rgba(255,255,255,0.1) !important;
    }

    /* Botones de acción */
    ::ng-deep .mat-icon-button {
      color: white !important;
    }

    ::ng-deep .mat-icon-button.mat-primary {
      color: #1E90FF !important; /* Azul para editar */
    }

    ::ng-deep .mat-icon-button.mat-warn {
      color: #D52B1E !important; /* Rojo para eliminar */
    }
      ::ng-deep .mat-mdc-table {
    background-color: transparent !important;
  }

  ::ng-deep .mat-mdc-header-row {
    background-color: rgba(30, 30, 50, 0.5) !important;
  }

  ::ng-deep .mat-mdc-header-cell {
    color: white !important;
    background-color: transparent !important;
  }

  ::ng-deep .mat-mdc-row {
    background-color: transparent !important;
  }

  ::ng-deep .mat-mdc-cell {
    color: white !important;
    background-color: transparent !important;
  }

  ::ng-deep .mat-mdc-row:hover {
    background-color: rgba(255,255,255,0.1) !important;
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