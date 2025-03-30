import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserAdminService } from '../../services/user.service';
import { UserAdminDto } from '../../models/user.admin.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatChipsModule,
    MatSlideToggleModule,
    FormsModule
  ],
  template: `
    <div class="user-management">
      <div class="dashboard-header">
        <img 
          src="/assets/logo.png" 
          alt="Comunidad Starcraft CHILE Logo" 
          class="dashboard-logo"
        />
        <h1>Administración de Usuarios</h1>
      </div>

      <div class="back-link">
        <a [routerLink]="['/admin/dashboard']" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Volver al Dashboard
        </a>
      </div>

      <div class="users-table-container" *ngIf="users.length > 0; else noUsers">
        <table mat-table [dataSource]="users" class="users-table">
          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <!-- Player Name Column -->
          <ng-container matColumnDef="playerName">
            <th mat-header-cell *matHeaderCellDef>Jugador</th>
            <td mat-cell *matCellDef="let user">
              {{ user.playerName || 'No asociado' }}
              <span *ngIf="user.playerId" class="player-id">(ID: {{ user.playerId }})</span>
            </td>
          </ng-container>

          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Rol</th>
            <td mat-cell *matCellDef="let user">
              <div [ngClass]="{'role-admin': user.role === 'Admin', 'role-user': user.role === 'User'}">
                {{ user.role }}
              </div>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let user">
              <span class="status-indicator" [ngClass]="{'active': user.isActive, 'inactive': !user.isActive}">
                {{ user.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
          </ng-container>

          <!-- Email Confirmed Column -->
          <ng-container matColumnDef="emailConfirmed">
            <th mat-header-cell *matHeaderCellDef>Email Confirmado</th>
            <td mat-cell *matCellDef="let user">
              <mat-icon *ngIf="user.emailConfirmed" class="confirmed-icon">check_circle</mat-icon>
              <mat-icon *ngIf="!user.emailConfirmed" class="not-confirmed-icon">cancel</mat-icon>
            </td>
          </ng-container>

          <!-- Created At Column -->
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Fecha de Registro</th>
            <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'dd-MM-yyyy' }}</td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let user">
              <button 
                mat-icon-button 
                class="toggle-button"
                [ngClass]="{'activate-button': !user.isActive, 'deactivate-button': user.isActive}"
                (click)="toggleUserStatus(user)"
                [matTooltip]="user.isActive ? 'Desactivar usuario' : 'Activar usuario'"
                aria-label="Toggle user status"
              >
                <mat-icon>{{ user.isActive ? 'block' : 'how_to_reg' }}</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator 
          [length]="totalUsers"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        ></mat-paginator>
      </div>

      <ng-template #noUsers>
        <div class="no-users-message">
          <mat-icon>sentiment_very_dissatisfied</mat-icon>
          <p>No hay usuarios registrados actualmente.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .user-management {
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

    .users-table-container {
      margin-top: 20px;
      overflow: auto;
    }

    .users-table {
      width: 100%;
      background-color: rgba(10, 10, 20, 0.7);
      border-left: 3px solid #d52b1e;
      box-shadow: none;
      border-radius: 8px;
      overflow: hidden;
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

    .status-indicator {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    .active {
      background-color: rgba(76, 175, 80, 0.3);
      color: #4CAF50;
    }

    .inactive {
      background-color: rgba(244, 67, 54, 0.3);
      color: #F44336;
    }

    .role-admin {
      color: #1E90FF;
      font-weight: bold;
    }

    .role-user {
      color: #FFA500;
    }

    .confirmed-icon {
      color: #4CAF50;
    }

    .not-confirmed-icon {
      color: #F44336;
    }

    .player-id {
      font-size: 0.8rem;
      color: #aaa;
      margin-left: 5px;
    }

    .toggle-button {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .activate-button {
      background-color: #4CAF50 !important;
      color: white !important;
    }

    .deactivate-button {
      background-color: #F44336 !important;
      color: white !important;
    }

    .no-users-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 100px;
      text-align: center;
    }

    .no-users-message mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #aaa;
      margin-bottom: 16px;
    }

    .no-users-message p {
      color: #aaa;
      font-size: 1.2rem;
    }

    ::ng-deep .mat-mdc-paginator {
      background-color: transparent !important;
      color: white !important;
    }

    ::ng-deep .mat-mdc-paginator-container {
      color: white !important;
    }

    ::ng-deep .mat-mdc-paginator-range-label {
      color: white !important;
    }

    ::ng-deep .mat-mdc-paginator-icon {
      fill: white !important;
    }

    ::ng-deep .mat-mdc-select-value-text {
      color: white !important;
    }

    @media (max-width: 768px) {
      .users-table-container {
        overflow-x: auto;
      }
      
      .dashboard-header h1 {
        font-size: 1.5rem;
      }

      .dashboard-logo {
        height: 40px;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  users: UserAdminDto[] = [];
  displayedColumns: string[] = ['email', 'playerName', 'role', 'status', 'emailConfirmed', 'createdAt', 'actions'];
  
  // Paginación
  currentPage: number = 1;
  pageSize: number = 20;
  totalUsers: number = 0;

  constructor(
    private userService: UserAdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (users) => {
        this.users = users;
        this.totalUsers = users.length > 0 ? users.length + ((this.currentPage - 1) * this.pageSize) : 0;
      },
      error: (error) => {
        console.error('Error al cargar usuarios', error);
        // Manejar error (mostrar mensaje al usuario)
      }
    });
  }

  toggleUserStatus(user: UserAdminDto) {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar el estado del usuario en la lista local
          user.isActive = !user.isActive;
        } else {
          console.error('Error al cambiar estado del usuario', response.message);
          // Mostrar mensaje de error
        }
      },
      error: (error) => {
        console.error('Error al cambiar estado del usuario', error);
        // Manejar error (mostrar mensaje al usuario)
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
}