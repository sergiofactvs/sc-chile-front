import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="container">
     <div class="login-section">
        <button 
          mat-raised-button 
          class="login-button"
          [routerLink]="['/']"
        >
          Volver al Inicio
        </button>
      </div>
      <!-- Logo -->
      <img 
        src="/assets/logo.png" 
        alt="Chilean StarCraft Championship Logo" 
        class="logo"
      >
      
      <!-- Título -->
      <h1 class="title">Chilean StarCraft</h1>
      <p class="subtitle">ADMIN PANEL</p>
      
      <!-- Formulario de Login -->
      <div class="card">
        <form 
          [formGroup]="loginForm" 
          (ngSubmit)="onLogin()"
          class="auth-form"
        >
          <input 
            type="email" 
            formControlName="email" 
            placeholder="Correo Electrónico"
            required
          >
          <input 
            type="password" 
            formControlName="password" 
            placeholder="Contraseña"
            required
          >
          <button 
            type="submit" 
            class="enter-button"
            [disabled]="loginForm.invalid || isLoading"
          >
            {{ isLoading ? 'CARGANDO...' : 'ENTRAR' }}
          </button>
          
          <p *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </form>
      </div>
      
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

    .tabs {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .tabs button {
      background: none;
      border: none;
      color: #aaa;
      font-size: 1rem;
      margin: 0 15px;
      padding-bottom: 10px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .tabs button.active {
      color: white;
      border-bottom-color: #d52b1e;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .name-group {
      display: flex;
      gap: 15px;
    }

    input {
      width: 100%;
      padding: 12px;
      background-color: rgba(30, 30, 50, 0.5);
      border: none;
      color: white;
      font-size: 1rem;
    }

    .enter-button {
      background-color: #d52b1e;
      color: white;
      border: none;
      padding: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 10px;
      cursor: pointer;
    }

    .enter-button:disabled {
      background-color: #666;
      cursor: not-allowed;
    }

    .forgot-password {
      color: #aaa;
      text-decoration: none;
      margin-top: 10px;
      font-size: 0.9rem;
    }

    .error-message {
      color: red;
      margin-top: 10px;
      text-align: center;
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

      .name-group {
        flex-direction: column;
        gap: 15px;
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
    }
    .login-section {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }

    .login-button {
      background-color: #D52B1E !important;
      color: white !important;
      font-weight: bold;
      text-transform: uppercase;
      border: none;
      padding: 8px 16px;
    }

    .container {
      position: relative; // Añadir para posicionamiento absoluto del botón
    }

    .error-message {
      color: red;
      margin-top: 10px;
      text-align: center;
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

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;  // Centrar elementos
  }

  input {
    width: 100%;  // Ancho completo
    max-width: 400px;  // Máximo ancho
    padding: 12px;
    background-color: rgba(30, 30, 50, 0.5);
    border: none;
    color: white;
    font-size: 1rem;
    box-sizing: border-box;  // Incluir padding en el ancho
  }

  .enter-button {
    width: 100%;
    max-width: 400px;  // Mismo ancho máximo que los inputs
    background-color: #d52b1e;
    color: white;
    border: none;
    padding: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 10px;
    cursor: pointer;
  }
  `]
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    // Verificar si el usuario ya está logueado con rol de Admin
    const token = this.authService.getToken();
    const userRole = this.authService.getUserRole();

    if (token && userRole === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }
  
  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            const userRole = this.authService.getUserRole();
            if (userRole === 'Admin') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.errorMessage = 'Acceso denegado. Se requieren permisos de administrador.';
            }
          } else {
            this.errorMessage = 'Credenciales inválidas';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al iniciar sesión:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
          } else if (error.status === 403) {
            this.errorMessage = 'No tienes permisos de administrador para acceder.';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo más tarde.';
          }
        }
      });
    }
  }
}