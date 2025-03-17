import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="landing-container">
      <div class="login-section">
       <button 
        mat-raised-button 
        class="login-button"
       [routerLink]="['/auth']"
      >
        Iniciar Sesión / Registro
      </button>
      </div>

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
        <div class="card">
          <p class="coming-soon">PRÓXIMAMENTE</p>
          <p class="tournament-date">Fase final</p>
         
        </div>
        
        <!-- Footer -->
        <footer class="footer">
          © 2025 Chilean StarCraft Championship
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000000;  // Negro puro, en lugar de #0A0A14
  color: white;
  font-family: 'Roboto', sans-serif;
}

   .landing-container {
  background-color: #000000;  // Asegurar que el contenedor también sea negro
  position: relative;
  width: 100%;
  min-height: 100vh;
}

    .login-section {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }

    .login-button {
  background-color: #D52B1E !important;  // Forzar el color rojo
  color: white !important;  // Asegurar texto blanco
  font-weight: bold;
  text-transform: uppercase;
  border: none;  // Eliminar bordes por defecto
  padding: 8px 16px;
}

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
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

    .card {
      text-align: center;
      padding: 30px;
      border-radius: 8px;
      background-color: rgba(10, 10, 20, 0.7);
      border-left: 3px solid #d52b1e;
      max-width: 500px;
      width: 100%;
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
      background-color: #d52b1e;
      color: white;
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

    /* Responsive adjustments */
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

     .login-section {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 10;
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
      .enter-button {
  background-color: #d52b1e;
  color: red;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
  `]
})
export class LandingComponent {
  onLogin() {
    // Aquí puedes implementar la lógica de navegación al login
    // Por ejemplo:
    // this.router.navigate(['/login']);
    console.log('Login/Registro clickeado');
  }
}