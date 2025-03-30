// src/app/landing/new-landing.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';
import { ActiveTournamentService } from '../services/active-tournament.service';
import { TournamentEnrollmentService } from '../services/tournament-enrollment.service';

@Component({
  selector: 'app-new-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div class="landing-container">
      <!-- Navbar -->
      <nav class="nav-bar">
        <div class="nav-content">
          <div class="logo-section">
            <img src="assets/logo.png" alt="StarCraft Chile Logo" class="logo-img">
            <span class="logo-text">SC-CHL</span>
          </div>
          
          <div class="nav-links" [class.mobile-open]="mobileMenuOpen">
            <a [routerLink]="['/']" class="nav-link active">Liga</a>
            <a [routerLink]="['/currentseason']" class="nav-link">Ranking</a>
            <a href="#comunidad" class="nav-link">Comunidad</a>
            <a href="#donar" class="nav-link">Donar</a>
            
            <!-- Login/Profile buttons -->
            <div *ngIf="!isAuthenticated" class="auth-buttons">
              <button [routerLink]="['/auth']" mat-raised-button class="login-button">
                Iniciar Sesión
              </button>
            </div>
            
            <div *ngIf="isAuthenticated" class="auth-buttons">
              <button mat-raised-button [matMenuTriggerFor]="userMenu" class="profile-button">
                <span class="user-alias">{{ primaryAlias || userName }}</span>
                <mat-icon>arrow_drop_down</mat-icon>
              </button>
              
              <mat-menu #userMenu="matMenu" class="user-menu">
                <a mat-menu-item [routerLink]="['/profile']">
                  <mat-icon>person</mat-icon>
                  <span>Mi Perfil</span>
                </a>
                <button mat-menu-item (click)="logout()">
                  <mat-icon>exit_to_app</mat-icon>
                  <span>Cerrar Sesión</span>
                </button>
              </mat-menu>
            </div>
          </div>
          
          <button class="mobile-menu-button" (click)="toggleMobileMenu()">
            <mat-icon>{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>
        
        <!-- Progress bar for tournament funding 
        <div class="progress-bar-container">
          <div class="progress-content">
            <div class="progress-text">
              <span>Meta de donación:</span>
              <div class="progress-track">
                <div class="progress-fill" [style.width.%]="progressPercentage"></div>
              </div>
            </div>
            <div class="progress-numbers">
              <span class="current-amount">400</span>
              <span>de</span>
              <span class="goal-amount">500</span>
            </div>
          </div>
        </div>-->
      </nav>

      <!-- Hero section -->
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-logo">
            <img src="assets/logo.png" alt="StarCraft Chile Logo">
          </div>
          <h1 class="hero-title">Comunidad Starcraft</h1>
          <p class="hero-subtitle">CHILE</p>
          <p class="hero-description">
            La comunidad más grande de Starcraft en Chile. Únete a nuestros torneos, compite y forma parte de la historia.
          </p>
          <div class="hero-buttons">
            <button mat-raised-button class="primary-button" [routerLink]="isAuthenticated ? ['/enroll'] : ['/auth']">
              Unirse a la Liga
            </button>
            <button mat-raised-button class="secondary-button" [routerLink]="['/active-tournament']">
              Ver Torneos
            </button>
          </div>
        </div>
      </section>

      <!-- Tournament section -->
      <section class="tournament-section" id="tournament">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Liga Starcraft Chile</h2>
            <p class="section-subtitle">Temporada 1 - Marzo 2025</p>
          </div>

          <!-- Loading state -->
          <div *ngIf="isLoadingTournament" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Cargando torneo...</p>
          </div>

          <!-- Active tournament -->
          <div *ngIf="!isLoadingTournament && activeTournament" class="tournament-card">
            <div class="tournament-grid">
              <div class="tournament-info">
                <h3 class="tournament-name">{{ activeTournament.name }}</h3>
                <div class="tournament-phase">{{ activeTournament.currentPhase || 'Clasificación' }}</div>
                
                <div class="tournament-dates">
                  <div class="date-item">
                    <span class="date-label">Clasificación:</span>
                    <span class="date-value">{{ activeTournament.qualificationStartDate | date:'dd-MM-yyyy' }} al {{ activeTournament.qualificationEndDate | date:'dd-MM-yyyy' }}</span>
                  </div>
                  
                  <div class="date-item">
                    <span class="date-label">Torneo Principal:</span>
                    <span class="date-value">{{ activeTournament.tournamentStartDate | date:'dd-MM-yyyy' }} al {{ activeTournament.tournamentEndDate | date:'dd-MM-yyyy' }}</span>
                  </div>
                </div>
                
                <div class="tournament-meta">
                  <div class="meta-item" *ngIf="activeTournament.prizePool">
                    <span class="meta-label">Premio:</span>
                    <span class="meta-value">{{ activeTournament.prizePool }} {{ activeTournament.currency || 'USD' }}</span>
                  </div>
                  
                  <div class="meta-item">
                    <span class="meta-label">Jugadores inscritos:</span>
                    <span class="meta-value highlight">{{ activeTournament.totalPlayers }}</span>
                  </div>
                </div>
                
                <div class="tournament-actions">
                  <button mat-raised-button class="view-button" [routerLink]="['/active-tournament']">
                    <mat-icon>visibility</mat-icon>
                    VER TORNEO
                  </button>
                  
                  <ng-container *ngIf="isAuthenticated">
                    <button *ngIf="!isUserEnrolled" mat-raised-button class="enroll-button" [routerLink]="['/enroll']">
                      <mat-icon>how_to_reg</mat-icon>
                      INSCRIBIRME
                    </button>
                    
                    <div *ngIf="isUserEnrolled" class="enrolled-badge">
                      <mat-icon>check_circle</mat-icon>
                      Ya estás inscrito
                    </div>
                  </ng-container>
                  
                  <button *ngIf="!isAuthenticated" mat-raised-button class="enroll-button" [routerLink]="['/auth']">
                    REGÍSTRATE PARA PARTICIPAR
                  </button>
                </div>
              </div>
              
              <div class="race-stats">
                <h3 class="stats-title">Distribución por Raza</h3>
                <div class="race-chart">
                  <!-- Placeholder for race chart - would be implemented with charting library -->
                  <div class="chart-placeholder">
                    <div class="race-bar terran" style="height: 40%;">
                      <span class="race-percent">40%</span>
                      <span class="race-name">Terran</span>
                    </div>
                    <div class="race-bar protoss" style="height: 30%;">
                      <span class="race-percent">30%</span>
                      <span class="race-name">Protoss</span>
                    </div>
                    <div class="race-bar zerg" style="height: 30%;">
                      <span class="race-percent">30%</span>
                      <span class="race-name">Zerg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No active tournament -->
          <div *ngIf="!isLoadingTournament && !activeTournament" class="no-tournament">
            <div class="no-tournament-content">
              <h3>Próximamente</h3>
              <p>Nuevo Torneo</p>
              <p class="no-tournament-message">No hay torneos activos en este momento. Vuelve pronto para más información.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Ranking section -->
      <section class="ranking-section" id="ranking">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Ranking de Jugadores</h2>
            <p class="section-subtitle">Clasificación basada en resultados de torneos y participación</p>
          </div>
          
          <div class="ranking-grid">
            <div class="ranking-table">
              <div class="table-header">
                <h3 class="table-title">Top Jugadores</h3>
                <div class="table-actions">
                  <button mat-raised-button class="action-button" [routerLink]="['/currentseason']">
                    Ver Ranking Completo
                  </button>
                </div>
              </div>
              
              <div class="table-content">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Jugador</th>
                      <th>Raza</th>
                      <th>MMR</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td class="player-cell">
                        <div class="player-avatar"></div>
                        RaynorX
                      </td>
                      <td><span class="race terran">Terran</span></td>
                      <td>2450</td>
                      <td><span class="status qualified">Clasificado</span></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td class="player-cell">
                        <div class="player-avatar"></div>
                        ZergMaster
                      </td>
                      <td><span class="race zerg">Zerg</span></td>
                      <td>2350</td>
                      <td><span class="status qualified">Clasificado</span></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td class="player-cell">
                        <div class="player-avatar"></div>
                        ProtossGG
                      </td>
                      <td><span class="race protoss">Protoss</span></td>
                      <td>2300</td>
                      <td><span class="status qualified">Clasificado</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="ranking-stats">
              <div class="stats-card">
                <h3 class="stats-title">Actividad Semanal</h3>
                <div class="stats-chart">
                  <!-- Placeholder for activity chart -->
                  <div class="activity-chart-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Community section -->
      <section class="community-section" id="comunidad">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Nuestra Comunidad</h2>
            <p class="section-subtitle">Síguenos en nuestros canales y redes sociales</p>
          </div>
          
          <div class="social-grid">
            <a href="#" class="social-card discord">
              <div class="social-icon">
                <mat-icon>discord</mat-icon>
              </div>
              <h3 class="social-title">Discord</h3>
              <p class="social-desc">Únete a nuestra comunidad para charlar y encontrar partidas</p>
            </a>
            
            <a href="#" class="social-card youtube">
              <div class="social-icon">
                <mat-icon>smart_display</mat-icon>
              </div>
              <h3 class="social-title">YouTube</h3>
              <p class="social-desc">Mira nuestros torneos y tutoriales</p>
            </a>
            
            <a href="#" class="social-card twitter">
              <div class="social-icon">
                <mat-icon>chat</mat-icon>
              </div>
              <h3 class="social-title">Twitter</h3>
              <p class="social-desc">Mantente informado de nuestras últimas novedades</p>
            </a>
            
            <a href="#" class="social-card twitch">
              <div class="social-icon">
                <mat-icon>live_tv</mat-icon>
              </div>
              <h3 class="social-title">Twitch</h3>
              <p class="social-desc">Sigue nuestras transmisiones en vivo</p>
            </a>
          </div>
        </div>
      </section>

      <!-- Donation section -->
      <section class="donation-section" id="donar">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">Apoya Nuestra Comunidad</h2>
            <p class="section-subtitle">Tu donación nos ayuda a mantener y mejorar los torneos y eventos</p>
          </div>
          
          <div class="donation-card">
            <div class="donation-header">
              <div class="donation-icon">
                <mat-icon>favorite</mat-icon>
              </div>
              <h3 class="donation-title">Realiza una Donación</h3>
              <p class="donation-subtitle">Elige la plataforma que prefieras para apoyar nuestro proyecto</p>
            </div>
            
            <div class="donation-progress">
              <div class="progress-text">
                <span class="progress-label">Progreso de donaciones</span>
                <div class="progress-amounts">
                  <span class="current-amount">400</span>
                  <span class="separator">de</span>
                  <span class="goal-amount">500</span>
                </div>
              </div>
              
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="progressPercentage">
                  <span class="progress-percentage">{{progressPercentage}}%</span>
                </div>
              </div>
              
              <div class="progress-message">
                Ayúdanos a alcanzar nuestra meta para mejorar los torneos y premios
              </div>
            </div>
            
            <div class="donation-options">
              <a href="#" class="donation-option paypal">
                <div class="option-icon">
                  <mat-icon>payment</mat-icon>
                </div>
                <div class="option-text">
                  <h4 class="option-title">PayPal</h4>
                  <p class="option-desc">Donación única o recurrente</p>
                </div>
              </a>
              
              <a href="#" class="donation-option patreon">
                <div class="option-icon">
                  <mat-icon>loyalty</mat-icon>
                </div>
                <div class="option-text">
                  <h4 class="option-title">Patreon</h4>
                  <p class="option-desc">Suscripción mensual</p>
                </div>
              </a>
              
              <a href="#" class="donation-option twitch">
                <div class="option-icon">
                  <mat-icon>live_tv</mat-icon>
                </div>
                <div class="option-text">
                  <h4 class="option-title">Twitch</h4>
                  <p class="option-desc">Suscripción al canal</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="site-footer">
        <div class="footer-content">
          <div class="footer-main">
            <div class="footer-logo">
              <img src="assets/logo.png" alt="StarCraft Chile Logo" class="footer-logo-img">
              <span class="footer-logo-text">SC-CHL</span>
            </div>
            
            <div class="footer-links">
              <div class="footer-links-column">
                <h4 class="footer-title">Enlaces</h4>
                <ul>
                  <li><a [routerLink]="['/']">Inicio</a></li>
                  <li><a [routerLink]="['/currentseason']">Ranking</a></li>
                  <li><a href="#comunidad">Comunidad</a></li>
                  <li><a href="#donar">Donar</a></li>
                </ul>
              </div>
              
              <div class="footer-links-column">
                <h4 class="footer-title">Recursos</h4>
                <ul>
                  <li><a href="#">Guías</a></li>
                  <li><a href="#">Reglas</a></li>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">Contacto</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2025 Comunidad Starcraft Chile. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* Variables y configuración general */
    :host {
      --primary-color: #0B3D91;
      --secondary-color: #DA291C;
      --bg-dark: #0A0C1B;
      --bg-darker: #070810;
      --bg-card: #111326;
      --text-primary: #ffffff;
      --text-secondary: #aaaaaa;
      --text-tertiary: #666666;
      --border-color: rgba(255, 255, 255, 0.1);
      
      --terran-color: #57B5E7;
      --protoss-color: #8DD3C7;
      --zerg-color: #FBBF72;
      
      --font-main: 'Roboto', sans-serif;
      --font-special: 'Orbitron', sans-serif;
      
      display: block;
      background-color: var(--bg-dark);
      color: var(--text-primary);
      font-family: var(--font-main);
      min-height: 100vh;
    }
    
    /* Navbar */
    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: rgba(7, 8, 16, 0.9);
      backdrop-filter: blur(10px);
      z-index: 1000;
      border-bottom: 1px solid var(--border-color);
    }
    
    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo-img {
      width: 2.5rem;
      height: 2.5rem;
      object-fit: contain;
    }
    
    .logo-text {
      font-family: var(--font-special);
      font-weight: bold;
      font-size: 1.25rem;
      color: var(--text-primary);
    }
    
    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .nav-link {
      padding: 0.5rem 0.75rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s;
    }
    
    .nav-link:hover,
    .nav-link.active {
      color: var(--text-primary);
    }
    
    .login-button,
    .profile-button {
      background-color: var(--primary-color) !important;
      color: white !important;
      padding: 0 1rem !important;
      border-radius: 0.5rem !important; 
    }
    
    .user-alias {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .progress-bar-container {
      background-color: var(--bg-dark);
      padding: 0.25rem 1rem;
    }
    
    .progress-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .progress-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .progress-track {
      width: 12rem;
      height: 0.5rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    }
    
    .progress-numbers {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
    }
    
    .current-amount,
    .goal-amount {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    /* Hero Section */
    .hero-section {
      position: relative;
      padding: 8rem 1rem 6rem;
      background-color: var(--bg-darker);
      overflow: hidden;
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .hero-overlay {
      position: absolute;
      inset: 0;
      background-image: url('https://public.readdy.ai/ai/img_res/d059defee15debd0d3513177d0178273.jpg');
      background-size: cover;
      background-position: center;
      opacity: 0.2;
    }
    
    .hero-content {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .hero-logo {
      margin-bottom: 2rem;
     
    }
    
    .hero-logo img {
     width: auto;
    height: 350px;
     
      
      object-fit: contain;
    }
    
    .hero-title {
      font-family: var(--font-special);
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }
    
    .hero-subtitle {
      font-family: var(--font-special);
      font-size: 1.5rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      letter-spacing: 0.2em;
    }
    
    .hero-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    .primary-button {
      background-color: var(--primary-color) !important;
      color: white !important;
      padding: 0.5rem 1.5rem !important;
      font-family: var(--font-special) !important;
      border-radius: 0.5rem !important;
    }
    
    .secondary-button {
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      padding: 0.5rem 1.5rem !important;
      font-family: var(--font-special) !important;
      border-radius: 0.5rem !important;
    }
    
    /* Sections General */
    section {
      padding: 5rem 1rem;
    }
    
    .tournament-section {
      background-color: var(--bg-dark);
    }
    
    .ranking-section {
      background-color: var(--bg-darker);
    }
    
    .community-section {
      background-color: var(--bg-dark);
    }
    
    .donation-section {
      background-color: var(--bg-darker);
    }
    
    .section-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .section-title {
      font-family: var(--font-special);
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .section-subtitle {
      color: var(--text-secondary);
    }
    
    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
    }
    
    .loading-spinner {
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 4px solid var(--secondary-color);
      width: 2.5rem;
      height: 2.5rem;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loading-text {
      color: var(--text-secondary);
    }
    
    /* Tournament Card */
    .tournament-card {
      background-color: var(--bg-card);
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .tournament-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    .tournament-name {
      font-size: 1.75rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .tournament-phase {
      display: inline-block;
      background-color: rgba(218, 41, 28, 0.2);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    
    .tournament-dates {
      margin-bottom: 1.5rem;
    }
    
    .date-item {
      margin-bottom: 0.75rem;
    }
    
    .date-label {
      display: block;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }
    
    .date-value {
      padding-left: 0.75rem;
      border-left: 2px solid var(--secondary-color);
    }
    
    .tournament-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    
    .meta-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .meta-value {
      font-size: 1.125rem;
      font-weight: bold;
    }
    
    .meta-value.highlight {
      color: var(--secondary-color);
    }
    
    .tournament-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .view-button {
      background-color: var(--primary-color) !important;
      color: white !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.5rem !important;
    }
    
    .enroll-button {
      background-color: var(--secondary-color) !important;
      color: white !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.5rem !important;
    }
    
    .enrolled-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
      padding: 0.5rem;
      border-radius: 0.25rem;
      font-weight: bold;
    }
    
    /* Race Stats */
    .race-stats {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      padding: 1.5rem;
    }
    
    .stats-title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    .race-chart {
      height: 15rem;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    
    .chart-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
    }
    
    .race-bar {
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      transition: height 0.5s ease-out;
    }
    
    .race-bar.terran {
      background-color: var(--terran-color);
    }
    
    .race-bar.protoss {
      background-color: var(--protoss-color);
    }
    
    .race-bar.zerg {
      background-color: var(--zerg-color);
    }
    
    .race-percent {
      position: absolute;
      top: -1.5rem;
      color: white;
      font-weight: bold;
    }
    
    .race-name {
      position: absolute;
      bottom: -1.5rem;
      color: var(--text-secondary);
    }
    
    /* No Tournament */
    .no-tournament {
      background-color: var(--bg-card);
      border-radius: 0.5rem;
      padding: 3rem 1.5rem;
      text-align: center;
    }
    
    .no-tournament h3 {
      color: var(--text-secondary);
      font-size: 1rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .no-tournament p {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }
    
    .no-tournament-message {
      color: var(--text-secondary);
      font-size: 1rem !important;
      font-weight: normal !important;
    }
    
    /* Ranking Section */
    .ranking-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    
    .ranking-table {
      background-color: var(--bg-card);
      border-radius: 0.5rem;
      padding: 1.5rem;
    }
    
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .table-title {
      font-size: 1.25rem;
      font-weight: bold;
    }
    
    .action-button {
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      font-size: 0.875rem !important;
    }
    
    .table-content {
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      text-align: left;
      padding: 0.75rem 0.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      border-bottom: 1px solid var(--border-color);
    }
    
    td {
      padding: 0.75rem 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .player-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .player-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background-color: rgba(11, 61, 145, 0.3);
    }
    
    .race {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    
    .race.terran {
      background-color: rgba(87, 181, 231, 0.2);
      color: var(--terran-color);
    }
    
    .race.protoss {
      background-color: rgba(141, 211, 199, 0.2);
      color: var(--protoss-color);
    }
    
    .race.zerg {
      background-color: rgba(251, 191, 114, 0.2);
      color: var(--zerg-color);
    }
    
    .status {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    
    .status.qualified {
      background-color: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
    }
    
    .ranking-stats {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .stats-card {
      background-color: var(--bg-card);
      border-radius: 0.5rem;
      padding: 1.5rem;
    }
    
    .activity-chart-placeholder {
      height: 12rem;
      background: linear-gradient(180deg, 
        rgba(87, 181, 231, 0.05) 0%, 
        rgba(87, 181, 231, 0.3) 100%);
      border-radius: 0.5rem;
      position: relative;
      overflow: hidden;
    }
    
    .activity-chart-placeholder::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 30%;
      background: linear-gradient(90deg,
        rgba(87, 181, 231, 0.5) 0%,
        rgba(87, 181, 231, 0.8) 50%,
        rgba(87, 181, 231, 0.5) 100%);
      clip-path: polygon(
        0% 100%, 10% 40%, 20% 60%, 30% 30%, 
        40% 50%, 50% 20%, 60% 40%, 70% 35%, 
        80% 50%, 90% 70%, 100% 30%, 100% 100%
      );
    }
    
    /* Community Section */
    .social-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .social-card {
      background-color: var(--bg-card);
      border-radius: 0.5rem;
      padding: 1.5rem;
      transition: background-color 0.3s;
      text-decoration: none;
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .social-card:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    .social-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    
    .social-card.discord .social-icon {
      background-color: rgba(114, 137, 218, 0.2);
      color: #7289DA;
    }
    
    .social-card.youtube .social-icon {
      background-color: rgba(255, 0, 0, 0.2);
      color: #FF0000;
    }
    
    .social-card.twitter .social-icon {
      background-color: rgba(29, 161, 242, 0.2);
      color: #1DA1F2;
    }
    
    .social-card.twitch .social-icon {
      background-color: rgba(100, 65, 164, 0.2);
      color: #6441A4;
    }
    
    .social-title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .social-desc {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    /* Donation Section */
    .donation-card {
      background-color: var(--bg-card);
      border-radius: 0.5rem;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .donation-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .donation-icon {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background-color: rgba(218, 41, 28, 0.2);
      color: var(--secondary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    
    .donation-icon mat-icon {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
    }
    
    .donation-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .donation-subtitle {
      color: var(--text-secondary);
    }
    
    .donation-progress {
      margin-bottom: 2rem;
    }
    
    .progress-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .progress-label {
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .progress-amounts {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 0.875rem;
    }
    
    .separator {
      color: var(--text-secondary);
    }
    
    .progress-bar {
      height: 1.5rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      overflow: hidden;
      margin-bottom: 0.5rem;
      position: relative;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .progress-percentage {
      font-size: 0.75rem;
      font-weight: bold;
      color: white;
    }
    
    .progress-message {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-align: center;
    }
    
    .donation-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .donation-option {
      background-color: var(--bg-dark);
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      color: var(--text-primary);
      transition: background-color 0.3s;
    }
    
    .donation-option:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    .option-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .donation-option.paypal .option-icon {
      background-color: rgba(0, 48, 135, 0.2);
      color: #0070BA;
    }
    
    .donation-option.patreon .option-icon {
      background-color: rgba(249, 104, 84, 0.2);
      color: #F96854;
    }
    
    .donation-option.twitch .option-icon {
      background-color: rgba(100, 65, 164, 0.2);
      color: #6441A4;
    }
    
    .option-text {
      text-align: left;
    }
    
    .option-title {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    
    .option-desc {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    /* Footer */
    .site-footer {
      background-color: var(--bg-darker);
      border-top: 1px solid var(--border-color);
      padding: 3rem 1rem 1.5rem;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .footer-main {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .footer-logo-img {
      width: 3rem;
      height: 3rem;
      object-fit: contain;
    }
    
    .footer-logo-text {
      font-family: var(--font-special);
      font-weight: bold;
      font-size: 1.5rem;
    }
    
    .footer-links {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
    
    .footer-title {
      font-weight: bold;
      margin-bottom: 1rem;
      color: white;
    }
    
    .footer-links-column ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-links-column li {
      margin-bottom: 0.5rem;
    }
    
    .footer-links-column a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s;
    }
    
    .footer-links-column a:hover {
      color: var(--text-primary);
    }
    
    .footer-bottom {
      text-align: center;
      border-top: 1px solid var(--border-color);
      padding-top: 1.5rem;
      color: var(--text-tertiary);
      font-size: 0.875rem;
    }
    
    /* Mobile Responsiveness */
    .mobile-menu-button {
      display: none;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
    }
    
    @media (max-width: 768px) {
      .mobile-menu-button {
        display: block;
      }
      
      .nav-links {
        position: fixed;
        top: 4rem;
        left: 0;
        right: 0;
        background-color: var(--bg-darker);
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        transform: translateY(-100%);
        transition: transform 0.3s ease-in-out;
        z-index: 100;
        border-bottom: 1px solid var(--border-color);
      }
      
      .nav-links.mobile-open {
        transform: translateY(0);
      }
      
      .progress-content {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1.25rem;
      }
      
      .hero-buttons {
        flex-direction: column;
      }
      
      .tournament-grid,
      .ranking-grid {
        grid-template-columns: 1fr;
      }
      
      .donation-options {
        grid-template-columns: 1fr;
      }
      
      .footer-main {
        grid-template-columns: 1fr;
      }
      
      .footer-links {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NewLandingComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = '';
  primaryAlias: string = '';
  isLoadingTournament: boolean = true;
  activeTournament: any = null;
  isUserEnrolled: boolean = false;
  mobileMenuOpen: boolean = false;
  
  // Donation progress
  currentAmount: number = 350;
  goalAmount: number = 1000;
  progressPercentage: number = 35;
  
  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    private activeTournamentService: ActiveTournamentService,
    private tournamentEnrollmentService: TournamentEnrollmentService
  ) {}
  
  ngOnInit() {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = !!this.authService.getToken();
    
    // Obtener información del usuario si está autenticado
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName() || 'Usuario';
      this.loadPlayerAlias();
      this.checkEnrollmentStatus();
    }
    
    // Suscribirse a cambios en el estado de autenticación
    this.authService.isAuthenticated.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.userName = this.authService.getUserName() || 'Usuario';
        this.loadPlayerAlias();
        this.checkEnrollmentStatus();
      } else {
        this.userName = '';
        this.primaryAlias = '';
        this.isUserEnrolled = false;
      }
    });
    
    // Cargar torneo activo
    this.loadActiveTournament();
    
    // Calcular porcentaje de progreso
    this.updateProgressPercentage();
  }
  
  loadPlayerAlias() {
    this.playerService.getGameProfiles().subscribe({
      next: (profiles) => {
        if (profiles && profiles.length > 0) {
          // Usar el primer alias como principal
          this.primaryAlias = profiles[0].alias || '';
        }
      },
      error: (err) => {
        console.error('Error al cargar perfiles de juego:', err);
      }
    });
  }
  
  loadActiveTournament() {
    this.isLoadingTournament = true;
    this.activeTournamentService.getActiveTournamentWithPlayers().subscribe({
      next: (tournament) => {
        this.activeTournament = tournament;
        this.isLoadingTournament = false;
      },
      error: (err) => {
        // Si es 404, significa que no hay torneo activo (no es un error)
        if (err.status === 404) {
          this.activeTournament = null;
        } else {
          console.error('Error al cargar torneo activo:', err);
        }
        this.isLoadingTournament = false;
      }
    });
  }
  
  checkEnrollmentStatus() {
    if (!this.isAuthenticated) return;
    
    this.tournamentEnrollmentService.getEnrollmentStatus().subscribe({
      next: (status) => {
        this.isUserEnrolled = status.isEnrolled;
      },
      error: (err) => {
        console.error('Error al verificar estado de inscripción:', err);
      }
    });
  }
  
  updateProgressPercentage() {
    this.progressPercentage = Math.round((this.currentAmount / this.goalAmount) * 100);
  }
  
  logout() {
    this.authService.logout();
    // La suscripción en ngOnInit actualizará la UI
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}