import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import  environment  from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule // Asegúrate de importar CommonModule
  ],
  template: `
    <div class="admin-dashboard">
       <div class="dashboard-header">
        <img 
          src="/assets/logo.png" 
          alt="Chilean StarCraft Championship Logo" 
          class="dashboard-logo"
        />
        <h1>Panel de Administración</h1>
      </div>
      
      <div class="dashboard-actions">
        <button 
          mat-raised-button 
          class="tournaments-button"
          color="primary"
          (click)="goToTournaments()"
        >
          Administrar Torneos
        </button>
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Usuarios Totales</h3>
          <p>{{ dashboardData?.totalUsers || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Usuarios Activos</h3>
          <p>{{ dashboardData?.activeUsers || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Total de Jugadores</h3>
          <p>{{ dashboardData?.totalPlayers || 0 }}</p>
        </div>
      </div>

      <div class="tournament-section">
        <h2>Torneo Activo</h2>
        <div *ngIf="dashboardData?.activeTournament" class="tournament-card">
          <h3>{{ dashboardData.activeTournament.name }}</h3>
          <p>Fecha de Inicio: {{ dashboardData.activeTournament.startDate | date }}</p>
          <p>Fecha de Fin: {{ dashboardData.activeTournament.endDate | date }}</p>
          <p>Participantes: {{ dashboardData.activeTournament.participantsCount }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
      background-color: #000;
      color: white;
    }
 .dashboard-actions {
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
  }
.dashboard-header h1 {
      color: white;
      font-family: 'Orbitron', sans-serif;
      margin: 0;
    }
  .tournaments-button {
    background-color: #1E90FF;  // Azul de la bandera chilena
    color: white;
    border: none;
    padding: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .tournaments-button:hover {
    background-color: #4169E1;  // Un tono de azul más oscuro
  }
    .dashboard-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .dashboard-logo {
      height: 60px;  // Tamaño ajustado
      width: auto;   // Mantener proporción
      margin-right: 20px;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 2rem;
      color: white;
    }

    .dashboard-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }

    .stat-card {
      background-color: rgba(20,20,20,0.8);
      padding: 20px;
      border-radius: 8px;
      width: 30%;
      text-align: center;
    }

    .tournament-section {
      background-color: rgba(20,20,20,0.8);
      padding: 20px;
      border-radius: 8px;
    }

    .tournament-card {
      background-color: rgba(30,30,50,0.5);
      padding: 15px;
      border-radius: 8px;
    }
       .dashboard-actions {
      margin-bottom: 30px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  dashboardData: any = null;

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit() {
    this.fetchDashboardData();
  }
  goToTournaments() {
    this.router.navigate(['/admin/tournaments']);
  }
  fetchDashboardData() {
    this.http.get(`${environment.apiUrl}/Admin/dashboard`).subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
      }
    });
  }
}