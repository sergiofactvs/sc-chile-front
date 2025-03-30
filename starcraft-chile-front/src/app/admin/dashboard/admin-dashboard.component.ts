import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import environment from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
  ],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <img 
          src="/assets/logo.png" 
          alt="Comunidad Starcraft CHILE Logo" 
          class="dashboard-logo"
        />
        <h1>Panel de Administración</h1>
      </div>
      
      <div class="dashboard-actions">
        <button 
          class="admin-button tournaments-button"
          (click)="goToTournaments()"
        >
          <i class="material-icons">emoji_events</i>
          Administrar Torneos
        </button>
        <button 
          class="admin-button users-button"
          (click)="goToUsers()"
        >
          <i class="material-icons">people</i>
          Administrar Usuarios
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
          <div class="tournament-dates">
            <div class="date-group">
              <span class="date-label">Clasificación:</span>
              <p>{{ dashboardData.activeTournament.startDate | date:'dd-MM-yyyy' }} - {{ dashboardData.activeTournament.endDate | date:'dd-MM-yyyy' }}</p>
            </div>
            <div class="date-group">
              <span class="date-label">Torneo Principal:</span>
              <p>{{ dashboardData.activeTournament.tournamentStartDate | date:'dd-MM-yyyy' }} - {{ dashboardData.activeTournament.tournamentEndDate | date:'dd-MM-yyyy' }}</p>
            </div>
          </div>
          <p>Participantes: {{ dashboardData.activeTournament.participantsCount }}</p>
        </div>
        <div *ngIf="!dashboardData?.activeTournament" class="no-tournament">
          <p>No hay torneos activos actualmente</p>
          <button 
            class="create-tournament-button"
            (click)="goToCreateTournament()"
          >
            Crear Torneo
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
      background-color: #000;
      color: white;
      min-height: 100vh;
    }
   
    .dashboard-actions {
      margin-bottom: 30px;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .dashboard-header h1 {
      color: white;
      font-family: 'Orbitron', sans-serif;
      margin: 0;
    }
   
    .admin-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 20px;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;
      border: none;
      color: white;
    }
  
    .admin-button i {
      margin-right: 8px;
    }
    
    .tournaments-button {
      background-color: #1E90FF;  // Azul de la bandera chilena
    }

    .tournaments-button:hover {
      background-color: #4169E1;  // Un tono de azul más oscuro
    }
    
    .users-button {
      background-color: #D52B1E;  // Rojo de la bandera chilena
    }
    
    .users-button:hover {
      background-color: #C41E3A;  // Un tono de rojo más oscuro
    }
    
    .dashboard-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .dashboard-logo {
      height: 70px;  // Tamaño ajustado
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
      flex-wrap: wrap;
      gap: 20px;
    }

    .stat-card {
      background-color: rgba(20,20,20,0.8);
      padding: 20px;
      border-radius: 8px;
      flex: 1;
      min-width: 200px;
      text-align: center;
      border-left: 3px solid #D52B1E;
    }
    
    .stat-card h3 {
      font-size: 1.2rem;
      margin-top: 0;
      color: #aaa;
    }
    
    .stat-card p {
      font-size: 2rem;
      font-weight: bold;
      margin: 10px 0 0 0;
    }

    .tournament-section {
      background-color: rgba(20,20,20,0.8);
      padding: 20px;
      border-radius: 8px;
      border-left: 3px solid #D52B1E;
    }
    
    .tournament-section h2 {
      margin-top: 0;
      font-size: 1.5rem;
    }

    .tournament-dates {
      margin: 15px 0;
    }
    
    .date-group {
      margin-bottom: 10px;
    }
    
    .date-label {
      font-weight: bold;
      color: #aaa;
      display: block;
      margin-bottom: 3px;
    }
    
    .date-group p {
      margin: 0;
      padding-left: 10px;
      border-left: 2px solid #D52B1E;
    }

    .tournament-card {
      background-color: rgba(30,30,50,0.5);
      padding: 20px;
      border-radius: 8px;
      margin-top: 15px;
    }
    
    .tournament-card h3 {
      margin-top: 0;
      font-size: 1.3rem;
      color: #FFF;
    }
    
    .no-tournament {
      text-align: center;
      padding: 30px;
    }
    
    .create-tournament-button {
      background-color: #D52B1E;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 15px;
    }
    
    .create-tournament-button:hover {
      background-color: #C41E3A;
    }
    
    @media (max-width: 768px) {
      .dashboard-stats {
        flex-direction: column;
      }
      
      .stat-card {
        width: 100%;
        margin-bottom: 15px;
      }
      
      .dashboard-actions {
        flex-direction: column;
      }
      
      .admin-button {
        width: 100%;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  dashboardData: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchDashboardData();
  }
  
  goToTournaments() {
    this.router.navigate(['/admin/tournaments']);
  }
  
  goToUsers() {
    this.router.navigate(['/admin/users']);
  }
  
  goToCreateTournament() {
    this.router.navigate(['/admin/tournaments/new']);
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