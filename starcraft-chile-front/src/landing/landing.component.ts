import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="container">
      <!-- Logo -->
      <img 
        src="/assets/logo.png" 
        alt="Chilean StarCraft Championship Logo" 
        class="logo"
      >
      
      <!-- Título -->
      <h1 class="title">Chilean StarCraft</h1>
      <p class="subtitle">CHAMPIONSHIP</p>
      
      <!-- Anuncio del torneo -->
      <mat-card class="tournament-card">
        <mat-card-content>
          <p class="coming-soon">PRÓXIMAMENTE</p>
          <p class="tournament-date">Fase final</p>
           
        </mat-card-content>
      </mat-card>
      
      <!-- Footer -->
      <footer class="footer">
        © 2025 Chilean StarCraft Championship
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #000000;
      color: white;
      font-family: 'Roboto', sans-serif;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: 40px 20px;
      box-sizing: border-box;
      text-align: center;
    }

    .logo {
      width: auto;
      height: 350px;
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .title {
      font-family: 'Orbitron', sans-serif;
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0 0 10px 0;
    }

    .subtitle {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 6px;
      margin: 10px 0 40px 0;
    }

    .tournament-card {
      background-color: rgba(10, 10, 20, 0.7) !important;
      border-left: 3px solid #d52b1e;
      max-width: 500px;
      width: 100%;
      color: white;
    }

    .coming-soon {
      font-size: 1.2rem;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 10px;
    }

    .tournament-date {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 30px;
    }

    .enter-button {
      background-color: #d52b1e !important;
      color: white !important;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .footer {
      margin-top: auto;
      padding: 20px;
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .logo {
        height: 250px;
      }
      
      .title {
        font-size: 2.5rem;
      }
      
      .subtitle {
        font-size: 1.2rem;
        letter-spacing: 4px;
      }
      
      .tournament-date {
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      .logo {
        height: 180px;
      }
      
      .title {
        font-size: 1.8rem;
      }
      
      .subtitle {
        font-size: 1rem;
        letter-spacing: 2px;
      }
      
      .tournament-date {
        font-size: 1.6rem;
      }
    }
  `]
})
export class LandingComponent {}